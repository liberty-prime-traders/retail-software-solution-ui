export namespace Patterns {
  const uuidSegment = '[0-9a-fA-F]'
  export const UUID = new RegExp(`^${uuidSegment}{8}-${uuidSegment}{4}-${uuidSegment}{4}-${uuidSegment}{4}-${uuidSegment}{12}$`)
}
