import type { WebComponentSelector } from './declarations/types/web-component-selector.type';
import globalStyles from './index.scss';

type ComponentConstructor = CustomElementConstructor & {
  selector: WebComponentSelector;
};

export class Application {
  public registerComponents(componentsConstructor: CustomElementConstructor[]): this {
    const registry: CustomElementRegistry = customElements;

    const componentConstructorBySelector: Map<WebComponentSelector, ComponentConstructor> = new Map<
      WebComponentSelector,
      ComponentConstructor
    >(
      componentsConstructor.map((componentConstructor: ComponentConstructor) => [
        componentConstructor.selector,
        componentConstructor
      ])
    );

    componentConstructorBySelector.forEach((constructor: ComponentConstructor, selector: WebComponentSelector) =>
      registry.define(selector, constructor)
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
