import type { WorkerRequestMessageType } from '../enums/worker-request-message-type.enum';

export interface WorkerRequestMessage<T extends WorkerRequestMessageType = WorkerRequestMessageType> {
  readonly type: T;
}
