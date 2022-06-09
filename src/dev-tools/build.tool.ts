import { build } from 'esbuild';
import { cp, readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { buildOptions } from './declarations/constants/build-options.const';
import { Paths } from './declarations/constants/paths.const';

export async function buildScript(outputDirectoryPath?: string): Promise<void> {
  const targetOutputDirectoryPath: string = outputDirectoryPath ?? Paths.resultBundleDirectory;
  const targetIndexHtmlPath: string = join(targetOutputDirectoryPath, '/index.html');
  const targetEsBuildWasmPath: string = join(targetOutputDirectoryPath, '/esbuild.wasm');
  const targetAssetsPath: string = join(targetOutputDirectoryPath, '/assets/');

  await Promise.resolve()
    .then(() => rm(targetOutputDirectoryPath, { force: true, recursive: true }))
    .then(() => build({ ...buildOptions, outdir: targetOutputDirectoryPath }))
    .then(() => readFile(Paths.rawHtmlEntryPoint, 'utf-8'))
    .then((originalFileContent: string) => originalFileContent.replaceAll('.scss"', '.css"'))
    .then((processedFileContent: string) => writeFile(targetIndexHtmlPath, processedFileContent, 'utf-8'))
    .then(() =>
      cp(Paths.rawAssetsDirectory, targetAssetsPath, {
        recursive: true
      })
    )
    .then(() => cp(Paths.esBuildWasmDependency, targetEsBuildWasmPath));
}

(async () => await buildScript())();
