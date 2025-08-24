# Examples

This folder provides files with example code for using EWS.

## EPICS database demo

In a machine with EPICS installed, run [example.db](example.db) with softIocPVA:

```bash
 softIocPVA -d test.db
```

Given a properly configured `EPICS_PVA_ADDR_LIST`/`EPICS_CA_ADDR_LIST` with the host address (see [.env](../.env.example)),
the application should be able to see the PVs.
