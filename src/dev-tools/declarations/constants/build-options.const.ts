import type { BuildOptions } from 'esbuild';
import type { SassPluginOptions } from 'esbuild-sass-plugin';
import { sassPlugin } from 'esbuild-sass-plugin';
import { Paths } from './paths.const';

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
