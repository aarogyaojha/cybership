export class CarrierError extends Error {
  constructor(
    public carrier: string,
    public code:
      | 'AUTH_FAILED'
      | 'RATE_LIMITED'
      | 'SERVER_ERROR'
      | 'PARSE_ERROR'
      | 'TIMEOUT'
      | 'VALIDATION_ERROR',
    message: string,
    public statusCode?: number,
    public raw?: unknown,
  ) {
    super(message);
    this.name = 'CarrierError';
  }
}
