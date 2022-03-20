import type { BuildOptions } from 'esbuild';
import { sassPlugin, SassPluginOptions } from 'esbuild-sass-plugin';
import { join } from 'path';

const scriptDirectoryPath: string = __dirname;
const sourcesDirPath: string = join(scriptDirectoryPath, './../src');
const resultBundleDirPath: string = join(scriptDirectoryPath, './../dist');

const sassPluginOptions: SassPluginOptions = {
  type: 'css-text'
};

export const buildOptions: BuildOptions = {
  bundle: true,
  outdir: resultBundleDirPath,
  entryPoints: [`${sourcesDirPath}/index.ts`],
  resolveExtensions: ['.ts', '.js', '.scss'],
  plugins: [sassPlugin(sassPluginOptions)],
  platform: 'browser',
  format: 'iife'
};
