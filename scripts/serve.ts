import { log } from 'console';
import { BuildOptions, serve, ServeOptions, ServeResult } from 'esbuild';
import { sassPlugin, SassPluginOptions } from 'esbuild-sass-plugin';
import { join } from 'path';

const scriptDirectoryPath: string = __dirname;
const sourcesDirPath: string = join(scriptDirectoryPath, './../src');

const serveOptions: ServeOptions = {
  servedir: sourcesDirPath
};

const sassPluginOptions: SassPluginOptions = {
  type: 'css'
};

const buildOptions: BuildOptions = {
  bundle: true,
  outdir: sourcesDirPath,
  entryPoints: [`${sourcesDirPath}/index.ts`, `${sourcesDirPath}/index.scss`],
  plugins: [sassPlugin(sassPluginOptions)]
};

serve(serveOptions, buildOptions).then(({ host, port }: ServeResult) => {
  log(`Server is listening at http://${host}:${port}/`);
});
