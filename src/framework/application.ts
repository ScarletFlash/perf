import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { RUNNING_SERVICES_ACCESS_KEY } from './declarations/constants/running-services-access-key.const';
import type { ContextWithRegistry } from './declarations/types/context-with-registry.type';
import type { ServiceConstructor } from './declarations/types/service-constructor.type';
import { getContextWithRunningServicesAccessKey } from './utilities/get-context-with-running-services-access-key.util';

type ComponentConstructor = CustomElementConstructor & {
  selector: PerfComponentSelector;
};

export class Application {
  public static getBackgroundService<T extends object>(serviceConstructor: ServiceConstructor<T>): T {
    const context: ContextWithRegistry = getContextWithRunningServicesAccessKey();
    const foundService: object | undefined = context[RUNNING_SERVICES_ACCESS_KEY].get(serviceConstructor);

    if (foundService instanceof serviceConstructor) {
      return foundService;
    }

    throw new Error('[Application] found dependency does not match the request');
  }

  public registerComponents(componentConstructors: ComponentConstructor[]): this {
    const registry: CustomElementRegistry = customElements;

    const componentConstructorBySelector: Map<PerfComponentSelector, ComponentConstructor> = new Map<
      PerfComponentSelector,
      ComponentConstructor
    >(
      componentConstructors.map((componentConstructor: ComponentConstructor) => [
        componentConstructor.selector,
        componentConstructor
      ])
    );

    componentConstructorBySelector.forEach((constructor: ComponentConstructor, selector: PerfComponentSelector) =>
      registry.define(selector, constructor)
    );

    return this;
  }

  public bootstrapBackgroundServices(serviceConstructors: ServiceConstructor[]): this {
    const context: ContextWithRegistry = getContextWithRunningServicesAccessKey();

    const serviceByConstructor: Map<ServiceConstructor, object> = new Map<ServiceConstructor, object>();
    context[RUNNING_SERVICES_ACCESS_KEY] = serviceByConstructor;

    serviceConstructors.forEach((serviceConstructor: ServiceConstructor) => {
      const instance: object = new serviceConstructor();
      serviceByConstructor.set(serviceConstructor, instance);
    });

    return this;
  }

  public applyGlobalStyles(globalStyles: string): this {
    const headStyleElement: HTMLStyleElement = document.createElement('style');
    headStyleElement.innerHTML = globalStyles;
    document.head.appendChild(headStyleElement);
    return this;
  }
}
