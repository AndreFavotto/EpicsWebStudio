# Examples

This folder provides files with example code for using the library.

## EPICS database demo

In a machine with EPICS installed, run [example.db](example.db) with softIocPVA:

```bash
 softIocPVA -d test.db
```

Given a properly configured [setenv.sh](docker/pvws/setenv.sh) file (specifically EPICS_PVA_ADDR_LIST), the application
should be able to see the PVs.
