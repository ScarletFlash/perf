import { RUNNING_SERVICES_ACCESS_KEY } from '@framework/declarations/constants/running-services-access-key.const';
import type { ContextWithRegistry } from '@framework/declarations/types/context-with-registry.type';
import type { ServiceConstructor } from '@framework/declarations/types/service-constructor.type';
import { objectHasProperty } from './object-has-property.util';

export function getContextWithRunningServicesAccessKey(): ContextWithRegistry {
  const context: typeof globalThis = globalThis;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!objectHasProperty(context, RUNNING_SERVICES_ACCESS_KEY)) {
    Object.defineProperty(context, RUNNING_SERVICES_ACCESS_KEY, {
      value: new Map<ServiceConstructor, object>()
    });
  }

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!objectHasProperty(context, RUNNING_SERVICES_ACCESS_KEY)) {
    throw new Error('[getContextWithRunningServicesAccessKey] Running services registry creation failed');
  }

  if (contextHasRunningServicesRegistry(context)) {
    return context;
  }

  throw new Error('[getContextWithRunningServicesAccessKey] Running services registry created with invalid type');
}

function contextHasRunningServicesRegistry(
  context: typeof globalThis & {
    [RUNNING_SERVICES_ACCESS_KEY]: unknown;
  }
): context is ContextWithRegistry {
  return context[RUNNING_SERVICES_ACCESS_KEY] instanceof Map;
}
