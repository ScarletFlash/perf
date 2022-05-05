const enum PipelineStatus {
  Code = 'code',
  Configuration = 'configuration',
  Analysis = 'analysis'
}

interface RangeOptions {
  min: number;
  max: number;
}

export class PipelineStateService {
  constructor() {
    console.log('running');
  }

  readonly #percentageByState: Map<PipelineStatus, number> = new Map<PipelineStatus, number>([
    [PipelineStatus.Code, 25],
    [PipelineStatus.Configuration, 50],
    [PipelineStatus.Analysis, 75]
  ]);

  #currentState: PipelineStatus = PipelineStatus.Code;
  public get currentState(): PipelineStatus {
    return this.#currentState;
  }

  #currentPercentage: number = 0;
  public get currentPercentage(): number {
    return this.#currentPercentage;
  }

  public setState(currentState: PipelineStatus): void {
    this.#currentState = currentState;

    const targetPercentage: number | undefined = this.#percentageByState.get(currentState);
    if (targetPercentage === undefined) {
      return;
    }
    this.#setPercentage(targetPercentage);
  }

  #setPercentage(percentage: number): void {
    this.#currentPercentage = PipelineStateService.#getIntegerInRange(percentage, {
      min: 0,
      max: 100
    });
  }

  static #getIntegerInRange(input: number, { min, max }: RangeOptions): number {
    const roundedInteger: number = Math.round(input);

    if (roundedInteger < min) {
      return min;
    }

    if (roundedInteger > max) {
      return max;
    }

    return roundedInteger;
  }
}
