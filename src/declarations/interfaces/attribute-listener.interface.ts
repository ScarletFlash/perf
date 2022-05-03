export interface AttributeListener {
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
