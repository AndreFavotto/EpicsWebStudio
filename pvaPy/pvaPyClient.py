from typing import Callable, List, Dict
from pvaccess import Channel, ProviderType

class PvaPyClient:
    """
    Manages PV subscriptions and writes using PvaPy.
    """

    def __init__(self, handle_update: Callable[[str, object], None], provider=ProviderType.PVA):
        """
        handle_update: callable(pv_name: str, value: object)
        provider: ProviderType.PVA or ProviderType.CA
        """
        self._channels: Dict[str, Channel] = {}
        self._PVList: List[str] = []
        self._handle_update = handle_update
        self._provider = provider

    def _on_update(self, pv_name: str):
      """Internal callback for subscription updates (synchronous)."""
      def callback(value):
          self._handle_update(pv_name, value)
      return callback
    
    def start(self, PVList: List[str]):
        """Start subscriptions for a list of PVs."""
        self._PVList = PVList
        for pv in PVList:
            if pv in self._channels:
                continue
            ch = Channel(pv, self._provider)
            ch.subscribe("monitor", self._on_update(pv))
            ch.startMonitor()
            self._channels[pv] = ch

    def stop(self):
        """Stop all subscriptions and close channels."""
        for ch in self._channels.values():
            ch.unsubscribe("monitor")
            ch.stopMonitor()
        self._channels.clear()
        self._PVList = []

    def write_to_pv(self, pv: str, value):
        """Write a value to a PV."""
        ch = self._channels.get(pv)
        if not ch:
          return
        ch.put(value)
