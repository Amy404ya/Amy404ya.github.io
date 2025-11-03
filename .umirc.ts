import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "Home" },
    { path: "/test", component: "Test" },
  ],
  npmClient: 'pnpm',
});
