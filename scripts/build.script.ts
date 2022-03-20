import { build } from 'esbuild';
import { readFile, rm, writeFile } from 'fs/promises';
import { join } from 'path';
import { buildOptions } from './build-options.config';

const scriptDirectoryPath: string = __dirname;

const sourcesPath: string = join(scriptDirectoryPath, './../src/');
const distPath: string = join(scriptDirectoryPath, './../dist/');

const rawHtmlEntryPointPath: string = join(sourcesPath, './index.html');
const resultHtmlEntryPointPath: string = join(distPath, './index.html');

rm(distPath, { force: true, recursive: true })
  .then(() => build(buildOptions))
  .then(() => readFile(rawHtmlEntryPointPath, 'utf-8'))
  .then((originalFileContent: string) => originalFileContent.replaceAll('.scss"', '.css"'))
  .then((processedFileContent: string) => writeFile(resultHtmlEntryPointPath, processedFileContent, 'utf-8'));
