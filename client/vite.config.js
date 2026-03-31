import { VitePWA } from "vite-plugin-pwa";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: false,

        pwaAssets: {
          disabled: false,
          config: true,
        },

        manifest: {
          name: "Simple Checkout System",
          short_name: "SCS",
          description: "A glorified calculator for quick self-checkout",
          theme_color: "#ffffff",
        },

        workbox: {
          globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
        },

        devOptions: {
          enabled: false,
          navigateFallback: "index.html",
          suppressWarnings: true,
          type: "module",
        },
      }),
    ],
    define: {
      "import.meta.env.PRODUCTS_ENDPOINT": JSON.stringify(
        env.PRODUCTS_ENDPOINT ?? "/products.json",
      ),
    },
  });
};
