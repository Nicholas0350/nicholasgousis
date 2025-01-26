# Project Overview
A user-friendly interface for defining and creating database schemas through a form-based approach, which automatically generates and executes SQL in Supabase.

**Goal:**
- Enable users to create and manage database schemas without writing SQL directly
- Provide a visual interface for table and field definitions
- Automatically handle schema creation in Supabase

**Key Objectives:**
- Create an intuitive form interface for schema definition
- Support common field types and constraints
- Generate optimized SQL
- Execute schema changes safely
- Provide immediate feedback on schema creation

**Target Platforms:** Web
**Dependencies:**

**Frontend:**
- React
- TailwindCSS
- Shadcn UI
- React Hook Form

**Database:**
- Supabase (postgres)
- Drizzle

---

# Features

1. **Schema Definition Interface**
   - Table name input
   - Dynamic field creation
   - Data type selection
   - Field constraints (Required/Unique)

2. **SQL Generation**
   - Automatic UUID primary key
   - Created/Updated timestamps
   - Field definitions with constraints
   - Safe SQL execution

3. **Schema Management**
   - View existing schemas
   - Modify existing tables
   - Delete tables
   - Export schema definitions

---

# Requirements For Each Feature

### 1. Schema Definition Interface
**Functional:**
- Users can define table names
- Add/remove fields dynamically
- Select from common data types
- Toggle field constraints
- Preview generated SQL

**Non-Functional:**
- Responsive design
- Real-time validation
- Intuitive UI/UX

**Error Handling:**
- Validate table names
- Check for duplicate field names
- Ensure required fields are filled

### 2. SQL Generation
**Functional:**
- Generate valid PostgreSQL
- Include standard fields (id, timestamps)
- Support all common data types
- Handle field constraints

**Non-Functional:**
- Optimized SQL output
- Safe execution practices

**Error Handling:**
- Validate SQL before execution
- Handle database errors gracefully
- Provide clear error messages

### 3. Schema Management
**Functional:**
- List all user schemas
- Modify existing tables
- Delete tables
- Export schema definitions

**Non-Functional:**
- Fast schema loading
- Efficient modifications

**Error Handling:**
- Prevent accidental deletions
- Validate modifications
- Handle concurrent modifications

---

# Data Models

### Schema Definition
```typescript
interface Field {
  name: string
  type: string
  isRequired: boolean
  isUnique: boolean
}

interface TableSchema {
  id: string
  name: string
  fields: Field[]
  createdAt: Date
  updatedAt: Date
}
```

---

# API Contract

### Create Schema
**Endpoint:** `POST /api/schemas`
**Request Body:**
```json
{
  "tableName": "users",
  "fields": [
    {
      "name": "email",
      "type": "text",
      "isRequired": true,
      "isUnique": true
    }
  ]
}
```

### Get Schemas
**Endpoint:** `GET /api/schemas`
**Response:**
```json
{
  "schemas": [
    {
      "id": "<uuid>",
      "name": "users",
      "fields": [...],
      "createdAt": "2024-03-22T08:30:00Z"
    }
  ]
}
```

### Delete Schema
**Endpoint:** `DELETE /api/schemas/:id`
**Response:** `204 No Content`

## Feature Intent
User defined database schema by exposing the user to a form where they define the schema .


that lets users define their database structure through a form, which will then create the schema in Supabase.

Database Schema Builder Form

1.  Table name input
2.  Dynamic field creation with:
    *   Field name
    *   Data type selection (text, integer, decimal, boolean, etc.)
    *   Required/Not Null toggle
    *   Unique constraint toggle
3.  SQL generation that includes:
    *   UUID primary key
    *   Created/Updated timestamps
    *   Automatic updated\_at trigger



3.  Modify the handleSubmit function to execute the SQL:

```javascript
const handleSubmit = async () => {
  const sql = generateSQL();
  try {
    const { data, error } = await supabase.rpc('execute_sql', {
      sql_string: sql
    });
    if (error) throw error;
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```






**State Management**

```javascript
const [tableName, setTableName] = useState('');
const [fields, setFields] = useState([
    { name: '', type: 'text', isRequired: false, isUnique: false }
]);
```

The component manages two main pieces of state:

*   `tableName`: Stores the name of the table being created
*   `fields`: An array of field objects, where each field has properties for name, type, and constraints

1.  **Field Management**

```javascript
const addField = () => {
    setFields([...fields, { name: '', type: 'text', isRequired: false, isUnique: false }]);
};

const removeField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
};

const updateField = (index, key, value) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
};
```

These functions handle:

*   Adding new fields
*   Removing existing fields
*   Updating field properties (name, type, constraints)

3.  **SQL Generation**

```javascript
const generateSQL = () => {
    if (!tableName) return '';

    const fieldDefinitions = fields
        .filter(field => field.name)  // Only include fields with names
        .map(field => {
            let definition = `"${field.name}" ${field.type.toUpperCase()}`;
            if (field.isRequired) definition += ' NOT NULL';
            if (field.isUnique) definition += ' UNIQUE';
            return definition;
        })
        .join(',\n  ');

    return `
    CREATE TABLE ${tableName} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        ${fieldDefinitions},
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
    );
    `;
}
```

