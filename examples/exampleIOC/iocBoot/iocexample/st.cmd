#!../../bin/linux-x86_64/example

< envPaths

cd "${TOP}"

dbLoadDatabase "dbd/example.dbd"
example_registerRecordDeviceDriver pdbbase

dbLoadRecords("./exampleApp/Db/example.db")

cd "${TOP}/iocBoot/${IOC}"
iocInit
