# Web Socket Settings
export PV_DEFAULT_TYPE=pva
export PV_THROTTLE_MS=100         # allow max 10 scalar updates per second
export PV_ARRAY_THROTTLE_MS=500   # allow max 2 array updates per second
export PV_WRITE_SUPPORT=true

# Channel Access Settings
export EPICS_CA_ADDR_LIST=localhost
export EPICS_CA_MAX_ARRAY_BYTES=1000000

# PV Access Settings
export EPICS_PVA_ADDR_LIST=localhost
export EPICS_PVA_AUTO_ADDR_LIST=YES
# export EPICS_PVA_BROADCAST_PORT=5076
# export EPICS_PVA_NAME_SERVERS=
