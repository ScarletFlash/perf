import type { BuildOptions } from 'esbuild';
import { sassPlugin, SassPluginOptions } from 'esbuild-sass-plugin';
import { Paths } from './_paths';

const sassPluginOptions: SassPluginOptions = {
  type: 'css-text',
  transform: (css: string) => css.replaceAll('\n', '').replaceAll(' ', '')
};

export const buildOptions: BuildOptions = {
  bundle: true,
  outdir: Paths.resultBundleDirectory,
  entryPoints: [`${Paths.sourcesDirectory}/index.ts`],
  resolveExtensions: ['.ts', '.js', '.scss'],
  plugins: [sassPlugin(sassPluginOptions)],
  platform: 'browser',
  format: 'esm',
  charset: 'utf8',
  minify: true,
  target: 'esnext',
  treeShaking: true,
  tsconfig: Paths.tsConfig,
  sourcemap: true,
  legalComments: 'external'
};
