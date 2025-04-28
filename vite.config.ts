import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      onwarn(warning, defaultWarn) {
        const id = warning.loc?.file || warning.id;
        // 파일 경로에 ignore-this-file.ts 가 포함되면 무시
        if (id && id.includes("src/ignore-this-file.ts")) {
          return;
        }
        // 그 외는 기본 처리
        defaultWarn(warning);
      },
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    exclude: [],
  },
});
