export class ValidationException extends Error {
  public readonly message: any;

  /**
   * The base Nest Application exception, which is handled by the default Exceptions Handler.
   * If you throw an exception from your HTTP route handlers, Nest will map them to the appropriate HTTP response and send to the client.
   *
   * When `response` is an object:
   * - object will be stringified and returned to the user as a JSON response,
   *
   * When `response` is a string:
   * - Nest will create a response with two properties:
   * ```
   * message: response,
   * statusCode: X
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(private readonly response: string | object) {
    super();
    this.message = response;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  public getResponse(): string | object {
    return this.response;
  }

  public getStatus(): number {
    return 422;
  }
}
