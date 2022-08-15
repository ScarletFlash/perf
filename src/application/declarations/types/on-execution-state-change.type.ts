import type { ExecutionStatus } from '../enums/execution-status.enum';

export type OnExecutionStateChange = (executionStatus: ExecutionStatus) => void;
