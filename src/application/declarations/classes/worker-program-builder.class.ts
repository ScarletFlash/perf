import { arrayHas2Elements } from '@application/utilities/array-has-2-elements.util';
import type { PerformanceReport } from '../interfaces/performance-report.interface';

(globalThis as any).SourceCodeMark = class Mark {
  public static embeddedScriptPosition(): void {
    return;
  }
};

interface ScriptParts {
  beforeMark: string;
  afterMark: string;
}

interface IterationMarkNames {
  iteration: number;
  beforeRun: string;
  afterRun: string;
}

export class WorkerProgramBuilder {
  static get #scriptParts(): ScriptParts {
    const rawScriptSourceCode: string = WorkerProgramBuilder.#rawScript.toString();
    const scriptParts: string[] = `(${rawScriptSourceCode})()`.split(
      'globalThis.SourceCodeMark.embeddedScriptPosition()'
    );

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!arrayHas2Elements(scriptParts)) {
      throw new Error('[WorkerProgramBuilder] invalid script splitting result');
    }

    const [beforeMark, afterMark]: [string, string] = scriptParts;
    return { beforeMark, afterMark };
  }

  static readonly #rawScript: VoidFunction = () => {
    class WorkerProgram {
      constructor() {
        const iterations: number[] = new Array(100).fill(null).map((_: void, index: number) => index);
        const iterationsMarks: IterationMarkNames[] = iterations.map((index: number) =>
          WorkerProgram.#getIterationMarks(index)
        );

        iterationsMarks.forEach(({ beforeRun, afterRun }: IterationMarkNames) => {
          performance.mark(beforeRun);
          this.#run();
          performance.mark(afterRun);
        });

        const durationByIteration: [number, number][] = iterationsMarks.map(
          ({ iteration, beforeRun, afterRun }: IterationMarkNames) => {
            const measure: PerformanceMeasure = performance.measure(`${iteration}__measure`, beforeRun, afterRun);
            return [iteration, measure.duration];
          }
        );
        const performanceReport: PerformanceReport = durationByIteration.reduce(
          (accumulatedValue: PerformanceReport, [iteration, executionTimeMs]: [number, number]): PerformanceReport => {
            const incomingReportPart: PerformanceReport = {
              [iteration]: {
                executionTimeMs
              }
            };
            return Object.assign(accumulatedValue, incomingReportPart);
          },
          {}
        );

        postMessage(performanceReport);
      }

      static #getIterationMarks(iteration: number): IterationMarkNames {
        return {
          iteration,
          beforeRun: `${iteration}__before-run`,
          afterRun: `${iteration}__after-run`
        };
      }

      #run(): void {
        (globalThis as any).SourceCodeMark.embeddedScriptPosition();
      }
    }

    new WorkerProgram();
  };

  public getResultScript(code: string): Blob {
    const { beforeMark, afterMark }: ScriptParts = WorkerProgramBuilder.#scriptParts;
    const resultScript: string = [beforeMark, code, afterMark].join('\n');
    return new Blob([resultScript], { type: 'text/javascript' });
  }
}
