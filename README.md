# Formue CRUD - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Installation & Setup](#installation--setup)
3. [Core Components](#core-components)
4. [Architecture](#architecture)
5. [API Reference](#api-reference)
6. [Usage Examples](#usage-examples)
7. [Advanced Features](#advanced-features)
8. [Customization](#customization)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

## Overview

Formue CRUD is a comprehensive Vue.js 3 framework designed for building data-driven applications with advanced CRUD operations. It provides a complete solution for managing data tables, forms, filtering, sorting, pagination, and user permissions.

### Key Features

- **Dynamic Data Tables**: Tabulator.js integration with advanced sorting and filtering
- **Form Management**: Vueform integration for dynamic form generation
- **Permission System**: Role-based access control for CRUD operations
- **Advanced Filtering**: Multi-field filtering with save/load functionality
- **Export Capabilities**: Excel export with customizable data
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **State Management**: Pinia-based reactive state management
- **Real-time Updates**: Event-driven architecture for live data updates

### Dependencies

```json
{
  "@vueform/vueform": "^1.5.3",
  "@vueuse/core": "^10.4.0",
  "axios": "^1.6.2",
  "lodash": "^4.17.21",
  "mitt": "^3.0.1",
  "pinia": "^2.1.6",
  "qs": "^6.11.2",
  "tabulator-tables": "^6.2.1",
  "vue": "^3.3.4"
}
```

## Installation & Setup

### 1. Install the Package

```bash
npm install formue-crud
```

### 2. Import and Configure

```javascript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import FormueCrud from 'formue-crud'

const app = createApp(App)
app.use(createPinia())
app.use(FormueCrud)
```

### 3. Basic Setup

```vue
<template>
  <MCrud
    :fields="fields"
    :options="options"
    :route="route"
    :hidden-actions="hiddenActions"
    @mounted="onMounted"
  />
</template>

<script setup>
import { MCrud } from 'formue-crud'

const fields = {
  name: {
    type: 'text',
    title: 'Name',
    placeholder: 'Enter name'
  },
  email: {
    type: 'email',
    title: 'Email',
    placeholder: 'Enter email'
  }
}

const options = {
  formMode: 'dialog' // or 'tab'
}

const route = {
  index: '/api/users',
  create: '/api/users',
  update: '/api/users',
  delete: '/api/users'
}

const hiddenActions = [] // ['create', 'update', 'delete', 'show']
</script>
```

## Core Components

### MCrud (Main Component)

The primary component that orchestrates all CRUD operations.

**Props:**

- `fields`: Object defining form fields and table columns
- `options`: Configuration object for behavior customization
- `structure`: Additional form structure configuration
- `hiddenActions`: Array of actions to hide from UI
- `tableOptions`: Tabulator-specific options
- `route`: API endpoints configuration
- `dir`: Text direction ('ltr' or 'rtl')

**Events:**

- `mounted`: Emitted when component is fully initialized

### MTable

Advanced data table component with sorting, filtering, and pagination.

**Features:**

- Column sorting with visual indicators
- Row selection with batch operations
- Custom column visibility
- Loading states and empty data handling
- Responsive design

### MFilter

Dynamic filtering system with save/load functionality.

**Features:**

- Field-specific filter types (text, date, select)
- Multiple filter combinations
- Save/load filter presets
- Real-time filter application

### FormCore

Dynamic form generation component using Vueform.

**Features:**

- Auto-generated forms from field definitions
- Validation integration
- Conditional field display
- Multi-step form support

### MButtonBox

Action toolbar with permissions-based button visibility.

**Features:**

- Create, export, reload, column selection buttons
- Permission-based visibility
- Batch operation support
- Search integration

## Architecture

### State Management (Pinia Store)

The framework uses a dynamic store system for managing application state:

```javascript
// Store Structure
{
  mainKey: '',           // Current data model key
  form: {},             // Current form data
  items: {},            // Data collections by key
  query: '',            // Additional query parameters
  routes: {},           // API endpoints
  fields: [],           // Field definitions
  options: [],          // Configuration options
  filters: [],          // Active filters
  loadings: {},         // Loading states
  dialog: false,        // Dialog visibility
  structure: {},        // Form structure
  paginations: {},      // Pagination data
  searchParam: '',      // Search query
  isEditing: false,     // Edit mode flag
  selected: new Set([]) // Selected items
}
```

### Event System

Uses mitt.js for event communication between components:

```javascript
import { emitter } from '@/helpers/emitter'

// Listen to events
emitter.listen('saveForm', () => {
  // Handle form save
})

// Emit events
emitter.event('alert', { text: 'Success!', color: 'green' })
```

### Permission System

Role-based access control for UI elements:

```javascript
import { usePermission } from '@/composables/usePermission'

const { can } = usePermission()

// Check permissions
if (can('create')) {
  // Show create button
}
```

## API Reference

### Field Types

#### Text Field

```javascript
{
  type: 'text',
  title: 'Field Name',
  placeholder: 'Enter value',
  required: true,
  validation: 'required|min:3'
}
```

#### Select Field

```javascript
{
  type: 'select',
  title: 'Category',
  items: [
    { value: 1, text: 'Option 1' },
    { value: 2, text: 'Option 2' }
  ],
  'label-prop': 'text',
  'value-prop': 'value',
  search: true
}
```

#### Date Field

```javascript
{
  type: 'date',
  title: 'Date',
  placeholder: 'Select date',
  format: 'YYYY-MM-DD'
}
```

### Store Actions

#### Data Operations

```javascript
// Load items
store.loadItems(key, page)

// Add new item
store.addItem(data)

// Edit existing item
store.editItem(data)

// Remove item
store.remove(id)

// Reload data
store.reloadData()
```

#### Filtering

```javascript
// Apply filters
store.loadItems()

// Clear all filters
store.filters = []

// Generate filter query
store.convertToFilterForm()
```

### Composables

#### useDynamicStore

```javascript
import { useDynamicStore } from '@/composables/useDynamicStore'

const store = useDynamicStore('MyStore')
```

#### usePermission

```javascript
import { usePermission } from '@/composables/usePermission'

const { can, setPermissions } = usePermission()

setPermissions(['create', 'update', 'delete'])
```

#### useFetch

```javascript
import { useFetch } from '@/composables/useFetch'

const { get, post, patch, remove } = useFetch()

const response = await get('/api/users')
```

## Usage Examples

### Basic CRUD Setup

```vue
<template>
  <MCrud :fields="userFields" :route="userRoutes" :options="{ formMode: 'dialog' }" />
</template>

<script setup>
const userFields = {
  name: {
    type: 'text',
    title: 'Full Name',
    required: true,
    showIn: ['create', 'edit', 'list']
  },
  email: {
    type: 'email',
    title: 'Email Address',
    required: true
  },
  role: {
    type: 'select',
    title: 'Role',
    items: [
      { value: 'admin', text: 'Administrator' },
      { value: 'user', text: 'Regular User' }
    ]
  },
  created_at: {
    type: 'date',
    title: 'Created Date',
    showIn: ['list']
  }
}

const userRoutes = {
  index: '/api/users',
  create: '/api/users',
  update: '/api/users',
  delete: '/api/users'
}
</script>
```

### Custom Field with API Integration

```javascript
const productFields = {
  category_id: {
    type: 'select',
    title: 'Category',
    items: async (search) => {
      const response = await axios.get(`/api/categories?search=${search}`)
      return response.data.data
    },
    'label-prop': 'name',
    'value-prop': 'id',
    search: true
  }
}
```

### Advanced Filtering Setup

```javascript
const advancedFields = {
  status: {
    type: 'select',
    title: 'Status',
    items: [
      { value: 'active', text: 'Active' },
      { value: 'inactive', text: 'Inactive' }
    ],
    filterItems: [
      { value: 'active', text: 'Active Only' },
      { value: 'inactive', text: 'Inactive Only' }
    ]
  },
  created_at: {
    type: 'date',
    title: 'Created Date',
    filterable: true
  }
}
```

### Custom Actions

```vue
<template>
  <MCrud :fields="fields" :route="route" @mounted="setupCustomActions">
    <template #extra>
      <CustomActionButtons />
    </template>
  </MCrud>
</template>

<script setup>
import { emitter } from '@/helpers/emitter'

const setupCustomActions = () => {
  emitter.listen('customAction', (data) => {
    // Handle custom action
    console.log('Custom action triggered:', data)
  })
}
</script>
```

## Advanced Features

### Batch Operations

```javascript
// Select multiple items
store.selected.add(itemId)

// Batch delete
const selectedIds = Array.from(store.selected)
store.remove(selectedIds)

// Custom batch operation
emitter.listen('batchUpdate', (data) => {
  const selectedItems = store.mainItems.filter((item) => store.selected.has(item.id))
  // Process selected items
})
```

### Export Functionality

```javascript
// Export filtered data
function exportData() {
  const exportUrl = store.generateQuery() + '/export'
  window.open(exportUrl)
}

// Custom export format
function exportCustom() {
  const selectedData = store.mainItems.filter((item) => store.selected.has(item.id))
  // Process and export selected data
}
```

### Custom Column Rendering

```javascript
const customFields = {
  avatar: {
    type: 'image',
    title: 'Avatar',
    formatter: (value) => {
      return `<img src="${value}" alt="Avatar" class="w-8 h-8 rounded-full">`
    }
  },
  status: {
    type: 'select',
    title: 'Status',
    formatter: (value) => {
      const color = value === 'active' ? 'green' : 'red'
      return `<span class="px-2 py-1 text-xs rounded bg-${color}-100 text-${color}-800">${value}</span>`
    }
  }
}
```

### Conditional Field Display

```javascript
const conditionalFields = {
  type: {
    type: 'select',
    title: 'User Type',
    items: [
      { value: 'individual', text: 'Individual' },
      { value: 'company', text: 'Company' }
    ],
    onChange: (value, formData) => {
      // Show/hide fields based on selection
      if (value === 'company') {
        // Show company-specific fields
      }
    }
  },
  company_name: {
    type: 'text',
    title: 'Company Name',
    showIf: (formData) => formData.type === 'company'
  }
}
```

## Customization

### Styling

The framework uses Tailwind CSS for styling. You can customize the appearance by:

1. **Override CSS Classes:**

```css
.fc-header-icon-btn {
  @apply bg-blue-500 hover:bg-blue-600 text-white;
}

.fc-table-row:hover {
  @apply bg-blue-50;
}
```

2. **Custom Themes:**

```javascript
const customOptions = {
  theme: {
    primary: 'blue',
    secondary: 'gray',
    success: 'green',
    danger: 'red'
  }
}
```

### Custom Components

```vue
<!-- CustomField.vue -->
<template>
  <div class="custom-field">
    <label>{{ field.title }}</label>
    <input v-model="modelValue" :type="field.type" :placeholder="field.placeholder" />
  </div>
</template>

<script setup>
import { registerFields } from 'formue-crud'

registerFields({
  'custom-field': CustomField
})
</script>
```

### API Response Format

Expected API response format:

```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  ],
  "current_page": 1,
  "last_page": 5,
  "total": 50,
  "per_page": 10
}
```

## Best Practices

### 1. Field Organization

```javascript
// Group related fields
const userFields = {
  // Personal Information
  first_name: { type: 'text', title: 'First Name', group: 'personal' },
  last_name: { type: 'text', title: 'Last Name', group: 'personal' },

  // Contact Information
  email: { type: 'email', title: 'Email', group: 'contact' },
  phone: { type: 'tel', title: 'Phone', group: 'contact' }
}
```

### 2. Performance Optimization

```javascript
// Use lazy loading for large datasets
const lazyFields = {
  category: {
    type: 'select',
    items: async (search) => {
      // Only load when needed
      if (search.length < 2) return []
      return await fetchCategories(search)
    }
  }
}
```

### 3. Error Handling

```javascript
// Global error handling
emitter.listen('error', (error) => {
  console.error('CRUD Error:', error)
  // Show user-friendly message
  showNotification(error.message, 'error')
})
```

### 4. Validation

```javascript
const validatedFields = {
  email: {
    type: 'email',
    title: 'Email',
    rules: ['required', 'email'],
    messages: {
      required: 'Email is required',
      email: 'Please enter a valid email'
    }
  }
}
```

## Troubleshooting

### Common Issues

#### 1. Data Not Loading

```javascript
// Check API endpoint
console.log('API URL:', store.generateRoute())

// Verify response format
axios.get('/api/users').then((response) => {
  console.log('Response structure:', response.data)
})
```

#### 2. Form Validation Errors

```javascript
// Debug form validation
emitter.listen('validation-error', (errors) => {
  console.log('Validation errors:', errors)
})
```

#### 3. Permission Issues

```javascript
// Check permission setup
const { permissions } = usePermission()
console.log('Available permissions:', permissions.value)
```

#### 4. Filter Not Working

```javascript
// Debug filter generation
console.log('Filter query:', store.convertToFilterForm())
```

### Debug Mode

Enable debug mode for detailed logging:

```javascript
const debugOptions = {
  debug: true,
  logging: {
    api: true,
    events: true,
    state: true
  }
}
```

### Performance Monitoring

```javascript
// Monitor API calls
axios.interceptors.request.use((request) => {
  console.time(`API: ${request.url}`)
  return request
})

axios.interceptors.response.use((response) => {
  console.timeEnd(`API: ${response.config.url}`)
  return response
})
```

## Migration Guide

### From Version 0.1.x to 0.2.x

1. **Update field definitions:**

```javascript
// Old format
const fields = [{ field: 'name', type: 'text', title: 'Name' }]

// New format
const fields = {
  name: { type: 'text', title: 'Name' }
}
```

2. **Update event listeners:**

```javascript
// Old format
this.$emit('update', data)

// New format
emitter.event('update', data)
```

## Contributing

### Development Setup

```bash
git clone https://github.com/your-repo/formue-crud
cd formue-crud
npm install
npm run dev
```

### Build Process

```bash
npm run build
npm run type-check
npm run lint
```

### Testing

```bash
npm run test
npm run test:unit
npm run test:e2e
```

---

**Version:** 0.1.77  
**Last Updated:** 2024  
**License:** MIT

For more information, visit the [GitHub repository](https://github.com/your-repo/formue-crud) or contact the maintainers.
