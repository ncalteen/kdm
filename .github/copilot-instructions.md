# Copilot Instructions

Each of the following sections contains a list of instructions for Copilot to
follow when generating code. The instructions are grouped by category.

## React Components

- When a parent element contains a one or more `Checkbox` components, they
  should be separated from each other (and preceding/following text) using
  `gap-2`.
- All React components should follow the same coding standards.
  - All components should be written in TypeScript.
  - Inputs should be uncontrolled components.
  - JSDoc comments should be used to document all components.
  - Input and return types should be explicitly defined.
  - If a component is used to display an editable list of items, the items
    themselves should be created as separate components.
  - When values are modified and saved, the component should save the values to
    localStorage following the appropriate schema.
  - If the user is creating, editing, or deleting a value, the component should
    provide feedback to the user using toast notifications from the `sonner`
    library.
  - If the input field is a numerical input, it should be saved on change, not
    on blur.
  - If the input field is a text input, it should be saved on Enter key is
    pressed.
  - ShadCN reusable components can be found in the `src/components/ui`
    directory.
  - Where applicable, components should include `name` and `id` attributes for
    accessibility and testing purposes.

## Object Schemas

- All object schemas should be created using the `zod` library.
- All object schemas should be created in the `src/schemas` directory.
- All object schemas should be created in a file named after the object schema.
  For example, the `Survivor` schema should be created in
  `src/schemas/survivor.ts`.
- All object schemas should be created using the `z.object` function.
- Validation and parsing should be done using the `zod` library.
- All refinements should include appropriate error messages.

## User Messaging

- All user messaging should be done using the `sonner` library.
- All messages should be displayed using the `toast` function.
- If an error occurs while parsing an input value against the Zod schema, the
  error message from the raised `ZodError` should be used in the toast
  notification. If no error message is provided, the following message should be
  displayed using the `toast.error` function.

  ```plain
  The darkness swallows your words. Please try again.
  ```

- If an error occurs, the following message should be displayed using the
  `toast.error` function.

  ```plain
  The darkness swallows your words. Please try again.
  ```

- If an error occurs, it should be logged to the console with appropriate
  leading information to identify it. For example,
  `console.error('Attribute Save Error:', error)`.

## Theme

Use the following text as thematic inspiration for any user-facing notifications
and text.

```plain
Kingdom Death's world is immensely deep and brutally challenging. It will
captivate the imagination and stoke the fires of obsession.

In a place of stone faces, nameless survivors stand together. They have nothing.
Only a lantern to light their struggle.
```

Other terms and phrases that can be used to describe the game include:

- Lanterns as a source of light and hope.
- Darkness as a source of fear and despair.
- Overwhelming odds.
- Struggle for survival.
- Victory rarely achieved, and at great cost.

## Performance

- All components should be optimized for performance.
