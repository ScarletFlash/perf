import type { WebComponentSelector } from './declarations/types/web-component-selector.type';
import globalStyles from './index.scss';

type ComponentConstructor = CustomElementConstructor & {
  selector: WebComponentSelector;
};

type ServiceConstructor<T extends object = object> = new (...parameters: unknown[]) => T;

const RUNNING_SERVICES_ACCESS_KEY: unique symbol = Symbol('running services access key');

export class Application {
  public registerComponents(componentConstructors: CustomElementConstructor[]): this {
    const registry: CustomElementRegistry = customElements;

    const componentConstructorBySelector: Map<WebComponentSelector, ComponentConstructor> = new Map<
      WebComponentSelector,
      ComponentConstructor
    >(
      componentConstructors.map((componentConstructor: ComponentConstructor) => [
        componentConstructor.selector,
        componentConstructor
      ])
    );

    componentConstructorBySelector.forEach((constructor: ComponentConstructor, selector: WebComponentSelector) =>
      registry.define(selector, constructor)
    );

    return this;
  }

  public bootstrapBackgroundServices(serviceConstructors: ServiceConstructor[]): this {
    globalThis[RUNNING_SERVICES_ACCESS_KEY] = new Map<ServiceConstructor, object>(
      serviceConstructors.map((serviceConstructor: ServiceConstructor) => [
        serviceConstructor,
        new serviceConstructor()
      ])
    );

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
