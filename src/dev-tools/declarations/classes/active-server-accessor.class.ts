import type { ServeResult } from 'esbuild';

const activeServerKey: unique symbol = Symbol();
type WithActiveServerProperty<T extends typeof globalThis> = T & {
  [activeServerKey]: ServeResult | undefined;
};

export class ActiveServerAccessor {
  public static register(activeServer: ServeResult): void {
    Object.defineProperty(globalThis, activeServerKey, {
      value: activeServer
    });
  }

  public static getExisting(): ServeResult | undefined {
    const context: typeof globalThis = globalThis;
    if (!ActiveServerAccessor.hasActiveServersProperty(context)) {
      return undefined;
    }
    return context[activeServerKey];
  }

  private static hasActiveServersProperty<T extends typeof globalThis>(
    context: T
  ): context is WithActiveServerProperty<T> {
    return activeServerKey in context;
  }
}
