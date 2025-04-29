import Live2DViewer from "@/components/live2D/live2DViewer";
import UI from "@/components/ui/ui";
import "./styles/globals.css";
import { SettingProvider } from "./contexts/settingContext";

export default function App() {
  return (
    <SettingProvider>
      <UI />
      <Live2DViewer />
    </SettingProvider>
  );
}
