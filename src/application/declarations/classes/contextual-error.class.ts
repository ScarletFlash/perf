export class ContextualError<T extends object> extends Error {
  constructor(context: T, message: string) {
    const resultMessage: string = String(`[${context.constructor.name}] ${message}`).trim();
    super(resultMessage);
  }

  public static withoutMessage<T extends object>(context: T): ContextualError<T> {
    return new ContextualError(context, '');
  }
}
