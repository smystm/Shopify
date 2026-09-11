export type ValidationErrors = Record<string, string | string[]>;

export default class ValidationError extends Error {
   errors: ValidationErrors;

   constructor(errors: ValidationErrors = {}) {
      super("Validation failed");
      this.name = "ValidationError";
      this.errors = errors;
      // Required for `instanceof` to work when targeting ES5/downleveled output
      Object.setPrototypeOf(this, ValidationError.prototype);
   }
}