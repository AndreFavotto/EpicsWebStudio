# SPDX-FileCopyrightText: 2003 Argonne National Laboratory
#
# SPDX-License-Identifier: EPICS

TOP=../..

include $(TOP)/configure/CONFIG
#----------------------------------------
#  ADD MACRO DEFINITIONS AFTER THIS LINE
#=============================

#=============================
# Build the IOC application

PROD_IOC = example
# example.dbd will be created and installed
DBD += example.dbd

# example.dbd will be made up from these files:
example_DBD += base.dbd

# Include dbd files from all support applications:
#example_DBD += xxx.dbd

# Add all the support libraries needed by this IOC
#example_LIBS += xxx

# example_registerRecordDeviceDriver.cpp derives from example.dbd
example_SRCS += example_registerRecordDeviceDriver.cpp

# Build the main IOC entry point on workstation OSs.
example_SRCS_DEFAULT += exampleMain.cpp
example_SRCS_vxWorks += -nil-
example_DBD += PVAServerRegister.dbd
example_DBD += qsrv.dbd
example_LIBS += qsrv
example_LIBS += $(EPICS_BASE_PVA_CORE_LIBS)

# Add support from base/src/vxWorks if needed
#example_OBJS_vxWorks += $(EPICS_BASE_BIN)/vxComLibrary

# Finally link to the EPICS Base libraries
example_LIBS += $(EPICS_BASE_IOC_LIBS)

#===========================

include $(TOP)/configure/RULES
#----------------------------------------
#  ADD RULES AFTER THIS LINE

