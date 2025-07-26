# Code Style Guidelines

## Function Parameters

### Object-style Parameters
Use object-style parameters for functions with more than 2 parameters:

```typescript
// ✅ Good - object-style parameters
export function getSafeLangSwitchUrl({
  currentLang,
  targetLang,
  currentPath,
  availableRoutes
}: {
  currentLang: string;
  targetLang: string;
  currentPath: string;
  availableRoutes: Set<string>;
}): string {
  // implementation
}

// ❌ Avoid - positional parameters
export function getSafeLangSwitchUrl(
  currentLang: string,
  targetLang: string,
  currentPath: string,
  availableRoutes: Set<string>
): string {
  // implementation
}
```

Benefits:
- More readable function calls
- Self-documenting parameter names
- Easier to refactor and maintain
- Less prone to parameter order mistakes