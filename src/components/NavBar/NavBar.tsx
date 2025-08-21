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
  const { mode, updateMode, wdgSelectorOpen, setWdgSelectorOpen } = useEditorContext();
  const drawerWidth = WIDGET_SELECTOR_WIDTH;

  const handleRuntimeClick = () => {
    if (mode === RUNTIME_MODE) updateMode(EDIT_MODE);
    else updateMode(RUNTIME_MODE);
  };

  const handleDownload = () => {
    // TODO: implement download logic
    console.log("Download clicked");
  };

  const handleUpload = () => {
    // TODO: implement upload logic
    console.log("Upload clicked");
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
            sx={{ mr: 2 }}
            size="small"
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexShrink: 0 }}>
            EPICS Web Suite
          </Typography>

          <Button
            variant="outlined"
            startIcon={<PlayArrowIcon />}
            onClick={handleRuntimeClick}
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
              <IconButton onClick={handleDownload}>
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Import file">
              <IconButton onClick={handleUpload}>
                <FileUploadIcon />
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
              <Button sx={{ color: "white" }}>Login</Button>
            </div>
          </Box>
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}
