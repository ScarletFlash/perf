import { log } from 'console';
import { serve, ServeOptions, ServeResult } from 'esbuild';
import { join } from 'path';
import { buildOptions } from './build-options.config';

const scriptDirectoryPath: string = __dirname;
const sourcesDirPath: string = join(scriptDirectoryPath, './../dist');

const serveOptions: ServeOptions = {
  servedir: sourcesDirPath
};

serve(serveOptions, buildOptions).then(({ host, port }: ServeResult) => {
  log(`Server is listening at http://${host}:${port}/`);
});
