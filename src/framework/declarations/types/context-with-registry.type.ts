import type { RUNNING_SERVICES_ACCESS_KEY } from '../constants/running-services-access-key.const';
import type { ServiceConstructor } from './service-constructor.type';

export type ContextWithRegistry = typeof globalThis & {
  [RUNNING_SERVICES_ACCESS_KEY]: Map<ServiceConstructor, object>;
};
