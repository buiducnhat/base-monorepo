# Feature Structure Guideline

When developing a new feature page (e.g., `employees`, `departments`, `positions`), follow this structure:

## 1. Directory Structure

Organize components within a `_components` folder inside the feature route directory.

```
apps/web/src/routes/(dashboard)/[feature]/
├── [feature].tsx                # Main page component
└── _components/
    └── [feature]-form-dialog.tsx # Create/Edit form dialog
```

## 2. Main Page Component (`[feature].tsx`)

- Use `useQuery` to fetch data.
- Use `NiceModal` to trigger dialogs.
- Use `DataTable` component to render the list.
- Define `columns` using `useMemo` (or import from `[feature]-datatable.tsx` if static, but usually defined here to access `refetch` and other props).
- Implement `deleteMutation` using `useMutation`.

## 3. DataTable Usage

- Use the generic `DataTable` component directly in the main page component.
- Do not create a separate wrapper component (e.g., `[feature]-datatable.tsx`) unless there is complex custom logic that cannot be handled by the generic component.
- Define `columns` in the main page component using `useMemo`.

## 4. Form Dialog Component (`_components/[feature]-form-dialog.tsx`)

- Use `NiceModal.create` to wrap the component.
- Use `@tanstack/react-form` for form state management.
- Use `zod` for validation.
- Use Shadcn UI components (`Dialog`, `Input`, `Select`, `Button`).
- Use Shadcn `Field` components (`Field`, `FieldLabel`, `FieldContent`, `FieldError`) for layout and error handling.
- **Validation Pattern**:
  - Calculate `isInvalid = field.state.meta.isTouched && !field.state.meta.isValid`.
  - Pass `data-invalid={isInvalid}` to `<Field>`.
  - Pass `aria-invalid={isInvalid}` to `<Input>` or `<Select>`.
  - Use `htmlFor={field.name}` on `<FieldLabel>` (for inputs).
- Handle `create` and `update` modes.
- Use `useMutation` for form submission.

## Example: Department Form

Refer to `apps/web/src/routes/(dashboard)/employees/_components/department-form-dialog.tsx` for a complete example of the form implementation.
