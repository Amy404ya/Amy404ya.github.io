import { defineConfig } from "umi";

const repositoryName = 'Amy404ya.github.io';

const isUserPage = repositoryName.includes('.github.io');
const publicPath = isUserPage ? '/' : `/${repositoryName}/`;
const base = isUserPage ? '/' : `/${repositoryName}/`;

export default defineConfig({
  title: 'SecretHut',
  publicPath,
  base,
  history: {
    type: 'hash',
  },
  routes: [
    { path: "/", component: "Home" },
    { path: "/test", component: "Test" },
  ],
  npmClient: 'pnpm',
  favicons: ['/assets/favicon.ico'],
  metas: [
    {
      name: 'viewport',
      content:
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0',
    },
  ],
});
