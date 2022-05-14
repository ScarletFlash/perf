import { initialize, transform, TransformResult } from 'esbuild-wasm';

export class Transpiler {
  #isInitialized: boolean = false;

  constructor() {
    initialize({
      wasmURL: 'esbuild.wasm'
    }).then(() => (this.#isInitialized = true));
  }

  public async transform(code: string): Promise<string> {
    if (!this.#isInitialized) {
      throw new Error('[Transpiler] ESBuild initialization is not done.');
    }

    const transformResult: TransformResult = await transform(code, {
      minify: true,
      loader: 'ts'
    });
    return transformResult.code;
  }
}
