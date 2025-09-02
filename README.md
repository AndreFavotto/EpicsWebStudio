# EPICS Web Studio

No-code web drag and drop OPI builder for EPICS applications.

> NOTE: This app is under development, so not all planned features are yet functional, but feel free to try it out!

The gateway between EPICS and the browser is done via [./pvaPyWS](./pvaPyWS).

## Dependencies

- Docker (tested with 28.1.1)
- Docker Compose (tested with v2.35.1)

## Launch development version

1. Clone this repo

2. Create your .env: Since we don't yet use secrets or certificates, you can just copy [.env.example](./.env.example) into your `.env`.

```
cp .env.example .env
```

3. Launch the app: `docker compose -f docker-compose-dev.yml up`. The application should be available in `localhost:5173`.

## Link to EPICS

If launched via the compose file provided, no further configuration is needed. Tailoring of the EPICS communication configurations (default protocol (ca|pva), CA_ADDR_LIST, PVA_ADDR_LIST, etc) can be made in your `.env` file.

As is, the default protocol is set to pva. This means you can put the PV names directly in the "PV Name" field of the widgets if your IOC has a PVA server.
If you wish to use Channel Access instead, you can specify the protocol by typing `ca://PVNAME` in the PV field or change the default protocol directly in the `.env` file.

## Features

- Infinite pan/zoom canvas: gives you freedom to build your interface and test layouts;
  - Use the mouse scroll to zoom in/out. While middle button is clicked, pan mode is activated. A single click in the middle button re-centers the grid.
- Customizable grid: change size, background color and other properties as you wish. Widget snapping to grid is available as well.
- Edit and Runtime modes:
  - Edit mode: total freedom and control of your widgets.
  - Runtime: Communication to PVA/CA servers is established and information is updated live.
    > Hint: Only the widgets inside the "window area" (dashed in grey) are exported. You can edit the exported window size by opening the lateral menu while in edit mode.
- Multiple widgets (for now not that many... widgets are under development!)

## Notes

This is a React + TypeScript application. Several components and elements of the design are based in [Material UI library](https://mui.com/material-ui/)
