export class ExecutionService {
  #sourceCode: string = '';

  public setSourceCode(code: string): void {
    if (code === this.#sourceCode) {
      return;
    }

    this.#sourceCode = code;
  }

  public getTranspiled(): string {
    return '';
  }
}
