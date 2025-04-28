import Live2DViewer from "@/components/live2D/live2DViewer";
import UI from "@/components/ui/ui";
import "./styles/globals.css";
import { SessionProvider } from "./contexts/sessionContext";
import { SettingProvider } from "./contexts/settingContext";

export default function App() {
  return (
    <SettingProvider>
      <SessionProvider>
        <UI />
        <Live2DViewer />
      </SessionProvider>
    </SettingProvider>
  );
}
