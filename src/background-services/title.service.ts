export class TitleService {
  static readonly #prefix: string = 'PERF';
  static readonly #separator: string = '›';

  public setTitle(newTitle: string): void {
    globalThis.document.title = `${TitleService.#prefix} ${TitleService.#separator} ${newTitle}`;
  }

  public clearTitle(): void {
    globalThis.document.title = TitleService.#prefix;
  }
}
