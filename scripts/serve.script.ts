import { log } from 'console';
import { BuildOptions, serve, ServeOptions, ServeResult } from 'esbuild';
import { FileChangeInfo, mkdtemp, rm, watch } from 'fs/promises';
import { stdin } from 'process';
import { emitKeypressEvents } from 'readline';
import { buildScript } from './build.script';
import { buildOptions as commonBuildOptions } from './_build-options';
import { Paths } from './_paths';
import { BuildUtilities } from './_utilities';

type ServerFunction = (event?: FileChangeInfo<string | Buffer>) => void;

interface KeyPressEvent {
  name: string;
  ctrl: boolean;
}

function isKeyPressEvent(event: unknown): event is KeyPressEvent {
  if (typeof event !== 'object' || event === null) {
    return false;
  }

  const eventKeys: Set<keyof KeyPressEvent> = new Set<keyof KeyPressEvent>(['ctrl', 'name']);
  return Array.from(eventKeys).every((eventKey: keyof KeyPressEvent) => eventKey in event);
}

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

    let activeServer: ServeResult | undefined;
    const server: ServerFunction = () => {
      BuildUtilities.runDebounced(async () => {
        const bundleDirectoryPath: string = temporaryDirectoryPath;
        await buildScript(bundleDirectoryPath);

        const serveOptions: ServeOptions = {
          servedir: bundleDirectoryPath
        };
        const buildOptions: BuildOptions = { ...commonBuildOptions, outdir: bundleDirectoryPath };
        if (activeServer !== undefined) {
          activeServer.stop();
        }

        await serve(serveOptions, buildOptions).then((runningServer: ServeResult) => {
          const { host, port }: ServeResult = runningServer;

          if (activeServer === undefined) {
            log(`Server is listening at http://${host}:${port}/`);
          }

          activeServer = runningServer;
        });
      });
    };

    server();

    for await (const event of watcher) {
      server(event);
    }
  } catch {
    await removeTemporaryDirectory();
  }

  emitKeypressEvents(stdin);
  stdin.on('keypress', (_: unknown, event: unknown) => {
    if (!isKeyPressEvent(event)) {
      return;
    }

    if (event.name.toLowerCase() === 'c' && event.ctrl) {
      abortController.abort();
    }
  });
  stdin.setRawMode(true);
  stdin.resume();
})();
