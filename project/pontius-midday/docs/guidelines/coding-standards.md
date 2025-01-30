# Coding Standards

## TypeScript and React Guidelines

### Code Style
- Write concise, technical TypeScript code
- Use functional and declarative programming patterns
- Avoid classes
- Prefer iteration and modularization
- Use descriptive variable names with auxiliary verbs (isLoading, hasError)

### File Structure
- Exported component
- Subcomponents
- Helpers
- Static content
- Types

### Naming Conventions
- Lowercase with dashes for directories (components/auth-wizard)
- Named exports for components

### TypeScript Best Practices
- Use TypeScript for all code
- Prefer interfaces over types
- Avoid enums, use maps instead
- Functional components with TypeScript interfaces

### Performance
- Minimize 'use client', 'useEffect', and 'setState'
- Favor React Server Components (RSC)
- Wrap client components in Suspense
- Use dynamic loading for non-critical components