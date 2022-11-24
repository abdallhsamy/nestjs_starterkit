export class TypeORMError extends Error {
  constructor(public code: 400, public message: string) {
    super(message);
  }
}
