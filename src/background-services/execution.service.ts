import { Transpiler } from '@declarations/classes/transpiler.class';

export class ExecutionService {
  #sourceCode: string = '';
  readonly #transpiler: Transpiler = new Transpiler();

  public setSourceCode(code: string): void {
    if (code === this.#sourceCode) {
      return;
    }

    this.#sourceCode = code;
    this.getTranspiled().then((result: string) => alert(result));
  }

  public async getTranspiled(): Promise<string> {
    const transpiled: string = await this.#transpiler.transform(this.#sourceCode);
    return transpiled;
  }
}