The SQL generation:

*   Creates a table with the specified name
*   Automatically adds an ID field using UUID
*   Adds all user-defined fields with their types and constraints
*   Includes created\_at and updated\_at timestamp fields

4.  **User Interface Structure**

```javascript
return (
    <Card>
        <CardHeader>
            <CardTitle>Create Database Table</CardTitle>
        </CardHeader>
        <CardContent>
            {/* Table Name Input */}
            <Input
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
            />

            {/* Field List */}
            {fields.map((field, index) => (
                <div key={index}>
                    {/* Field Name Input */}
                    <Input
                        value={field.name}
                        onChange={(e) => updateField(index, 'name', e.target.value)}
                    />

                    {/* Data Type Select */}
                    <select
                        value={field.type}
                        onChange={(e) => updateField(index, 'type', e.target.value)}
                    >
                        {dataTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>

                    {/* Constraint Checkboxes */}
                    <input
                        type="checkbox"
                        checked={field.isRequired}
                        onChange={(e) => updateField(index, 'isRequired', e.target.checked)}
                    />
                    <input
                        type="checkbox"
                        checked={field.isUnique}
                        onChange={(e) => updateField(index, 'isUnique', e.target.checked)}
                    />
                </div>
            ))}
        </CardContent>
    </Card>
);
```

5.  **Integration with Supabase**

```javascript
const handleSubmit = async () => {
    const sql = generateSQL();
    try {
        const { data, error } = await supabase.rpc('execute_sql', {
            sql_string: sql
        });
        if (error) throw error;
        // Handle success
    } catch (error) {
        // Handle error
    }
};
```

When submitting:

1.  Generates the SQL string
2.  Calls a Supabase RPC function to execute the SQL
3.  Handles any errors that occur

The flow of data looks like this:

```
User Input → React State → SQL Generation → Supabase RPC → Database Creation
```


*   How to handle more complex field types
*   Adding validation for field names and types
*   Implementing error handling
*   Adding more database constraints or indexes

## Prompt:
how do i now create an api for a business customer to use as an api

## Response:
I'll help you create an API interface that your business customers can use to interact with their dynamically created database schema. We'll create both the API implementation and a documentation/testing interface.

API Implementation with Supabase

Click to open code

Now, let's create an API documentation and testing interface for your customers:

API Documentation Interface

Click to open component

Here's how the entire system works:

1.  **API Implementation (First Artifact)**

*   Provides RESTful endpoints for CRUD operations
*   Supports dynamic table names via route parameters
*   Includes features for:
    *   Filtering
    *   Pagination
    *   Sorting
    *   Error handling
    *   Proper HTTP status codes

2.  **API Documentation Interface (Second Artifact)**

*   Interactive documentation for each endpoint
*   Live testing capability
*   Features:
    *   Request/response examples
    *   API key management
    *   Copy-to-clipboard functionality
    *   Parameter documentation
    *   Response visualization

3.  **Security Implementation** You'll need to add these security measures:

```javascript
// middleware.js
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Verify API key
  const apiKey = req.headers.get('authorization')?.split('Bearer ')[1]
  if (!apiKey) {
    return new NextResponse(
      JSON.stringify({
```

## Prompt:
can i have this as a monolith but each feature runs on a different url

## Response:
I'll help you structure this as a monolithic application with different features running on different URLs/routes. We'll organize it using a clear directory structure and route handling.

Monolithic Application Structure

Click to open code

Now let's create the API route handlers for different features:

API Route Handlers

Click to open code

Here's how the monolithic application is structured with different features on different URLs:

1.  **URL Structure**

```
/schema-builder     - Database schema creation interface
/api-builder        - API configuration and documentation
/customer-portal    - Customer dashboard and API usage
/admin             - Admin controls and monitoring
/settings          - Application settings
```

2.  **API Endpoints**

```
/api/schemas                        - Schema management
/api/[customer]/[table]            - Dynamic table operations
/api/customers                     - Customer management
/api/customers/[id]/api-keys       - API key management
/api/analytics                     - Usage analytics
```

3.  **Feature Isolation** Each feature has its own:

*   Page component
*   API routes
*   Component directory
*   State management

4.  **Shared Resources**

*   Authentication middleware
*   Supabase client
*   Navigation components
*   Layout components

5.  **Required Database Tables**

```sql
-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- API Keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  key TEXT UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- API Usage table
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

To use this system:

1.  Set up the project:

```bash
npm init next-app my-saas-app
cd my-saas-app
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs lucide-react
```

2.  Configure environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3.  Run database migrations to create required tables:

```bash
psql your_database_url -f setup.sql
```

Would you like me to explain any specific part in more detail? For example:

*   How to implement customer-specific rate limiting
*   Adding real-time analytics
*   Implementing webhook notifications
*   Setting up automatic API documentation generation


## Feature Intent:
create an automatic API documentation generator that reads schema and generates comprehensive documentation automatically.

Schema Extraction Service



Now, let's create the automatic documentation generator component:

Automatic API Documentation Generator

Click to open component
