# pvaPyWS - pvaPy Web Socket

This folder provides the source code for the pvaPy Web Socket, used as bridge between PVA/CA and the web application.
The CA/PVA library used is [pvaPy](https://github.com/epics-base/pvaPy), and the general web socket concept was based on
[PV Web Socket (PVWS)](https://github.com/ornl-epics/pvws).

### Why not using PVWS directly?

> it actually started with it, but we needed:

- Direct subscription to other fields  
   Users may want to use a widget linked directly to something like `pva://myPV.DESC`, or even operate devices with various
  fields other than VAL, as it is done for the [motor record](https://epics.anl.gov/bcda/synApps/motor/motorRecord.html).
  As of now, PVWS does not support direct field subscription (at least not without workarounds).
- Simplified source code: only the required parts are defined and easily tailored to WEISS.
- Application decoupling
