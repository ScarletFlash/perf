export class ContentRenderer {
  readonly #hostElementRef: HTMLElement;

  constructor(hostElementRef: HTMLElement) {
    this.#hostElementRef = hostElementRef;
  }

  public setContent(): void {
    const span: HTMLSpanElement = document.createElement('span');
    span.textContent = 'lol kek';
    this.#hostElementRef.appendChild(span);
  }
}
