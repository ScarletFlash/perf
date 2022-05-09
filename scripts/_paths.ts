import { join } from 'path';

export namespace Paths {
  const scriptDirectory: string = __dirname;
  const rootDirectory: string = join(scriptDirectory, './../');

  export const nodeModules: string = join(rootDirectory, './node_modules/');

  export const tsConfig: string = join(rootDirectory, './tsconfig.app.json');

  export const sourcesDirectory: string = join(rootDirectory, './src');
  export const resultBundleDirectory: string = join(rootDirectory, './dist');

  export const rawHtmlEntryPoint: string = join(sourcesDirectory, './index.html');

  export const rawAssetsDirectory: string = join(sourcesDirectory, './assets/');

  export const esBuildWasm: string = join(nodeModules, './esbuild-wasm/esbuild.wasm');
}
