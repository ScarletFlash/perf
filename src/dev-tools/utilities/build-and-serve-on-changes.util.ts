import { log } from 'console';
import type { BuildOptions, ServeOptions, ServeResult } from 'esbuild';
import { serve } from 'esbuild';
import { mkdir, mkdtemp, readdir, rm } from 'fs/promises';
import { join } from 'path';
import { ActiveServerAccessor } from '../declarations/classes/active-server-accessor.class';
import { buildScript } from './../build.tool';
import { buildOptions as commonBuildOptions } from './../declarations/constants/build-options.const';
import { Paths } from './../declarations/constants/paths.const';

export async function buildAndServeOnChanges(): Promise<void> {
  await mkdir(Paths.tempServeDirectory, { recursive: true });
  const bundleDirectoryPath: string = await mkdtemp(`${Paths.tempServeDirectory}/`);

  await buildScript(bundleDirectoryPath);

  const serveOptions: ServeOptions = {
    servedir: bundleDirectoryPath
  };

  const buildOptions: BuildOptions = { ...commonBuildOptions, outdir: bundleDirectoryPath };

  const existingServeDirectoryNames: string[] = await readdir(Paths.tempServeDirectory);
  await Promise.all(
    existingServeDirectoryNames
      .filter((directoryName: string) => !bundleDirectoryPath.endsWith(directoryName))
      .map((directoryName: string) => join(Paths.tempServeDirectory, directoryName))
      .map(async (oldServingDirectoryPath: string) => await rm(oldServingDirectoryPath, { recursive: true }))
  );

  const activeServer: ServeResult | undefined = ActiveServerAccessor.getExisting();
  if (activeServer !== undefined) {
    activeServer.stop();
  }

  await serve(serveOptions, buildOptions).then((runningServer: ServeResult) => {
    const { host, port }: ServeResult = runningServer;

    if (activeServer === undefined) {
      log(`Server is running: http://${host}:${port}/`);
    }

    ActiveServerAccessor.register(runningServer);
  });
}
