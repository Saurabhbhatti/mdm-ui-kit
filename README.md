# @company/master-data-ui

Enterprise-grade config-driven master data UI library for manufacturing systems.

## Core API

```jsx
import { MasterProvider, MasterModule } from "@company/master-data-ui";

function App() {
  return (
    <MasterProvider>
      <MasterModule type="product" />
    </MasterProvider>
  );
}
```

## Adapter layer

```jsx
import { MasterProvider, MasterModule } from "@company/master-data-ui";

export default function App() {
  return (
    <MasterProvider
      adapters={{
        category: customCategoryAdapter
      }}
    >
      <MasterModule type="category" />
    </MasterProvider>
  );
}
```

## Basic usage

```jsx
import { MasterProvider, MasterModule } from "@company/master-data-ui";

export default function App() {
  return (
    <MasterProvider>
      <MasterModule type="product" />
    </MasterProvider>
  );
}
```

## With extra fields

```jsx
import { MasterProvider, MasterModule } from "@company/master-data-ui";

const productOverride = {
  fields: [
    {
      name: "region",
      label: "Region",
      type: "dropdown",
      options: [
        { label: "India", value: "IN" },
        { label: "Europe", value: "EU" }
      ]
    }
  ],
  columns: [
    { key: "region", label: "Region" }
  ]
};

export default function App() {
  return (
    <MasterProvider>
      <MasterModule type="product" configOverride={productOverride} />
    </MasterProvider>
  );
}
```

## With API mapping

```jsx
import { MasterProvider, MasterModule } from "@company/master-data-ui";

const productAdapter = {
  async getList() {
    const response = await fetch("/api/products");
    const payload = await response.json();
    return (payload.items || []).map((item) => ({
      id: item.product_id,
      name: item.product_name,
      code: item.product_code,
      unit: item.unit_name
    }));
  },
  async create(data) {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name: data.name,
        product_code: data.code,
        unit_name: data.unit
      })
    });
  },
  async update(id, data) {
    await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_name: data.name,
        product_code: data.code,
        unit_name: data.unit
      })
    });
  },
  async delete(id) {
    await fetch(`/api/products/${id}`, { method: "DELETE" });
  }
};

export default function App() {
  return (
    <MasterProvider>
      <MasterModule type="product" adapter={productAdapter} />
    </MasterProvider>
  );
}
```

## With custom components

```jsx
import { MasterProvider, MasterModule } from "@company/master-data-ui";

const customerOverride = {
  fields: [
    {
      name: "gst",
      label: "GST",
      render: ({ value, onChange, error, inputId }) => (
        <div>
          <input
            id={inputId}
            className={`mdm-input ${error ? "mdm-input--error" : ""}`}
            value={value}
            onChange={(event) => onChange(event.target.value.toUpperCase())}
            placeholder="GST Number"
          />
          {error ? <span className="mdm-field__error">{error}</span> : null}
        </div>
      ),
      validate: (value) => (value?.length === 15 ? true : "GST must be 15 characters.")
    }
  ]
};

export default function App() {
  return (
    <MasterProvider>
      <MasterModule type="category" configOverride={customerOverride} />
    </MasterProvider>
  );
}
```

## Custom adapter registration

```jsx
import { MasterProvider, MasterModule } from "@company/master-data-ui";

const warehouseAdapter = {
  async getList() {
    return [];
  },
  async getById() {
    return null;
  },
  async create() {},
  async update() {},
  async delete() {}
};

export default function App() {
  return (
    <MasterProvider adapters={{ warehouse: warehouseAdapter }}>
      <MasterModule type="warehouse" />
    </MasterProvider>
  );
}
```

## Add a new module

1. Create a config file in `src/configs/`.
2. Register it in `src/registry/moduleRegistry.js`.
3. Render it through `<MasterModule type="your-type" />`.

## Build

```bash
npm install
npm run build
```

## Demo

```bash
npm run demo
```
