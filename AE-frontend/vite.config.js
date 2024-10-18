import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(() => {
  return {
    server: {
      host: "0.0.0.0",  // Expose to all network interfaces
      port: 3000,       // You can specify any port you want
      https: {
        key: "./frontend2-privateKey.key",
        cert: "./frontend2.crt",
      },
    },
    build: {
      outDir: "build",
    },
    plugins: [react()],
  };
});
