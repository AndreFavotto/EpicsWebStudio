import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      ReactAutomationStudio: path.resolve(__dirname, "./submodules/React-Automation-Studio/ReactApp/src"),
    },
  },
  plugins: [react()],
});
