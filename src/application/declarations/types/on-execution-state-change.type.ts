import type { ExecutionState } from '../enums/execution-state.enum';

export type OnExecutionStateChange = (executionState: ExecutionState) => void;
