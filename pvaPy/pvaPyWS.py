import asyncio
import json
import websockets
from websockets.legacy.server import WebSocketServerProtocol
from typing import Dict, Set
from pvaPy.pvaPyClient import PvaPyClient
from pvParser import parse_pv, PVValue
from pvaccess import ProviderType

subscriptions: Dict[WebSocketServerProtocol, Set[str]] = {}
manager = None

async def send_update(pv_name: str, pv_obj):
    pv_value: PVValue = parse_pv(pv_obj)
    message = {
        "type": "update",
        "pv": pv_name,
        "value": pv_value.value,
        "alarm": pv_value.alarm.__dict__ if pv_value.alarm else None,
        "timeStamp": pv_value.timeStamp.__dict__ if pv_value.timeStamp else None,
        "display": pv_value.display.__dict__ if pv_value.display else None,
        "control": pv_value.control.__dict__ if pv_value.control else None,
        "valueAlarm": pv_value.valueAlarm.__dict__ if pv_value.valueAlarm else None,
        "b64dbl": pv_value.b64dbl,
        "b64flt": pv_value.b64flt,
        "b64int": pv_value.b64int,
        "b64srt": pv_value.b64srt,
        "b64byt": pv_value.b64byt,
    }
    # remove None values
    message = {k: v for k, v in message.items() if v is not None}
    data = json.dumps(message)
    for ws, pv_set in subscriptions.items():
        if pv_name in pv_set:
            try:
                await ws.send(data)
            except:
                pass

async def handler(ws: WebSocketServerProtocol):
    global manager
    subscriptions[ws] = set()
    loop = asyncio.get_running_loop()

    def manager_callback(pv_name, pv_obj):
        asyncio.run_coroutine_threadsafe(send_update(pv_name, pv_obj), loop)

    if not manager:
        manager = PvaPyClient(manager_callback, provider=ProviderType.PVA)

    try:
        async for message in ws:
            msg = json.loads(message)
            msg_type = msg.get("type")
            if msg_type == "subscribe":
                pv_list = msg.get("pvs", [])
                subscriptions[ws].update(pv_list)
                manager.start(list(subscriptions[ws]))
            elif msg_type == "unsubscribe":
                pv_list = msg.get("pvs", [])
                subscriptions[ws].difference_update(pv_list)
                manager.start(list({pv for s in subscriptions.values() for pv in s}))
            elif msg_type == "write":
                pv_name = msg.get("pv")
                value = msg.get("value")
                if pv_name and value is not None:
                    manager.write_to_pv(pv_name, value)
            else:
                await ws.send(json.dumps({"type": "error", "message": "Unknown message type"}))
    finally:
        subscriptions.pop(ws, None)
        all_pvs = {pv for s in subscriptions.values() for pv in s}
        manager.start(list(all_pvs))

async def main():
    async with websockets.serve(handler, "localhost", 8080):
        print("WebSocket server running on ws://localhost:8080")
        await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
