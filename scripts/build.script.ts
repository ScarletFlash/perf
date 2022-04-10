import { build } from 'esbuild';
import { cp, readFile, rm, writeFile } from 'fs/promises';
import { buildOptions } from './_build-options';
import { Paths } from './_paths';

export async function buildScript(): Promise<void> {
  await Promise.resolve()
    .then(() => rm(Paths.resultBundleDirectory, { force: true, recursive: true }))
    .then(() => build(buildOptions))
    .then(() => readFile(Paths.rawHtmlEntryPoint, 'utf-8'))
    .then((originalFileContent: string) => originalFileContent.replaceAll('.scss"', '.css"'))
    .then((processedFileContent: string) => writeFile(Paths.resultHtmlEntryPoint, processedFileContent, 'utf-8'))
    .then(() =>
      cp(Paths.rawAssetsDirectory, Paths.resultAssetsDirectory, {
        recursive: true
      })
    );
}

(async () => await buildScript())();
