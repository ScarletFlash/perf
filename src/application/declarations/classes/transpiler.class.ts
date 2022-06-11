import type { TransformResult } from 'esbuild-wasm';
import { initialize, transform } from 'esbuild-wasm';
import { ContextualError } from './contextual-error.class';

export class Transpiler {
  #isInitialized: boolean = false;

  constructor() {
    initialize({
      wasmURL: 'esbuild.wasm'
    }).then(() => (this.#isInitialized = true));
  }

  public async transform(code: string): Promise<string> {
    if (!this.#isInitialized) {
      throw new ContextualError(this, 'ESBuild initialization is not done.');
    }

    const transformResult: TransformResult = await transform(code, {
      minify: true,
      loader: 'ts'
    });
    return transformResult.code;
  }
}
