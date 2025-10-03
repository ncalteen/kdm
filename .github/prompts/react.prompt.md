# Project coding standards for TypeScript and React

Your goal is to create a new React component following the below standards and
guidelines.

## TypeScript Guidelines

- Use TypeScript for all new code
- Follow functional programming principles where possible
- Use interfaces for data structures and type definitions
- Prefer immutable data (const, readonly)
- Use optional chaining (?.) and nullish coalescing (??) operators

## React Guidelines

- Use functional components with hooks
- Follow the React hooks rules (no conditional hooks)
- Use React.FC type for components with children
- Keep components small and focused
- Use CSS modules for component styling

### Rules of Hooks (Critical - Must Follow)

React Hooks must follow these strict rules:

#### 1. Only Call Hooks at the Top Level

- **Always call React Hooks at the top level of your React function components**
- **Never call hooks inside conditions, loops, or nested functions**
- This ensures hooks are called in the same order on every render

```tsx
// ❌ INCORRECT - Hook called conditionally
function MyComponent(props) {
  if (props.enabled) {
    const [count, setCount] = useState(0) // BAD: called inside condition
  }
  // ...
}

// ✅ CORRECT - Hook called at top level
function MyComponent(props) {
  const [count, setCount] = useState(0) // GOOD: called at top level

  if (!props.enabled) {
    return null // Early return is OK after hooks
  }

  useEffect(() => {
    // Effect logic here
  }, [])

  // ...
}
```

#### 2. Only Call Hooks from React Functions

- Call hooks from React function components
- Call hooks from custom hooks (functions starting with "use")
- Don't call hooks from regular JavaScript functions

#### 3. Hook Order Must Be Consistent

- Hooks must be called in the same order every time the component renders
- Use ESLint plugin `eslint-plugin-react-hooks` to catch violations

#### 4. Common Hook Patterns

- State hooks: `useState`, `useReducer`
- Effect hooks: `useEffect`, `useLayoutEffect`
- Context hooks: `useContext`
- Performance hooks: `useMemo`, `useCallback`
- Ref hooks: `useRef`

#### 5. Custom Hooks

- Extract component logic into custom hooks for reusability
- Custom hooks must start with "use" prefix
- Custom hooks can call other hooks

```tsx
// ✅ Custom hook example
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => {
    setCount((prev) => prev + 1)
  }, [])

  return { count, increment }
}
```

### Performance Best Practices

#### Memoization

- Use `useMemo` for expensive calculations
- Use `useCallback` for function references passed to child components
- Use `React.memo` for component memoization

```tsx
// ✅ Memoization examples
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const expensiveValue = useMemo(() => {
    return heavyCalculation(data)
  }, [data])

  const handleUpdate = useCallback(
    (newValue) => {
      onUpdate(newValue)
    },
    [onUpdate]
  )

  return <div>{expensiveValue}</div>
})
```

#### State Management

- Keep state as close to where it's used as possible
- Use `useReducer` for complex state logic
- Avoid unnecessary re-renders by proper dependency arrays

### Security Guidelines

#### Input Validation

- Always validate props and user inputs
- Use TypeScript interfaces for type safety
- Sanitize data before rendering

```tsx
// ✅ Secure component with validation
interface UserProfileProps {
  user: {
    id: string
    name: string
    email: string
  }
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  // Validate required fields
  if (!user?.id || !user?.name) {
    return <div>Invalid user data</div>
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

#### XSS Prevention

- Never use `dangerouslySetInnerHTML` unless absolutely necessary
- Sanitize HTML content when required
- Use proper escaping for dynamic content

### Error Handling

#### Error Boundaries

- Implement error boundaries for graceful error handling
- Use try-catch in async operations
- Provide meaningful error messages

```tsx
// ✅ Error boundary example
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}
```
