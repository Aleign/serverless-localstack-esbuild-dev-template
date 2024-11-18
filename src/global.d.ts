declare module '*.graphql' {
  import {DocumentNode} from 'graphql';

  const value: DocumentNode;
  export = value;
}

declare module "*.ejs" {
  import { Data, EscapeCallback, IncludeCallback, RethrowCallback } from 'ejs';
  /**
   * Generates HTML markup from an EJS template.
   *
   * @param locals an object of data to be passed into the template.
   * @param escape callback used to escape variables
   * @param include callback used to include files at runtime with `include()`
   * @param rethrow callback used to handle and rethrow errors
   *
   * @return Return type depends on `Options.async`.
   */
  const fn: (
    locals?: Data,
    escape?: EscapeCallback,
    include?: IncludeCallback,
    rethrow?: RethrowCallback,
  ) => string;
  export default fn;
}
