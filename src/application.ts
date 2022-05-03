import type { WebComponentSelector } from './declarations/types/web-component-selector.type';
import globalStyles from './index.scss';

type ComponentConstructor = CustomElementConstructor & {
  selector: WebComponentSelector;
};

type ServiceConstructor = new () => object;

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
    const runningServicesAccessKey: symbol = Symbol('running services access key');

    globalThis[runningServicesAccessKey] = serviceConstructors.map(
      (serviceConstructor: ServiceConstructor) => new serviceConstructor()
    );

    return this;
  }

  public applyGlobalStyles(): this {
    const headStyleElement: HTMLStyleElement = document.createElement('style');
    headStyleElement.innerHTML = globalStyles;
    document.head.appendChild(headStyleElement);
    return this;
  }
}
