import type { AttributeListener } from '@application/declarations/interfaces/attribute-listener.interface';
import { Application } from '@framework/application';
import type { PerfComponentSelector } from '@framework/declarations/types/perf-component-selector.type';
import { $color_background } from '@styles/variables';
import { IconComponent } from './../icon/component';
import componentStyles from './component.scss';

enum ObservedAttributeName {
  Text = 'text',
  Icon = 'icon',
  IsActive = 'is_active',
  URL = 'url'
}

export class SidebarNavigationItemComponent extends HTMLElement implements AttributeListener {
  public static readonly selector: PerfComponentSelector = 'perf-sidebar-navigation-item';

  public static readonly observedAttributeName: typeof ObservedAttributeName = ObservedAttributeName;

  readonly #tileElement: HTMLElement = SidebarNavigationItemComponent.#getTileElement();
  readonly #backgroundElement: HTMLElement = SidebarNavigationItemComponent.#getBackgroundElement();
  readonly #iconComponent: IconComponent = SidebarNavigationItemComponent.#getIconElement();
  readonly #textElement: HTMLSpanElement = SidebarNavigationItemComponent.#getTextElement();

  #isActive: boolean = false;
  #url: string = '';

  constructor() {
    super();

    const shadowRoot: ShadowRoot = this.attachShadow({ mode: 'closed' });
    const style: HTMLStyleElement = document.createElement('style');

    this.#tileElement.appendChild(this.#backgroundElement);
    this.#tileElement.appendChild(this.#iconComponent);
    this.#tileElement.appendChild(this.#textElement);

    style.innerHTML = componentStyles;

    shadowRoot.appendChild(style);
    shadowRoot.appendChild(this.#tileElement);
  }

  public static get observedAttributes(): ObservedAttributeName[] {
    return [
      ObservedAttributeName.Text,
      ObservedAttributeName.Icon,
      ObservedAttributeName.IsActive,
      ObservedAttributeName.URL
    ];
  }

  public get url(): string {
    return this.#url;
  }

  static #getTileElement(): HTMLElement {
    const tileElement: HTMLAnchorElement = document.createElement('a');
    tileElement.classList.add('tile');
    return tileElement;
  }

  static #getBackgroundElement(): HTMLElement {
    const backgroundElement: HTMLElement = document.createElement('div');
    backgroundElement.classList.add('tile__background');
    return backgroundElement;
  }

  static #getTextElement(): HTMLSpanElement {
    const textElement: HTMLSpanElement = document.createElement('span');
    textElement.classList.add('tile__text');
    return textElement;
  }

  static #getIconElement(): IconComponent {
    const iconComponent: IconComponent = Application.getComponentInstance(IconComponent);
    iconComponent.classList.add('tile__icon');
    iconComponent.setAttribute(IconComponent.observedAttributeName.Color, $color_background);
    return iconComponent;
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (oldValue === newValue) {
      return;
    }

    if (name === ObservedAttributeName.Icon) {
      this.#iconComponent.setAttribute(IconComponent.observedAttributeName.Source, newValue);
    }

    if (name === ObservedAttributeName.Text) {
      this.#textElement.innerText = newValue;
    }

    if (name === ObservedAttributeName.IsActive) {
      const targetState: boolean = newValue === 'true';
      this.setActivationState(targetState);
    }

    if (name === ObservedAttributeName.URL) {
      this.#tileElement.setAttribute('href', newValue);
      this.#url = newValue;
    }
  }

  public setActivationState(targetState: boolean): void {
    if (this.#isActive === targetState) {
      return;
    }

    this.#isActive = targetState;

    const activeModifierName: string = 'tile_active';
    if (this.#isActive) {
      this.#tileElement.classList.add(activeModifierName);
      return;
    }
    this.#tileElement.classList.remove(activeModifierName);
  }
}
