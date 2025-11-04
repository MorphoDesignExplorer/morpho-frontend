# THIS IS AN AI-GENERATED DRAFT

# Morpho Design Explorer - Frontend

Welcome to the Morpho Design Explorer frontend repository! This document will help you get started with the project.

## About the Project

Morpho Design Explorer is a web-based system for design exploration and optimization. This repository contains the frontend application built with **SvelteKit**, which interfaces with the Morpho backend to provide an interactive user experience for design analysis and exploration.

## Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **npm**, **pnpm**, or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MorphoDesignExplorer/morpho-frontend.git
   cd morpho-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

4. **Open in browser** (optional)
   ```bash
   npm run dev -- --open
   ```

## Development

### Project Structure

```
morpho-frontend/
├── src/
│   ├── routes/          # SvelteKit pages and API routes
│   ├── lib/             # Shared components and utilities
│   │   ├── database.ts  # Database operations with Effect
│   │   └── types.ts     # TypeScript type definitions
│   └── app.html         # HTML template
├── static/              # Static assets
├── svelte.config.js     # SvelteKit configuration
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the production application
- `npm run preview` - Preview the production build locally
- `npm run check` - Run Svelte type checking
- `npm run lint` - Run code linting (if configured)

### Development Workflow

1. **Create a new branch** for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test thoroughly in development mode

3. **Build and test** the production version
   ```bash
   npm run build
   npm run preview
   ```

4. **Commit your changes** with clear, descriptive messages
   ```bash
   git add .
   git commit -m "Add: description of your changes"
   ```

5. **Push and create a pull request**
   ```bash
   git push origin feature/your-feature-name
   ```

## Working with Effect: Result and Option Types

This project uses the **Effect** library for functional error handling with `Either` and `Option` types. These patterns help handle database operations, missing values, and errors in a type-safe way.

### Understanding Option

`Option` represents a value that might or might not exist. It's a type-safe alternative to `null` or `undefined`.

**Think of Option as:** A box that either contains a value (`Some`) or is empty (`None`).

```typescript
import { Option as O } from "effect";

// Creating Options
const hasValue = O.some("hello");      // Contains "hello"
const noValue = O.none();              // Empty

// Checking if an Option has a value
if (O.isSome(hasValue)) {
  console.log(hasValue.value);  // "hello"
}

// Using Option with pattern matching
O.match(hasValue, {
  onNone: () => "No value found",
  onSome: (value) => `Found: ${value}`
});
```

**Common use case:** Getting a value from the cache that might not exist:

```typescript
const cachedData = await CacheGet("my-key");

// Pattern match to handle both cases
const result = O.match(cachedData, {
  onNone: () => {
    // Value wasn't in cache - fetch from database
    return fetchFromDatabase();
  },
  onSome: (data) => {
    // Value was in cache - use it
    return data;
  }
});
```

### Understanding Either

`Either` represents a computation that can succeed (Right) or fail (Left). By convention, errors go on the Left and successful values go on the Right.

**Think of Either as:** A box that contains either an error (Left) or a successful result (Right).

```typescript
import { Either as E } from "effect";

// Creating Eithers
const success = E.right({ id: 1, name: "Project A" });
const failure = E.left(new Error("Database connection failed"));

// Pattern matching with Either
E.match(success, {
  onLeft: (error) => {
    console.error("Something went wrong:", error);
    return [];  // Return fallback value
  },
  onRight: (data) => {
    console.log("Success:", data);
    return data;
  }
});
```

**Common use case:** Handling database query results:

```typescript
// DbQueryAll returns Either<Data, Error>
const projectsResult = await DbQueryAll<Project[]>("SELECT * FROM project");

// Handle both success and error cases
const projects = E.match(projectsResult, {
  onLeft: (error) => {
    reportSQLError(error);
    return [];  // Return empty array on error
  },
  onRight: (data) => data  // Return the actual data
});
```

### Combining Either and Option

Database operations often return `Either<Option<T>, Error>` - a result that can either fail (Left), succeed with no data (Right + None), or succeed with data (Right + Some).

```typescript
// DbQueryOne returns Either<Option<User>, Error>
const userResult = await DbQueryOne<User>("SELECT * FROM user WHERE id = ?", userId);

// Handle all three cases
const user = E.match(userResult, {
  onLeft: (error) => {
    // Database error occurred
    console.error("Query failed:", error);
    return null;
  },
  onRight: (maybeUser) => {
    // Query succeeded, but did we find a user?
    return O.match(maybeUser, {
      onNone: () => {
        // No user found with that ID
        console.log("User not found");
        return null;
      },
      onSome: (user) => {
        // Found the user!
        return user;
      }
    });
  }
});
```

### Practical Examples from the Codebase

**Example 1: Simple error handling with getOrElse**

```typescript
// Get models or return empty array if query fails
const model_rows = E.getOrElse<Error, Record<string, string>[]>(error => {
  reportSQLError(error);
  return [];  // Fallback value
})(maybe_model_rows);
```

**Example 2: Transforming successful results with map**

```typescript
// Transform database rows into Project objects
const result = E.map((rows: RowType[]) => {
  return rows.map(item => ({
    project_name: item.project_name,
    creation_date: item.creation_date,
    // ... more fields
  }));
})(rows);
```

**Example 3: Conditional query based on Option**

```typescript
// Execute different queries based on whether projectName exists
const rows = await O.match(projectName, {
  async onNone() {
    // No project name provided - get all projects
    return await DbQueryAll<Project[]>("SELECT * FROM project");
  },
  async onSome(name) {
    // Project name provided - get specific project
    return await DbQueryAll<Project[]>("SELECT * FROM project WHERE name = ?", name);
  }
});
```

### Quick Reference

| Type | Meaning | Common Functions |
|------|---------|------------------|
| `Option<T>` | Value that might not exist | `O.some()`, `O.none()`, `O.isSome()`, `O.match()` |
| `Either<E, T>` | Success (Right) or Error (Left) | `E.right()`, `E.left()`, `E.match()`, `E.map()`, `E.getOrElse()` |


## Configuration

### Backend Connection

To connect the frontend to the Morpho backend server, you'll need to configure the API endpoint. This is typically done through environment variables:

1. Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8000
   DB_FILE_PATH=./morpho.db
   ```

2. Use the environment variable in your code:
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL;
   ```

## Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Test the production build**
   ```bash
   npm run preview
   ```

3. **Deploy** the `build` directory to your hosting service

## Learning Resources

### SvelteKit Documentation
- [SvelteKit Official Docs](https://kit.svelte.dev/docs)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [Svelte API Reference](https://svelte.dev/docs)

### Effect Library
- [Effect Documentation](https://effect.website/docs/introduction)
- [Effect Option Guide](https://effect.website/docs/data-types/option)
- [Effect Either Guide](https://effect.website/docs/data-types/either)

## Support

If you encounter issues or have questions:

- Check existing [Issues](https://github.com/MorphoDesignExplorer/morpho-frontend/issues)
- Create a new issue with detailed information
- Review the [SvelteKit documentation](https://kit.svelte.dev/docs)

