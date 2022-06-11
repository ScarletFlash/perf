import { Executor } from '@application/declarations/classes/executor.class';
import { Transpiler } from '@application/declarations/classes/transpiler.class';
import type { PerformanceReport } from '@application/declarations/types/performance-report.type';

export class ExecutionService {
  #sourceCode: string = '';
  #transpiledCode: string = '';
  #performanceReport: PerformanceReport = {
    executionTimeMs: []
  };

  readonly #transpiler: Transpiler = new Transpiler();
  readonly #executor: Executor = new Executor();

  public get performanceReport(): PerformanceReport {
    return this.#performanceReport;
  }

  public setSourceCode(code: string): void {
    if (code === this.#sourceCode) {
      return;
    }

    this.#sourceCode = code;
  }

  public async transpile(): Promise<void> {
    this.#transpiledCode = await this.#transpiler.transform(this.#sourceCode);
  }

  public async generateExecutionReport(): Promise<void> {
    this.#performanceReport = await this.#executor.run(this.#transpiledCode);
  }
}
