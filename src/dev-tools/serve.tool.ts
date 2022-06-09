import type { FileChangeInfo } from 'fs/promises';
import { watch } from 'fs/promises';
import { Paths } from './declarations/constants/paths.const';
import { buildAndServeOnChanges } from './utilities/build-and-serve-on-changes.util';
import { runDebounced } from './utilities/run-debounced.util';

type ServerFunction = (event?: FileChangeInfo<string | Buffer>) => void;

(async () => {
  const server: ServerFunction = () => runDebounced(buildAndServeOnChanges);

  const watcher: AsyncIterable<FileChangeInfo<string>> = watch(Paths.sourcesDirectory, {
    recursive: true,
    persistent: true
  });

  server();

  for await (const event of watcher) {
    server(event);
  }
})();
