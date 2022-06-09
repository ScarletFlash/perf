import { join } from 'path';

export namespace Paths {
  const currentFileDirectory: string = __dirname;
  const rootDirectory: string = join(currentFileDirectory, './../../../../');

  export const nodeModules: string = join(rootDirectory, './node_modules/');
  export const tsConfig: string = join(rootDirectory, './tsconfig.browser.json');

  export const sourcesDirectory: string = join(rootDirectory, './src');
  export const applicationSourcesDirectory: string = join(sourcesDirectory, './application');
  export const resultBundleDirectory: string = join(rootDirectory, './dist');
  export const tempServeDirectory: string = join(rootDirectory, './.serve-dir');

  export const rawHtmlEntryPoint: string = join(applicationSourcesDirectory, './index.html');
  export const rawAssetsDirectory: string = join(applicationSourcesDirectory, './assets/');

  export const esBuildWasmDependency: string = join(nodeModules, './esbuild-wasm/esbuild.wasm');
  export const codeIconDependency: string = join(
    nodeModules,
    'monaco-editor/min/vs/base/browser/ui/codicons/codicon/codicon.ttf'
  );
  export const editorStylesDependency: string = join(nodeModules, 'monaco-editor/min/vs/editor/editor.main.css');
}
