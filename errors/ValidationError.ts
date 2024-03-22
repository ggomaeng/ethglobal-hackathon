export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NextStepNotFound extends Error {
  constructor() {
    super('Next Step not found');
    this.name = 'NextStepNotFound';
  }
}
