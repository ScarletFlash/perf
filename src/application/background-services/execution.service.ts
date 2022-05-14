import { Executor } from '@application/declarations/classes/executor.class';
import { Transpiler } from '@application/declarations/classes/transpiler.class';

export class ExecutionService {
  #sourceCode: string = '';
  readonly #transpiler: Transpiler = new Transpiler();
  readonly #executor: Executor = new Executor();

  public setSourceCode(code: string): void {
    if (code === this.#sourceCode) {
      return;
    }

    this.#sourceCode = code;
    this.getTranspiled().then((result: string) => this.#executor.run(result));
  }

  public async getTranspiled(): Promise<string> {
    const transpiled: string = await this.#transpiler.transform(this.#sourceCode);
    return transpiled;
  }
}
