import asyncio
import json
import websockets
from os import getenv
from websockets.legacy.server import WebSocketServerProtocol
from typing import Dict, Set
from pvaPyClient import PvaPyClient
from pvParser import parse_pv, PVData
from pvaccess import ProviderType

subscriptions: Dict[str, Set[WebSocketServerProtocol]] = {} # map clients subscribed to each PV
client = None
default_protocol = getenv("EPICS_DEFAULT_PROTOCOL", "pva")

async def send_update(pv_name: str, pv_obj):
  pv_data: PVData = parse_pv(pv_obj)
  message: PVData = {
    "type": "update",
    "pv": pv_name,
    "value": pv_data.value,
    "valueText": pv_data.valueText,
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

  # Look up just the subscribers of this PV
  clients = subscriptions.get(pv_name, set())
  for ws in set(clients):
    try:
      await ws.send(data)
    except Exception:
      print(f"Error sending update to {ws}")


async def handler(ws: WebSocketServerProtocol):
  global client
  global default_protocol
  client_id = f"{ws.remote_address[0]}:{ws.remote_address[1]}"
  print(f"New connection from {client_id}")
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
        for pv in pv_list:
          if pv not in subscriptions:
            subscriptions[pv] = set()
          subscriptions[pv].add(ws)
          client.subscribe(client_id, pv)

      elif msg_type == "unsubscribe":
        pv_list = msg.get("pvs", [])
        for pv in pv_list:
          if pv in subscriptions:
            subscriptions[pv].discard(ws)
            if not subscriptions[pv]:
              del subscriptions[pv]
            client.unsubscribe(client_id, pv)

      elif msg_type == "write":
        pv_name = msg.get("pv")
        value = msg.get("value")
        if pv_name and value is not None:
          client.write_to_pv(pv_name, value)

      else:
        await ws.send(json.dumps({"type": "error", "message": "Unknown message type"}))

  except Exception as e:
    print(f"error handling message from {client_id}: {e}")

  finally:
    # Cleanup: remove this ws from all subscriptions
    print(f"client disconnected: {client_id}")
    for pv, clients in list(subscriptions.items()):
      clients.discard(ws)
      if not clients:
        del subscriptions[pv]
    client.unsubscribe_all(client_id)


async def main():
  async with websockets.serve(handler, "localhost", 8080):
    print("WebSocket server running on ws://localhost:8080")
    await asyncio.Future()

if __name__ == "__main__":
  asyncio.run(main())
