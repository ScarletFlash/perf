import type { BuildOptions } from 'esbuild';
import { sassPlugin, SassPluginOptions } from 'esbuild-sass-plugin';
import { Paths } from './_paths';

const sassPluginOptions: SassPluginOptions = {
  type: 'css-text',
  transform: (css: string) => css.replaceAll('\n', '')
};

/* eslint-disable @typescript-eslint/naming-convention */
export const buildOptions: Omit<BuildOptions, 'outdir'> = {
  bundle: true,
  entryPoints: {
    index: `${Paths.applicationSourcesDirectory}/index.ts`,
    'editor.worker': `${Paths.nodeModules}/monaco-editor/esm/vs/editor/editor.worker.js`,
    'json.worker': `${Paths.nodeModules}/monaco-editor/esm/vs/language/json/json.worker`,
    'css.worker': `${Paths.nodeModules}/monaco-editor/esm/vs/language/css/css.worker`,
    'html.worker': `${Paths.nodeModules}/monaco-editor/esm/vs/language/html/html.worker`,
    'ts.worker': `${Paths.nodeModules}/monaco-editor/esm/vs/language/typescript/ts.worker`,
    'esbuild.worker': `${Paths.nodeModules}/esbuild-wasm/esm/browser.min.js`
  },
  entryNames: '[name].bundle',
  resolveExtensions: ['.ts', '.js', '.scss'],
  plugins: [sassPlugin(sassPluginOptions)],
  platform: 'browser',
  format: 'iife',
  charset: 'utf8',
  minify: true,
  target: 'esnext',
  treeShaking: true,
  tsconfig: Paths.tsConfig,
  sourcemap: true,
  legalComments: 'none',
  splitting: false
};
/* eslint-enable @typescript-eslint/naming-convention */
