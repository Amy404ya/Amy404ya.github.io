import { defineConfig } from "umi";

const repositoryName = 'Amy404ya.github.io';

const isUserPage = repositoryName.includes('.github.io');
const publicPath = isUserPage ? '/' : `/${repositoryName}/`;
const base = isUserPage ? '/' : `/${repositoryName}/`;

export default defineConfig({
  plugins: [
    '@umijs/plugins/dist/model'
  ],
  model: {},
  title: `Amy's SecretHut`,
  publicPath,
  base,
  outputPath: 'dist',
  history: {
    type: 'browser',
  },
  routes: [
    { path: "/", component: "Home", name: 'Home' },
    { path: "/test", component: "Test", name: 'Test' },
    { path: "/training", component: "Training", name: 'Training',layout: false, },
    { path: '/*', redirect: '/', keepQuery: true },
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
