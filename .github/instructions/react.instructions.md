---
applyTo: 'src/**/*.tsx'
---

# React Component Coding Guidelines

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
- If the input field is a numerical input, it should be saved on change, not on
  blur.
- If the input field is a text input, it should be saved on Enter key is
  pressed.
- ShadCN reusable components can be found in the `src/components/ui` directory.
- Where applicable, components should include `name` and `id` attributes for
  accessibility and testing purposes.
