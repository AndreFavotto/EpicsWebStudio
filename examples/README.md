# Examples

This folder provides files with example code for using EWS.

## EPICS database demo

1. In a machine with EPICS installed, run [exampleIOC](exampleIOC).
   - it is a standard EPICS IOC, so edit the RELEASE file with the path to your BASE and compile it. Then, run the st.cmd
     Alternatively, run [example.db](./exampleIOC/exampleApp/Db/example.db) directly with softIocPVA: `softIocPVA -d example.db`.

> If you are running the IOC in a different machine than the web app, make sure to edit `EPICS_PVA_ADDR_LIST`/`EPICS_CA_ADDR_LIST` with the host address (see [.env](../.env.example))

2. Launch EWS. With the import button (navbar), upload `example-opi.json`.
