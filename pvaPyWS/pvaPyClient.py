from typing import Callable, Dict, Optional, List
from pvaccess import Channel, ProviderType


class PvaPyClient:
  """
  Manages PV subscriptions and writes using PvaPy with per-PV methods.
  """

  def __init__(self, handle_update: Callable[[str, object], None], provider=ProviderType.PVA):
    """
    handle_update: callable(pv_name: str, value: object)
    provider: ProviderType.PVA or ProviderType.CA
    """
    self._channels: Dict[str, Channel] = {}
    self._handle_update = handle_update
    self._provider = provider

  def _on_update(self, pv_name: str):
    """Internal callback for subscription updates."""

    def callback(value):
      self._handle_update(pv_name, value)

    return callback

  def subscribe(self, pv: str):
    """Subscribe to a single PV."""
    if pv in self._channels:
      return
    ch = Channel(pv, self._provider)
    ch.subscribe("monitor", self._on_update(pv))
    ch.startMonitor()
    self._channels[pv] = ch

  def subscribe_list(self, PVList: List[str]):
    """Start subscriptions for a list of PVs."""
    self._PVList = PVList
    for pv in PVList:
      if pv in self._channels:
        continue
      ch = Channel(pv, self._provider)
      ch.subscribe("monitor", self._on_update(pv))
      ch.startMonitor()
      self._channels[pv] = ch

  def unsubscribe(self, pv: str):
    """Unsubscribe from a single PV."""
    ch: Optional[Channel] = self._channels.pop(pv, None)
    if ch:
      ch.unsubscribe("monitor")
      ch.stopMonitor()

  def unsubscribe_all(self):
    """Unsubscribe from all PVs."""
    for ch in self._channels.values():
      ch.unsubscribe("monitor")
      ch.stopMonitor()
    self._channels.clear()

  def write_to_pv(self, pv: str, value):
    """Write a value to a PV (if subscribed)."""
    ch = self._channels.get(pv)
    if ch:
      ch.put(value)
