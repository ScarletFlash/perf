import { PipelineStatus } from '@declarations/enums/pipeline-status.enum';
import { getIntegerInRange } from '@utilities/get-integer-in-range.util';

export class PipelineStateService {
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
    this.#currentPercentage = getIntegerInRange(percentage, {
      min: 0,
      max: 100
    });
  }
}
