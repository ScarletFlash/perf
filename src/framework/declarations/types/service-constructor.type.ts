export type ServiceConstructor<T extends object = object> = new (...parameters: unknown[]) => T;
