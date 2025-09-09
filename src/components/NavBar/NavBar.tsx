import MuiAppBar from "@mui/material/AppBar";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Tooltip from "@mui/material/Tooltip";
import { COLORS, RUNTIME_MODE, EDIT_MODE, APP_SRC_URL } from "../../constants/constants.ts";
import { useEditorContext } from "../../context/useEditorContext.tsx";
import { WIDGET_SELECTOR_WIDTH } from "../../constants/constants.ts";
import "./NavBar.css";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import GitHubIcon from "@mui/icons-material/GitHub";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface StyledAppBarProps extends MuiAppBarProps {
  open?: boolean;
  drawerWidth: number;
}

const ModeSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-switchBase": {
    transitionDuration: "300ms",
    "&.Mui-checked": {
      "& + .MuiSwitch-track": {
        backgroundColor: COLORS.highlighted,
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&::before, &::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&::before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&::after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const StyledAppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "drawerWidth",
})<StyledAppBarProps>(({ theme, open, drawerWidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: COLORS.titleBarColor,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function NavBar() {
  const { mode, updateMode, wdgSelectorOpen, setWdgSelectorOpen, downloadWidgets, loadWidgets } = useEditorContext();
  const drawerWidth = WIDGET_SELECTOR_WIDTH;

  const handleDownload = () => {
    void downloadWidgets();
  };

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        loadWidgets(text);
      } catch (err) {
        console.error("Failed to read file:", err);
      }
    };
    input.click();
  };

  return (
    <Box sx={{ display: "flex" }}>
      <StyledAppBar component="nav" position="fixed" open={wdgSelectorOpen} drawerWidth={drawerWidth}>
        <Toolbar sx={{ minHeight: 56, px: 2 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setWdgSelectorOpen((o) => !o)}
            sx={{
              mr: 2,
              size: "small",
              visibility: mode === EDIT_MODE ? "visible" : "hidden",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            noWrap
            component="div"
            sx={{
              fontSize: 22,
              ml: 4,
              mr: 3,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".5rem",
              textDecoration: "none",
            }}
          >
            WEISS
          </Typography>
          <FormControlLabel
            control={
              <ModeSwitch
                checked={mode === RUNTIME_MODE}
                onChange={() => updateMode(mode === RUNTIME_MODE ? EDIT_MODE : RUNTIME_MODE)}
                color="default"
                sx={{ mr: 1 }}
              />
            }
            label="Runtime"
            sx={{ color: "white", ml: 3 }}
          />
          <Box sx={{ flexGrow: 1 }} />
          {/* Right-side actions */}
          <Box className="rightButtons" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Export file">
              <Button
                onClick={handleDownload}
                startIcon={<FileDownloadIcon />}
                sx={{ color: "white", textTransform: "none" }}
              >
                Export
              </Button>
            </Tooltip>
            <Tooltip title="Import file">
              <Button
                onClick={handleUpload}
                startIcon={<FileUploadIcon />}
                sx={{ color: "white", textTransform: "none" }}
              >
                Import
              </Button>
            </Tooltip>
            <Box sx={{ flexGrow: 1 }} /> {/* pushes the icons to the right */}
            <Tooltip title="Help / Shortcuts">
              <IconButton sx={{ color: "white" }}>
                <HelpOutlineIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="GitHub Repository">
              <IconButton sx={{ color: "white" }} href={APP_SRC_URL} target="_blank" rel="noopener noreferrer">
                <GitHubIcon />
              </IconButton>
            </Tooltip>
          </Box>{" "}
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}
