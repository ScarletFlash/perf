import { build } from 'esbuild';
import { cp, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { buildOptions } from './declarations/constants/build-options.const';
import { Paths } from './declarations/constants/paths.const';

export async function buildScript(outputDirectoryPath?: string): Promise<void> {
  const targetOutputDirectoryPath: string = outputDirectoryPath ?? Paths.resultBundleDirectory;
  const targetAssetsPath: string = join(targetOutputDirectoryPath, '/assets/');

  await Promise.resolve()
    .then(() => rm(targetOutputDirectoryPath, { force: true, recursive: true }))
    .then(() => build({ ...buildOptions, outdir: targetOutputDirectoryPath }))
    .then(() => readFile(Paths.rawHtmlEntryPoint, 'utf-8'))
    .then((originalFileContent: string) => originalFileContent.replaceAll('.scss"', '.css"'))
    .then((processedFileContent: string) => {
      const targetIndexHtmlPath: string = join(targetOutputDirectoryPath, '/index.html');
      return writeFile(targetIndexHtmlPath, processedFileContent, 'utf-8');
    })
    .then(() =>
      cp(Paths.rawAssetsDirectory, targetAssetsPath, {
        recursive: true
      })
    )
    .then(() => {
      const targetEsBuildWasmPath: string = join(targetOutputDirectoryPath, '/esbuild.wasm');
      return cp(Paths.esBuildWasmDependency, targetEsBuildWasmPath);
    })
    .then(() => {
      const targetCodiconPath: string = join(targetAssetsPath, '/codicon.ttf');
      return cp(Paths.codeIconDependency, targetCodiconPath);
    })
    .then(() => {
      const targetStylesPath: string = join(targetAssetsPath, '/editor.main.css');
      return cp(Paths.editorStylesDependency, targetStylesPath);
    });
}

(async () => await buildScript())();
