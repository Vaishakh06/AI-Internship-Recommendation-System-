import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // 👇 ADD THIS BLOCK
  server: {
    host: true, // This exposes the app to the network (0.0.0.0)
    port: 5173, // Ensures it stays on the expected port
  },
});