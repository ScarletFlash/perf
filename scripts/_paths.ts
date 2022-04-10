import { join } from 'path';

export namespace Paths {
  export const scriptDirectory: string = __dirname;
  export const rootDirectory: string = join(__dirname, './../');

  export const tsConfig: string = join(rootDirectory, './tsconfig.app.json');

  export const sourcesDirectory: string = join(rootDirectory, './src');
  export const resultBundleDirectory: string = join(rootDirectory, './dist');

  export const rawHtmlEntryPoint: string = join(sourcesDirectory, './index.html');
  export const resultHtmlEntryPoint: string = join(resultBundleDirectory, './index.html');

  export const rawAssetsDirectory: string = join(sourcesDirectory, './assets/');
  export const resultAssetsDirectory: string = join(resultBundleDirectory, './assets/');
}
