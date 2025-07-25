import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { COLORS, RUNTIME_MODE, EDIT_MODE } from "../../shared/constants";
import { useEditorContext } from "../Utils/EditorContext";

export default function NavBar() {
  const { mode, setMode } = useEditorContext();
  const handleRuntimeClick = () => {
    if (mode == RUNTIME_MODE) setMode(EDIT_MODE);
    else setMode(RUNTIME_MODE);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        component="nav"
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: COLORS.titleBarColor,
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div">
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
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            {mode == EDIT_MODE ? "Preview" : "Edit"}
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ mr: 3 }}>
            <Button sx={{ color: "white", mr: 5 }}>Contributions</Button>
            <Button sx={{ color: "white" }}>Login</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
