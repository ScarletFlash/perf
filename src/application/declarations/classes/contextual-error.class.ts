export class ContextualError<T extends object> extends Error {
  constructor(context: T, message: string) {
    const className: string = typeof context === 'function' ? context.name : context.constructor.name;
    const resultMessage: string = String(`[${className}] ${message}`).trim();
    super(resultMessage);
  }

  public static withoutMessage<T extends object>(context: T): ContextualError<T> {
    return new ContextualError(context, '');
  }
}
