import MuiAppBar from "@mui/material/AppBar";
import type { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import { COLORS, RUNTIME_MODE, EDIT_MODE, APP_SRC_URL } from "../../constants/constants.ts";
import { useEditorContext } from "../../context/useEditorContext.tsx";
import { WIDGET_SELECTOR_WIDTH } from "../../constants/constants.ts";
import "./NavBar.css";

interface StyledAppBarProps extends MuiAppBarProps {
  open?: boolean;
  drawerWidth: number;
}

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

  const handleModeToggleClick = () => {
    if (mode === RUNTIME_MODE) updateMode(EDIT_MODE);
    else updateMode(RUNTIME_MODE);
  };

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
          {mode == EDIT_MODE && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setWdgSelectorOpen((o) => !o)}
              sx={{ mr: 2 }}
              size="small"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="div" sx={{ flexShrink: 0 }}>
            EPICS Web Studio
          </Typography>

          <Button
            variant="outlined"
            startIcon={<PlayArrowIcon />}
            onClick={handleModeToggleClick}
            sx={{
              color: "white",
              borderColor: "white",
              ml: 2,
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              flexShrink: 0,
              width: 110,
            }}
            size="small"
          >
            {mode === EDIT_MODE ? "Preview" : "Edit"}
          </Button>
          <div className="fileButtons">
            <Tooltip title="Export file">
              <IconButton onClick={handleDownload} sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}>
                <FileDownloadIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Import file">
              <IconButton onClick={handleUpload} sx={{ "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" } }}>
                <FileUploadIcon sx={{ color: "white" }} />
              </IconButton>
            </Tooltip>
          </div>
          <Box sx={{ flexGrow: 1 }} />

          {/* Right-side actions */}
          <Box className="rightButtons">
            <div>
              <Button sx={{ color: "white" }}>
                <Link href={APP_SRC_URL} target="_blank" underline="none" color="inherit">
                  Contributions
                </Link>
              </Button>
            </div>
          </Box>
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}
