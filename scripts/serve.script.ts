import { log } from 'console';
import { serve, ServeOptions, ServeResult } from 'esbuild';
import { cp, FileChangeInfo, mkdtemp, rm, watch } from 'fs/promises';
import { buildScript } from './build.script';
import { buildOptions } from './_build-options';
import { Paths } from './_paths';
import { BuildUtilities } from './_utilities';

(async () => {
  const abortController: AbortController = new AbortController();
  const signal: AbortSignal = abortController.signal;

  const temporaryDirectoryPath: string = await mkdtemp('.serve-dir__');
  const removeTemporaryDirectory: () => Promise<void> = async (): Promise<void> =>
    await rm(temporaryDirectoryPath, {
      recursive: true
    });
  try {
    const watcher: AsyncIterable<FileChangeInfo<string>> = watch(Paths.sourcesDirectory, {
      recursive: true,
      signal
    });

    const server: (event?: FileChangeInfo<string | Buffer>) => void = () => {
      BuildUtilities.runDebounced(async () => {
        await buildScript();

        await cp(Paths.resultBundleDirectory, temporaryDirectoryPath, {
          recursive: true
        });

        console.log(temporaryDirectoryPath);

        const serveOptions: ServeOptions = {
          servedir: temporaryDirectoryPath
        };

        await serve(serveOptions, { ...buildOptions, outdir: temporaryDirectoryPath }).then(
          ({ host, port }: ServeResult) => log(`Server is listening at http://${host}:${port}/`)
        );
      });
    };

    server();

    for await (const event of watcher) {
      server(event);
    }
  } catch {
    await removeTemporaryDirectory();
  }
})();
