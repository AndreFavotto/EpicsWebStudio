from typing import Callable, Dict, Set
from pvaccess import Channel, ProviderType, PvString, PvDouble, PvInt, ScalarType, NtEnum
from os import getenv

default_protocol = getenv("EPICS_DEFAULT_PROTOCOL", "pva")

class PvaPyClient:
  """
  Manages PV subscriptions per client_id.
  """

  def __init__(self, handle_update: Callable[[str, object], None]):
    """
    handle_update: callable(pv_name: str, value: object)
    provider: ProviderType.PVA or ProviderType.CA
    """
    self._channels: Dict[str, Channel] = {}
    self._subscribers: Dict[str, Set[str]] = {}  # pv_name -> set(client_ids)
    self._handle_update = handle_update
    self._default_provider = ProviderType.CA if default_protocol.lower() == "ca" else ProviderType.PVA

  def _on_update(self, pv_name: str):
    """Internal callback for subscription updates."""
    def callback(value):
      self._handle_update(pv_name, value)
    return callback
  
  def _on_write(self, pv):
    """Internal callback for pv write handling."""
    # do nothing for now
    return

  def _on_write_error(self, code):
    """Internal callback for pv write error handling."""
    print('Write failed. Returned error code: %s' % code)
    
  def _make_pvobject(self, ch, value):
    field = ch.get().getStructureDict()
    # Simple scalar types
    if 'value' in field:
        vfield = field['value']
        # Enum: dict with 'index' and 'choices'
        if isinstance(vfield, dict) and 'index' in vfield and 'choices' in vfield:
            val = ch.get()["value"]
            choices = [str(c) for c in val['choices']]
            return NtEnum(choices, int(value))
        # Scalar INT
        elif vfield == ScalarType.INT:
            return PvInt(int(value))
        # Scalar DOUBLE
        elif vfield == ScalarType.DOUBLE:
            return PvDouble(float(value))
        # Scalar STRING
        elif vfield == ScalarType.STRING:
            return PvString(str(value))
    # fallback
    return PvString(str(value))
  
  def subscribe(self, client_id: str, pv_name: str):
    """Subscribe a single client to a PV."""
    if pv_name not in self._channels:
        if "://" in pv_name:
            pv_provider, _, pv = pv_name.partition("://")
            provider = ProviderType.CA if pv_provider.lower() == "ca" else ProviderType.PVA
            ch = Channel(pv, provider)
        else:
            ch = Channel(pv_name, self._default_provider)
        ch.subscribe("monitor", self._on_update(pv_name))
        ch.startMonitor()
        self._channels[pv_name] = ch
        self._subscribers[pv_name] = set()

    self._subscribers[pv_name].add(client_id)

  def unsubscribe(self, client_id: str, pv_name: str):
    """Unsubscribe a single client from a PV."""
    if pv_name not in self._subscribers:
      return

    self._subscribers[pv_name].discard(client_id)

    # If no clients remain, stop monitoring
    if not self._subscribers[pv_name]:
      ch = self._channels.pop(pv_name, None)
      if ch:
        ch.unsubscribe("monitor")
        ch.stopMonitor()
      del self._subscribers[pv_name]

  def unsubscribe_all(self, client_id: str):
    """Remove client_id from all PV subscriptions."""
    empty_pvs = []
    for pv, clients in self._subscribers.items():
      clients.discard(client_id)
      if not clients:
        empty_pvs.append(pv)

    # Stop monitors for PVs with no subscribers left
    for pv in empty_pvs:
      ch = self._channels.pop(pv, None)
      if ch:
        ch.unsubscribe("monitor")
        ch.stopMonitor()
      del self._subscribers[pv]

  def write_to_pv(self, pv: str, value):
    """Write a value to a PV (only if subscribed)."""
    ch = self._channels.get(pv)
    if not ch:
      print(f"Trying to write to not subscribed {pv}. Ignoring.")
      return
    obj = self._make_pvobject(ch, value)
    ch.asyncPut(obj, self._on_write, self._on_write_error)
