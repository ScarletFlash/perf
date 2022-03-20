import type { BuildOptions } from 'esbuild';
import { sassPlugin, SassPluginOptions } from 'esbuild-sass-plugin';
import { join } from 'path';

const scriptDirectoryPath: string = __dirname;
const rootDirPath: string = join(scriptDirectoryPath, './../');
const sourcesDirPath: string = join(rootDirPath, './src');
const resultBundleDirPath: string = join(rootDirPath, './dist');
const tsConfigPath: string = join(rootDirPath, './tsconfig.app.json');

const sassPluginOptions: SassPluginOptions = {
  type: 'css-text',
  transform: (css: string) => css.replaceAll('\n', '').replaceAll(' ', '')
};

export const buildOptions: BuildOptions = {
  bundle: true,
  outdir: resultBundleDirPath,
  entryPoints: [`${sourcesDirPath}/index.ts`],
  resolveExtensions: ['.ts', '.js', '.scss'],
  plugins: [sassPlugin(sassPluginOptions)],
  platform: 'browser',
  format: 'esm',
  charset: 'utf8',
  minify: true,
  target: 'esnext',
  treeShaking: true,
  tsconfig: tsConfigPath,
  sourcemap: true,
  legalComments: 'external'
};
