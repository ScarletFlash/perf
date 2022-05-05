import { Application } from '@application';
import { PipelineStateService } from './pipeline-state.service';

export class ExecutionService {
  readonly #pipelineService: PipelineStateService = Application.getBackgroundService(PipelineStateService);

  constructor() {
    console.log('running');
  }
}
