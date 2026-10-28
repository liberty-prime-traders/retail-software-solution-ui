This is a three-tier system, with the following levels:
- Platform
- Organization
- Location

The api and components are split into these sections. some util and cross tier files can exist in other folders.

# Forms
I use signal forms for all forms. A good example is found at the location below:
@src/lib/components/organization-level/product-group/product-group-form
Error message display can be generic via `<rts-error-summary/>` using the form or`regularErrorMessages`

# API
I have reusable setups for API calls. @src/lib/api/util has my reusable setup. Try not to override all the time. 
The set-up is flexible and can be used for most cases.
If you need to do something different, talk to me about it. I want to keep the API calls consistent across the application, 
but I am open to adjustments if there is a good reason for it. 
The goal is to have a consistent and maintainable codebase, so any changes to the API setup should be made with that in mind.

# component templates
Use pipes instead of calling functions from the template. The only exception is when responding 
to an event. For example, when a user clicks a button, you can call a function to handle that event. 
But for displaying data or transforming it for the template, use pipes.

Enum dropdowns have a pipe ( `enumToDropdown`) that transforms the enum into a dropdown format. This keeps the template clean and separates concerns.

Multiline attributes should have a full closing tag. For example, choose between `<my-component [attr]="value" />`, and:
```html
<my-component [attr]="value"
              [attr2]="value2">
</my-component>
```

If its below 120 characters, you can use the self-closing tag. If its above 120 characters, use the full closing tag.

# Grids
I prefer expanding a grid row for quick edits instead of navigating to a new page. 
This allows for a more seamless user experience and keeps the user in context.
However, some forms are larger and may need a full page. I choose to hide the grid behind the form. 
I use `@If` to conditionally show the grid or the form. 
This way, I can easily switch between them without navigating away from the page.
Add forms will typically be on such a new page. An example can be found:
@src/lib/components/organization-level/product-group/product-group-form

# Types
I use types to define the shape of data and to ensure type safety throughout the application.
I also use a lot of enums. Do not throw magic strings around. If you have a specific set of values, use an enum to define them.
If an enum exists, use it. This makes the code more maintainable and less error-prone.
The backend tends to break up data classes into response and create/update dtos. However, we keep
it simple on the frontend and just use one type for both. This is because the frontend often needs to handle both cases in the same component,
and having separate types can lead to unnecessary complexity.

### Comments
- Gotchas only — never restate what the code already says.
- A comment describes the code as it now stands, never the change that produced it. It is read by
  someone who has no idea what the previous version looked like.
- Banned: what the code used to do, what the old approach was, how many call sites a migration
  touched, ticket/PR references, and words that date the comment (`now`, `previously`, `used to`,
  `no longer`, `recently`, `this change`). That narrative belongs in the commit message.
- Naming a rejected alternative is allowed only to stop someone reverting to it, and only stated
  as a durable property of that alternative — `@CreationTimestamp applies at INSERT, so the field
  is null after save()`, not `we switched off @CreationTimestamp because ~20 call sites needed
  saveAndFlush`.
- State a rationale once, at the most relevant spot. Don't repeat the same "why" at every call
  site; if it spans a package, it goes in that package's README instead.
- Don't defend against an edit the compiler or type system already prevents (a reordering blocked
  by a data dependency, an elvis on a non-nullable type).
- Test comments: name the invariant being guarded and what breaks if it regresses — not the bug
  or task that prompted writing the test.
- Prefer a name that carries the invariant over a comment that explains it. A bulk method that
  deliberately skips per-item validation because the caller already validated the whole batch
  should say so in its name — `bulkInsertValidatedList(insertDtos: List<UnitConversionInsertDto>)`,
  not `bulkInsert` with a `// validation already happened upstream` comment above it. The name
  travels with every call site and autocomplete entry; the comment only helps a reader already
  looking at the declaration.
