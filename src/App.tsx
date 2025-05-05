import Live2DViewer from "@/components/live2D/Live2DViewer";
import UI from "@/components/ui/ui";
import "./styles/globals.css";
import { SettingProvider } from "./contexts/settingContext";
import { LiveAPIProvider } from "./contexts/liveApiContext";

export default function App() {
  return (
    <SettingProvider>
      <LiveAPIProvider url={`${import.meta.env.VITE_SERVER_URL}`}>
        <UI />
        <Live2DViewer />
      </LiveAPIProvider>
    </SettingProvider>
  );
}
