import { log } from 'console';
import { BuildOptions, serve, ServeOptions, ServeResult } from 'esbuild';
import { join } from 'path';

const scriptDirectoryPath: string = __dirname;
const sourcesDirPath: string = join(scriptDirectoryPath, './../src');

const serveOptions: ServeOptions = {
  servedir: sourcesDirPath
};

const buildOptions: BuildOptions = {
  bundle: true,
  outdir: sourcesDirPath,
  entryPoints: [`${sourcesDirPath}/index.ts`]
};

serve(serveOptions, buildOptions).then(({ host, port }: ServeResult) => {
  log(`Server is listening at http://${host}:${port}/`);
});
