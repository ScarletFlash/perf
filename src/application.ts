import { PerfComponentSelector } from '@declarations/types/perf-component-selector.type';
import globalStyles from './index.scss';

type ComponentConstructor = CustomElementConstructor & {
  selector: PerfComponentSelector;
};

type ServiceConstructor<T extends object = object> = new (...parameters: unknown[]) => T;

const RUNNING_SERVICES_ACCESS_KEY: unique symbol = Symbol('running services access key');

export class Application {
  public registerComponents(componentConstructors: CustomElementConstructor[]): this {
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
    const serviceByConstructor: Map<ServiceConstructor, object> = new Map<ServiceConstructor, object>();
    globalThis[RUNNING_SERVICES_ACCESS_KEY] = serviceByConstructor;

    serviceConstructors.forEach((serviceConstructor: ServiceConstructor) => {
      const instance: object = new serviceConstructor();
      serviceByConstructor.set(serviceConstructor, instance);
    });

    return this;
  }

  public applyGlobalStyles(): this {
    const headStyleElement: HTMLStyleElement = document.createElement('style');
    headStyleElement.innerHTML = globalStyles;
    document.head.appendChild(headStyleElement);
    return this;
  }

  public static getBackgroundService<T extends object>(serviceConstructor: ServiceConstructor<T>): T {
    const runningServicesReference: unknown = globalThis[RUNNING_SERVICES_ACCESS_KEY];
    if (runningServicesReference instanceof Map) {
      return runningServicesReference.get(serviceConstructor);
    }
    return undefined;
  }
}
