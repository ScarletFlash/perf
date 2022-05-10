import { PerformanceReport } from '@declarations/interfaces/performance-report.interface';
import { arrayHas2Elements } from '@utilities/array-has-2-elements.util';

globalThis.SourceCodeMark = class Mark {
  public static embeddedScriptPosition(): void {}
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
  static readonly #rawScript: VoidFunction = () => {
    class WorkerProgram {
      constructor() {
        const iterations: number[] = new Array(100).fill(null).map((_, index: number) => index);
        const iterationsMarks: IterationMarkNames[] = iterations.map((index: number) =>
          WorkerProgram.#getIterationMarks(index)
        );

        iterationsMarks.forEach(({ beforeRun, afterRun }: IterationMarkNames) => {
          performance.mark(beforeRun);
          this.#run();
          performance.mark(afterRun);
        });

        const performanceReport: PerformanceReport = iterationsMarks
          .map(({ iteration, beforeRun, afterRun }: IterationMarkNames) => {
            const measure: PerformanceMeasure = performance.measure(`${iteration}__measure`, beforeRun, afterRun);
            return [iteration, measure.duration];
          })
          .reduce((accumulatedValue: PerformanceReport, [iteration, executionTimeMs]: [number, number]) => {
            const incomingReportPart: PerformanceReport = {
              [iteration]: {
                executionTimeMs
              }
            };
            return Object.assign(accumulatedValue, incomingReportPart);
          }, {});

        postMessage(performanceReport);
      }

      #run(): void {
        globalThis.SourceCodeMark.embeddedScriptPosition();
      }

      static #getIterationMarks(iteration: number): IterationMarkNames {
        return {
          iteration,
          beforeRun: `${iteration}__before-run`,
          afterRun: `${iteration}__after-run`
        };
      }
    }

    new WorkerProgram();
  };

  static get #scriptParts(): ScriptParts {
    const rawScriptSourceCode: string = WorkerProgramBuilder.#rawScript.toString();
    const scriptParts: string[] = `(${rawScriptSourceCode})()`.split(
      'globalThis.SourceCodeMark.embeddedScriptPosition()'
    );

    if (!arrayHas2Elements(scriptParts)) {
      throw new Error('[WorkerProgramBuilder] invalid script splitting result');
    }

    const [beforeMark, afterMark]: [string, string] = scriptParts;
    return { beforeMark, afterMark };
  }

  public getResultScript(code: string): Blob {
    const { beforeMark, afterMark }: ScriptParts = WorkerProgramBuilder.#scriptParts;
    const resultScript: string = [beforeMark, code, afterMark].join('\n');
    return new Blob([resultScript], { type: 'text/javascript' });
  }
}
