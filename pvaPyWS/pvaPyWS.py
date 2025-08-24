import asyncio
import json
import websockets
from os import getenv
from websockets.legacy.server import WebSocketServerProtocol
from typing import Dict, Set
from pvaPyClient import PvaPyClient
from pvParser import parse_pv, PVData
from pvaccess import ProviderType

subscriptions: Dict[WebSocketServerProtocol, Set[str]] = {}
client = None
default_protocol = getenv("EPICS_DEFAULT_PROTOCOL", "pva")

async def send_update(pv_name: str, pv_obj):
  pv_data: PVData = parse_pv(pv_obj)
  message: PVData = {
    "type": "update",
    "pv": pv_name,
    "value": pv_data.value,
    "alarm": pv_data.alarm.__dict__ if pv_data.alarm else None,
    "timeStamp": pv_data.timeStamp.__dict__ if pv_data.timeStamp else None,
    "display": pv_data.display.__dict__ if pv_data.display else None,
    "control": pv_data.control.__dict__ if pv_data.control else None,
    "valueAlarm": pv_data.valueAlarm.__dict__ if pv_data.valueAlarm else None,
    "b64dbl": pv_data.b64dbl,
    "b64flt": pv_data.b64flt,
    "b64int": pv_data.b64int,
    "b64srt": pv_data.b64srt,
    "b64byt": pv_data.b64byt,
  }
  # remove None values
  message = {k: v for k, v in message.items() if v is not None}
  data = json.dumps(message)
  for ws, pv_set in subscriptions.items():
    if pv_name in pv_set:
      try:
        await ws.send(data)
      except Exception:
        pass


async def handler(ws: WebSocketServerProtocol):
  global client
  global default_protocol
  subscriptions[ws] = set()
  loop = asyncio.get_running_loop()

  def message_callback(pv_name, pv_obj):
    asyncio.run_coroutine_threadsafe(send_update(pv_name, pv_obj), loop)

  if not client:
    provider = ProviderType.CA if default_protocol.lower() == "ca" else ProviderType.PVA
    client = PvaPyClient(message_callback, provider=provider)

  try:
    async for message in ws:
      msg = json.loads(message)
      msg_type = msg.get("type")
      if msg_type == "subscribe":
        pv_list = msg.get("pvs", [])
        subscriptions[ws].update(pv_list)
        client.subscribe_list(list(subscriptions[ws]))
      elif msg_type == "unsubscribe":
        pv_list = msg.get("pvs", [])
        for pv in pv_list:
          if pv in subscriptions[ws]:
            subscriptions[ws].remove(pv)
            client.unsubscribe(pv)
      elif msg_type == "write":
        pv_name = msg.get("pv")
        value = msg.get("value")
        if pv_name and value is not None:
          client.write_to_pv(pv_name, value)
      else:
        await ws.send(json.dumps({"type": "error", "message": "Unknown message type"}))
  except Exception as e:
    print(f"error handling message: {e}")
    
async def main():
  async with websockets.serve(handler, "localhost", 8080):
    print("WebSocket server running on ws://localhost:8080")
    await asyncio.Future()

if __name__ == "__main__":
  asyncio.run(main())
