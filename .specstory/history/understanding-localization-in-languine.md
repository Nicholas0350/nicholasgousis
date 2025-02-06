## SpecStory

## Understanding Localization in Languine (27/01/2025, 13:02:30)

_**User**_

for @Languine explain what is meant by localisation 

---

_**Assistant**_

Based on the documentation, localization (or l10n) in the context of Languine is an automated process of adapting your application's content for different languages and regions. Here's what it specifically involves:

1. **Core Purpose**
- Translates your app's content across 100+ languages([1](https://languine.ai/en/docs/introduction))
- Maintains high quality through AI-powered machine learning models
- Preserves brand voice and terminology consistency

2. **How it Works**
```
Code/Content → Languine Engine → Multiple Language Translations → Deployment
```

3. **Key Features**
- Integrates directly into development workflow
- Automated translations via CI/CD pipelines
- Git integration for version control
- Supports multiple file formats (JSON, YAML, TypeScript, etc.)
- Context-aware translations
- Translation memory to maintain consistency

4. **Workflow**
```javascript
// Example translation flow
"Hello" → {
  es: "Hola",
  fr: "Bonjour",
  de: "Hallo",
  it: "Ciao",
  ja: "こんにちは"
}
```

The platform is designed to be developer-first, meaning it handles translations automatically as you code, requiring minimal manual intervention while maintaining translation quality and consistency.

---

_**User**_

what is meant by languages

---

_**Assistant**_

Languages in software development refers to:

1. **Natural Languages (Human Languages)**
- English, Spanish, Arabic, Japanese, etc.
- Affects:
  - UI text
  - Content
  - Date formats
  - Number formats
  - Currency displays

2. **Direction Considerations**
- LTR (Left-to-Right): English, Spanish
- RTL (Right-to-Left): Arabic, Hebrew

3. **Format Examples**
```javascript
// Dates
EN: "January 1, 2024"
DE: "1. Januar 2024"
JP: "2024年1月1日"

// Numbers
EN: "1,234.56"
DE: "1.234,56"
JP: "1,234.56"

// Currency
EN: "$1,234.56"
FR: "1.234,56 €"
JP: "¥1,234"
```

4. **Common Implementation**
```javascript
// Using next-intl
const messages = {
  en: {
    welcome: "Welcome",
    price: "{value, number, currency}"
  },
  es: {
    welcome: "Bienvenidos",
    price: "{value, number, currency}"
  }
}
```

This is why frameworks like `next-intl` are used - they handle these variations automatically based on locale settings.

---

_**User**_

in the docs what does the fumadocs example demonstrate 

---

_**Assistant**_



The Fumadocs example in the documentation demonstrates how to structure and organize technical documentation using MDX files. Here's what it shows:

1. **File Structure**
```
docs/
  ├── introduction.mdx
  ├── getting-started.mdx
  └── guides/
      ├── installation.mdx
      └── configuration.mdx
```

2. **Key Features**
- MDX file organization
- Automatic sidebar generation
- Page navigation
- Search functionality
- Code syntax highlighting

3. **Basic Usage**
```mdx:docs/introduction.mdx
# Introduction
Welcome to the docs

## Getting Started
Installation steps...

## Code Examples
```js
const example = "Hello World";
```
```

4. **Configuration**
```typescript:fumadocs.config.ts
import { defineConfig } from "fumadocs/config";

export default defineConfig({
  name: "Your Project",
  root: "docs",  // docs directory
  sidebar: {
    autoGenerate: true  // auto-generates sidebar from file structure
  }
});
```

The example shows how to create structured, searchable documentation with automatic navigation using Fumadocs in a Next.js project.

---

_**User**_

how does that connect with languine 

---

_**Assistant**_



Languine connects with Fumadocs to provide multi-language documentation. Here's how:

1. **Integration Pattern**
```typescript:languine.config.ts
export default {
  sources: [
    {
      path: "docs/**/*.mdx",  // Targets all MDX docs
      format: "mdx",
      languages: ["en", "es", "fr", "de"]  // Target languages
    }
  ]
}
```

2. **File Structure After Translation**
```
docs/
  ├── en/
  │   ├── introduction.mdx
  │   └── guides/
  │       └── installation.mdx
  ├── es/
  │   ├── introduction.mdx
  │   └── guides/
  │       └── installation.mdx
  └── fr/
      ├── introduction.mdx
      └── guides/
          └── installation.mdx
```

3. **Usage Example**
```mdx:docs/en/introduction.mdx
# Introduction
Welcome to the docs

//

---

_**User**_

continue 

---

_**Assistant**_



Continuing with how Languine integrates with Fumadocs:

4. **Route Configuration**
```typescript:app/[locale]/docs/[[...slug]]/page.tsx
import { getTranslations } from "languine";

export async function generateStaticParams() {
  return getTranslations({
    locales: ["en", "es", "fr"],
    paths: "docs/**/*.mdx"
  });
}
```

5. **Metadata Handling**
```typescript:docs/en/meta.json
{
  "title": "Documentation",
  "description": "Project documentation"
}

// Automatically translated to:
// docs/es/meta.json
{
  "title": "Documentación",
  "description": "Documentación del proyecto"
}
```

6. **Code Block Preservation**
```mdx
// Original (en)
```jsx
const Hello = () => <div>Hello World</div

---

_**User**_

dont write code , just explain

---

_**Assistant**_



Languine and Fumadocs work together to create multi-language documentation:

1. **Documentation Management**
- Fumadocs handles the documentation structure, navigation, and display
- Languine manages the translation of the content

2. **Workflow**
- Write docs in your primary language (usually English)
- Languine automatically translates the MDX files
- Fumadocs displays the translated content with proper navigation

3. **Key Features**
- Preserves MDX formatting and code blocks
- Maintains documentation structure across languages
- Keeps metadata and navigation in sync
- Handles dynamic route generation for each language
- Preserves technical terms and code snippets

4. **Benefits**
- Single source of truth for documentation
- Automated translation workflow
- Consistent documentation structure across languages
- SEO-friendly URLs for each language
- Maintains technical accuracy in translations

This integration lets you focus on writing docs in one language while automatically maintaining versions in other languages.

---



---

