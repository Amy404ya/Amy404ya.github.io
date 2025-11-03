import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", component: "Home" },
    { path: "/test", component: "Test" },
  ],
  npmClient: 'pnpm',
  base: '/Amy404ya.github.io/',
  publicPath: '/Amy404ya.github.io/',
  history: {
    type: 'browser',
  },
});
