import be, { createContext as Ot, useContext as Lt, useMemo as $, useEffect as H, useState as E, memo as pt, useCallback as z, useRef as ft } from "react";
import { jsx as i, jsxs as m, Fragment as Dt } from "react/jsx-runtime";
const Xr = "@company/master-data-ui", $e = "@company/master-data-ui:storage", Tt = ["product", "category", "workstation", "resource", "warehouse", "inventory"], ue = {
  categories: "category",
  products: "product",
  workstations: "workstation",
  resources: "resource",
  warehouses: "warehouse",
  inventories: "inventory"
}, en = {
  category: "Category",
  product: "Product",
  workstation: "Workstation",
  resource: "Resource",
  warehouse: "Warehouse",
  inventory: "Inventory"
}, tn = Tt, jt = 10, He = {
  category: [
    {
      id: "cat-1",
      name: "Raw Material",
      code: "RM",
      description: "Incoming raw materials and inputs"
    },
    {
      id: "cat-2",
      name: "Finished Goods",
      code: "FG",
      description: "Completed and shippable products"
    }
  ],
  product: [
    {
      id: "prd-1",
      name: "Steel Sheet",
      code: "SS-001",
      categoryId: "cat-1",
      unit: "kg",
      minStock: 100
    }
  ],
  workstation: [
    {
      id: "ws-1",
      name: "Cutting Station",
      code: "CUT-01",
      location: "Line A",
      capacity: 5
    }
  ],
  resource: [
    {
      id: "res-1",
      name: "Laser Cutter",
      code: "LAS-01",
      type: "Machine",
      workstationId: "ws-1"
    }
  ],
  warehouse: [
    {
      id: "wh-1",
      name: "Main Warehouse",
      code: "WH-01",
      location: "Plant 1",
      capacity: 5e3
    }
  ],
  inventory: [
    {
      id: "inv-1",
      productId: "prd-1",
      warehouseId: "wh-1",
      quantity: 250,
      reorderLevel: 100
    }
  ]
}, ht = {
  mode: "light",
  colors: {
    bg: "#f4f7fb",
    surface: "#ffffff",
    text: "#111827",
    muted: "#667085",
    primary: "#2563eb",
    primaryContrast: "#ffffff",
    danger: "#dc2626",
    border: "#d7dde8",
    hover: "#eff4ff"
  },
  radius: "18px",
  spacing: "16px",
  shadow: "0 18px 40px rgba(15, 23, 42, 0.10)"
}, Pt = ht;
function Bt(e = {}) {
  const t = ht;
  return {
    ...t,
    ...e,
    colors: {
      ...t.colors,
      ...e.colors || {}
    }
  };
}
function de(e = {}) {
  return {
    version: 1,
    permissions: {
      create: !0,
      edit: !0,
      delete: !0,
      export: !0,
      import: !0
    },
    importExport: {
      scope: "module",
      validateStructure: !0
    },
    searchable: !0,
    sortable: !0,
    filters: [],
    pageSize: 10,
    ...e
  };
}
function Vt() {
  return de({
    type: "category",
    entityKey: "category",
    moduleName: "Category",
    icon: "category",
    displayName: "Category Master Data",
    description: "Manage material and product categories from a reusable config-driven module.",
    fileName: "category-master-data",
    defaultValues: {
      name: "",
      code: "",
      description: ""
    },
    fields: [
      { name: "name", label: "Name", type: "text", validation: { required: !0 } },
      { name: "code", label: "Code", type: "text", validation: { required: !0 } },
      { name: "description", label: "Description", type: "text" }
    ],
    columns: [
      { key: "name", label: "Name", sortable: !0, searchable: !0 },
      { key: "code", label: "Code", sortable: !0, searchable: !0 },
      { key: "description", label: "Description", searchable: !0 }
    ]
  });
}
function xt({ bundle: e = {} } = {}) {
  const t = e.category || [], r = t.map((n) => ({
    label: `${n.name} (${n.code})`,
    value: n.id
  }));
  return de({
    type: "product",
    entityKey: "product",
    moduleName: "Product",
    icon: "product",
    displayName: "Product Master Data",
    description: "Capture product definitions, category mapping, and stock controls.",
    fileName: "product-master-data",
    defaultValues: {
      name: "",
      code: "",
      categoryId: "",
      unit: "",
      minStock: 0
    },
    fields: [
      { name: "name", label: "Name", type: "text", validation: { required: !0 } },
      { name: "code", label: "Code", type: "text", validation: { required: !0 } },
      {
        name: "categoryId",
        label: "Category",
        type: "dropdown",
        validation: { required: !0 },
        options: () => r
      },
      { name: "unit", label: "Unit", type: "text", validation: { required: !0 } },
      { name: "minStock", label: "Minimum Stock", type: "number", validation: { required: !0, min: 0, noNegative: !0 } }
    ],
    columns: [
      { key: "name", label: "Name", sortable: !0, searchable: !0 },
      { key: "code", label: "Code", sortable: !0, searchable: !0 },
      {
        key: "categoryId",
        label: "Category",
        searchable: !0,
        resolveValue: ({ row: n }) => {
          const a = t.find((s) => s.id === n.categoryId);
          return a ? `${a.name} (${a.code})` : n.categoryId || "-";
        }
      },
      { key: "unit", label: "Unit", sortable: !0, searchable: !0 },
      { key: "minStock", label: "Minimum Stock", sortable: !0 }
    ]
  });
}
function Ft() {
  return de({
    type: "workstation",
    entityKey: "workstation",
    moduleName: "Workstation",
    icon: "workstation",
    displayName: "Workstation Master Data",
    description: "Maintain workstation capacity, location, and identification details.",
    fileName: "workstation-master-data",
    defaultValues: {
      name: "",
      code: "",
      location: "",
      capacity: 0
    },
    fields: [
      { name: "name", label: "Name", type: "text", validation: { required: !0 } },
      { name: "code", label: "Code", type: "text", validation: { required: !0 } },
      { name: "location", label: "Location", type: "text", validation: { required: !0 } },
      { name: "capacity", label: "Capacity", type: "number", validation: { required: !0, min: 0, noNegative: !0 } }
    ],
    columns: [
      { key: "name", label: "Name", sortable: !0, searchable: !0 },
      { key: "code", label: "Code", sortable: !0, searchable: !0 },
      { key: "location", label: "Location", searchable: !0 },
      { key: "capacity", label: "Capacity", sortable: !0 }
    ]
  });
}
function Kt({ bundle: e = {} } = {}) {
  const t = e.workstation || [], r = t.map((n) => ({
    label: `${n.name} (${n.code})`,
    value: n.id
  }));
  return de({
    type: "resource",
    entityKey: "resource",
    moduleName: "Resource",
    icon: "resource",
    displayName: "Resource Master Data",
    description: "Manage machine, human, and tooling resources through config.",
    fileName: "resource-master-data",
    defaultValues: {
      name: "",
      code: "",
      type: "",
      workstationId: ""
    },
    fields: [
      { name: "name", label: "Name", type: "text", validation: { required: !0 } },
      { name: "code", label: "Code", type: "text", validation: { required: !0 } },
      {
        name: "type",
        label: "Type",
        type: "dropdown",
        validation: { required: !0 },
        options: [
          { label: "Machine", value: "Machine" },
          { label: "Human", value: "Human" },
          { label: "Tool", value: "Tool" },
          { label: "Fixture", value: "Fixture" },
          { label: "Consumable", value: "Consumable" }
        ]
      },
      {
        name: "workstationId",
        label: "Workstation",
        type: "dropdown",
        validation: { required: !0 },
        options: r
      }
    ],
    columns: [
      { key: "name", label: "Name", sortable: !0, searchable: !0 },
      { key: "code", label: "Code", sortable: !0, searchable: !0 },
      { key: "type", label: "Type", sortable: !0, searchable: !0 },
      {
        key: "workstationId",
        label: "Workstation",
        searchable: !0,
        resolveValue: ({ row: n }) => {
          const a = t.find((s) => s.id === n.workstationId);
          return a ? `${a.name} (${a.code})` : n.workstationId || "-";
        }
      }
    ]
  });
}
function qt() {
  return de({
    type: "warehouse",
    entityKey: "warehouse",
    moduleName: "Warehouse",
    icon: "warehouse",
    displayName: "Warehouse Master Data",
    description: "Centralize warehouse locations and capacity settings.",
    fileName: "warehouse-master-data",
    defaultValues: {
      name: "",
      code: "",
      location: "",
      capacity: 0
    },
    fields: [
      { name: "name", label: "Name", type: "text", validation: { required: !0 } },
      { name: "code", label: "Code", type: "text", validation: { required: !0 } },
      { name: "location", label: "Location", type: "text", validation: { required: !0 } },
      { name: "capacity", label: "Capacity", type: "number", validation: { required: !0, min: 0, noNegative: !0 } }
    ],
    columns: [
      { key: "name", label: "Name", sortable: !0, searchable: !0 },
      { key: "code", label: "Code", sortable: !0, searchable: !0 },
      { key: "location", label: "Location", searchable: !0 },
      { key: "capacity", label: "Capacity", sortable: !0 }
    ]
  });
}
function Ut({ bundle: e = {} } = {}) {
  const t = e.product || [], r = e.warehouse || [], n = t.map((s) => ({
    label: `${s.name} (${s.code})`,
    value: s.id
  })), a = r.map((s) => ({
    label: `${s.name} (${s.code})`,
    value: s.id
  }));
  return de({
    type: "inventory",
    entityKey: "inventory",
    moduleName: "Inventory",
    icon: "inventory",
    displayName: "Inventory Master Data",
    description: "Track quantities and reorder levels per warehouse.",
    fileName: "inventory-master-data",
    defaultValues: {
      productId: "",
      warehouseId: "",
      quantity: 0,
      reorderLevel: 0
    },
    fields: [
      {
        name: "productId",
        label: "Product",
        type: "dropdown",
        validation: { required: !0 },
        options: n
      },
      {
        name: "warehouseId",
        label: "Warehouse",
        type: "dropdown",
        validation: { required: !0 },
        options: a
      },
      { name: "quantity", label: "Quantity", type: "number", validation: { required: !0, min: 0, noNegative: !0 } },
      { name: "reorderLevel", label: "Reorder Level", type: "number", validation: { required: !0, min: 0, noNegative: !0 } }
    ],
    columns: [
      {
        key: "productId",
        label: "Product",
        searchable: !0,
        resolveValue: ({ row: s }) => {
          const o = t.find((l) => l.id === s.productId);
          return o ? `${o.name} (${o.code})` : s.productId || "-";
        }
      },
      {
        key: "warehouseId",
        label: "Warehouse",
        searchable: !0,
        resolveValue: ({ row: s }) => {
          const o = r.find((l) => l.id === s.warehouseId);
          return o ? `${o.name} (${o.code})` : s.warehouseId || "-";
        }
      },
      { key: "quantity", label: "Quantity", sortable: !0 },
      { key: "reorderLevel", label: "Reorder Level", sortable: !0 }
    ]
  });
}
function yt(e) {
  return e == null;
}
function nt(e) {
  return yt(e) || String(e).trim() === "";
}
function bt(e) {
  if (e === "" || e === null || e === void 0)
    return "";
  const t = Number(e);
  return Number.isFinite(t) ? Math.max(0, t) : "";
}
function rn(e) {
  if (e === "" || e === null || e === void 0)
    return !1;
  const t = Number(e);
  return Number.isFinite(t) && t < 0;
}
function he(e, t, r = void 0) {
  return e.validation && Object.prototype.hasOwnProperty.call(e.validation, t) ? e.validation[t] : Object.prototype.hasOwnProperty.call(e, t) ? e[t] : r;
}
function gt(e, t = {}, r = {}) {
  const n = t.label || t.name || "Field", a = t.type || t.inputType || "text", s = !!he(t, "required", !1), o = he(t, "min"), l = he(t, "noNegative", a === "number"), p = he(t, "pattern"), f = he(t, "validate");
  if (s && nt(e))
    return `${n} is required.`;
  if (a === "number") {
    if (nt(e))
      return s ? `${n} is required.` : "";
    const h = Number(e);
    if (!Number.isFinite(h))
      return `${n} must be a valid number.`;
    if (l && h < 0)
      return `${n} cannot be negative.`;
    if (typeof o == "number" && h < o)
      return `${n} must be at least ${o}.`;
  }
  if (p && !(p instanceof RegExp ? p : new RegExp(p)).test(String(e ?? "")))
    return `${n} is invalid.`;
  if (typeof f == "function") {
    const h = f(e, r);
    if (typeof h == "string" && h)
      return h;
    if (h === !1)
      return `${n} is invalid.`;
  }
  return "";
}
function zt(e, t = [], r = {}) {
  const n = {};
  return t.forEach((a) => {
    const s = gt(e[a.name], a, r);
    s && (n[a.name] = s);
  }), n;
}
function at(e = {}, t = []) {
  return t.reduce((r, n) => {
    const a = e[n.name];
    return (n.type || n.inputType || "text") === "number" ? (r[n.name] = bt(a), r) : (r[n.name] = yt(a) ? "" : a, r);
  }, {});
}
function Nt(e, t = {}) {
  const r = e.options;
  return typeof r == "function" ? r(t) || [] : Array.isArray(r) ? r : [];
}
function nn(e = [], t = {}, r = {}) {
  return zt(t, e, r);
}
function Wt(e = {}) {
  return {
    ...e,
    name: e.name || e.apiKey || e.key || e.accessor,
    apiKey: e.apiKey || e.name || e.key || e.accessor || null
  };
}
function Jt(e = {}) {
  return {
    ...e,
    key: e.key || e.apiKey || e.accessor || e.name || null,
    apiKey: e.apiKey || e.key || e.accessor || e.name || null
  };
}
function Gt(e, t = {}) {
  const r = typeof e == "function" ? e(t) : e;
  if (!r)
    return null;
  const n = t.related || {}, a = (r.fields || []).map((o) => {
    const l = Wt(o);
    return {
      ...l,
      options: Nt(l, {
        ...t,
        related: n,
        field: l
      })
    };
  }), s = (r.columns || []).map((o) => ({
    ...Jt(o),
    valueGetter: typeof o.valueGetter == "function" ? o.valueGetter : o.resolveValue ? (p) => o.resolveValue({ row: p, related: n, context: t }) : o.valueGetter,
    render: typeof o.render == "function" ? o.render : o.resolveValue ? (p) => o.resolveValue({ row: p, related: n, context: t }) : void 0
  }));
  return {
    ...r,
    fields: a,
    columns: s
  };
}
function Ht(e = {}) {
  return {
    create: !0,
    edit: !0,
    delete: !0,
    export: !0,
    import: !0,
    ...e.permissions || {}
  };
}
function ze(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function q(e) {
  return Array.isArray(e) ? e.map((t) => q(t)) : ze(e) ? vt({}, e) : e;
}
function vt(e = {}, t = {}) {
  const r = { ...e || {} };
  return Object.entries(t || {}).forEach(([n, a]) => {
    const s = r[n];
    if (ze(s) && ze(a)) {
      r[n] = vt(s, a);
      return;
    }
    r[n] = q(a);
  }), r;
}
function Ze(e = {}) {
  return (e == null ? void 0 : e.apiKey) || (e == null ? void 0 : e.key) || (e == null ? void 0 : e.accessor) || (e == null ? void 0 : e.name) || null;
}
function ke(e = {}) {
  return (e == null ? void 0 : e.name) || (e == null ? void 0 : e.apiKey) || (e == null ? void 0 : e.key) || (e == null ? void 0 : e.accessor) || null;
}
function wt(e = {}, t = {}) {
  const r = Ze(t), n = ke(t);
  if (!(e == null || typeof e != "object")) {
    if (r && (e == null ? void 0 : e[r]) !== void 0)
      return e == null ? void 0 : e[r];
    if (n && (e == null ? void 0 : e[n]) !== void 0)
      return e == null ? void 0 : e[n];
  }
}
function kt(e = {}, t = {}) {
  const r = (t == null ? void 0 : t.defaultValues) || {}, n = ke(e), a = Ze(e);
  return n && Object.prototype.hasOwnProperty.call(r, n) ? r[n] : a && Object.prototype.hasOwnProperty.call(r, a) ? r[a] : Object.prototype.hasOwnProperty.call(e, "defaultValue") ? e.defaultValue : "";
}
function G(e, t = {}, r = {}) {
  var s;
  if (Array.isArray(e))
    return e.map((o) => G(o, t, r));
  if (!e || typeof e != "object")
    return e ?? {};
  const n = Array.isArray(t == null ? void 0 : t.fields) ? t.fields : [], a = { ...e };
  if (n.forEach((o) => {
    const l = ke(o);
    if (!l)
      return;
    const p = wt(e, o);
    a[l] = p === void 0 ? kt(o, t) : p;
  }), Object.entries((t == null ? void 0 : t.defaultValues) || {}).forEach(([o, l]) => {
    a[o] === void 0 && (a[o] = q(l));
  }), typeof ((s = t == null ? void 0 : t.dataMapper) == null ? void 0 : s.toUI) == "function") {
    const o = t.dataMapper.toUI(a, r);
    if (o && typeof o == "object")
      return o;
  }
  return a;
}
function ge(e, t = {}, r = {}) {
  var s;
  if (Array.isArray(e))
    return e.map((o) => ge(o, t, r));
  if (!e || typeof e != "object")
    return e ?? {};
  const n = Array.isArray(t == null ? void 0 : t.fields) ? t.fields : [], a = { ...e };
  if (n.forEach((o) => {
    const l = ke(o), p = Ze(o);
    if (!l || !p)
      return;
    const f = (a == null ? void 0 : a[l]) !== void 0 ? a == null ? void 0 : a[l] : wt(e, o);
    a[p] = f === void 0 ? kt(o, t) : f, p !== l && Object.prototype.hasOwnProperty.call(a, l) && delete a[l];
  }), typeof ((s = t == null ? void 0 : t.dataMapper) == null ? void 0 : s.toAPI) == "function") {
    const o = t.dataMapper.toAPI(a, r);
    if (o && typeof o == "object")
      return o;
  }
  return a;
}
function ot(e = {}, t = [], r = {}, n = {}) {
  const a = Array.isArray(t) ? t : [], s = {}, o = Array.isArray(n.names) ? n.names : null;
  return a.forEach((l) => {
    const p = ke(l);
    if (!p || o && !o.includes(p))
      return;
    const f = gt(e == null ? void 0 : e[p], l, r);
    f && (s[p] = f);
  }), s;
}
function st(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function Ye(e = {}, t = {}) {
  const r = { ...e || {} };
  return Object.entries(t || {}).forEach(([n, a]) => {
    const s = r[n];
    if (Array.isArray(a)) {
      r[n] = q(a);
      return;
    }
    if (st(s) && st(a)) {
      r[n] = Ye(s, a);
      return;
    }
    r[n] = q(a);
  }), r;
}
function Me(e = {}) {
  return (e == null ? void 0 : e.name) || (e == null ? void 0 : e.apiKey) || (e == null ? void 0 : e.key) || (e == null ? void 0 : e.accessor) || null;
}
function ae(e = [], t = [], r = Me) {
  const n = (Array.isArray(e) ? e : []).map((a) => q(a));
  return (Array.isArray(t) ? t : []).forEach((a) => {
    const s = r(a);
    if (!s) {
      n.push(q(a));
      return;
    }
    const o = n.findIndex((l) => r(l) === s);
    if (a != null && a.hidden) {
      o >= 0 && n.splice(o, 1);
      return;
    }
    if (o >= 0) {
      n[o] = Ye(n[o], a);
      return;
    }
    n.push(q(a));
  }), n.filter((a) => !(a != null && a.hidden));
}
function Te(e = {}) {
  return {
    ...e,
    name: e.name || e.apiKey || e.key || e.accessor || null,
    apiKey: e.apiKey || e.name || e.key || e.accessor || null
  };
}
function je(e = {}) {
  const t = e.key || e.apiKey || e.accessor || e.name || null;
  return {
    ...e,
    key: t,
    apiKey: e.apiKey || t,
    name: e.name || t
  };
}
function Ce(e = null, t = null) {
  if (!e && !t)
    return null;
  if (!e) {
    const n = q(t);
    return n != null && n.fields && (n.fields = ae([], n.fields).map(Te)), n != null && n.columns && (n.columns = ae([], n.columns, Me).map(je)), n;
  }
  if (!t) {
    const n = q(e);
    return n.fields = ae(n.fields, []).map(Te), n.columns = ae(n.columns, [], Me).map(je), n;
  }
  const r = Ye(e, t);
  return r.fields = ae(e.fields, t.fields).map(Te), r.columns = ae(e.columns, t.columns, Me).map(je), r;
}
function Z() {
  return typeof window < "u" && typeof window.localStorage < "u";
}
const le = /* @__PURE__ */ new Map(), Re = "mdm.cache.";
function _e(e) {
  return JSON.parse(JSON.stringify(e));
}
function Zt(e) {
  if (!Z())
    return null;
  try {
    const t = window.localStorage.getItem(`${Re}${e}`);
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
function Yt(e, t) {
  if (Z())
    try {
      window.localStorage.setItem(`${Re}${e}`, JSON.stringify(t));
    } catch {
    }
}
function Qt(e) {
  if (Z())
    try {
      window.localStorage.removeItem(`${Re}${e}`);
    } catch {
    }
}
function Xt(e) {
  if (!e)
    return null;
  if (le.has(e))
    return _e(le.get(e));
  const t = Zt(e);
  return t !== null ? (le.set(e, t), _e(t)) : null;
}
function er(e, t, { persist: r = !0 } = {}) {
  if (!e)
    return t;
  const n = _e(t);
  return le.set(e, n), r && Yt(e, n), _e(n);
}
function Pe(e) {
  e && (le.delete(e), Qt(e));
}
function an() {
  if (le.clear(), !!Z())
    try {
      Object.keys(window.localStorage).forEach((t) => {
        t.startsWith(Re) && window.localStorage.removeItem(t);
      });
    } catch {
    }
}
function J(e = {}) {
  return (e == null ? void 0 : e.apiKey) || (e == null ? void 0 : e.key) || (e == null ? void 0 : e.accessor) || (e == null ? void 0 : e.name) || "";
}
function ye(e = {}, t = {}) {
  if (!e || !t)
    return "";
  if (typeof t.valueGetter == "function")
    return t.valueGetter(e);
  const r = J(t);
  return r ? (e == null ? void 0 : e[r]) ?? (e == null ? void 0 : e[t == null ? void 0 : t.key]) ?? (e == null ? void 0 : e[t == null ? void 0 : t.apiKey]) ?? (e == null ? void 0 : e[t == null ? void 0 : t.accessor]) ?? "" : "";
}
function tr(e) {
  return e === "" || e === null || e === void 0 ? "-" : e;
}
function on(e, t = 300) {
  let r;
  return (...n) => {
    window.clearTimeout(r), r = window.setTimeout(() => e(...n), t);
  };
}
const Qe = {
  product: xt,
  category: Vt,
  workstation: Ft,
  resource: Kt,
  warehouse: qt,
  inventory: Ut
};
function sn(e, t) {
  Qe[e] = t;
}
function Ne(e, t = {}) {
  const r = Qe[e];
  return r ? typeof r == "function" ? r(t) : r : null;
}
function me() {
  return Object.keys(Qe);
}
function Be() {
  if (!Z())
    return null;
  try {
    const e = window.localStorage.getItem($e);
    return e ? JSON.parse(e) : null;
  } catch {
    return null;
  }
}
function Ve(e) {
  Z() && window.localStorage.setItem($e, JSON.stringify(e));
}
const Xe = {
  get() {
    return Be();
  },
  set(e) {
    return Ve(e), e;
  },
  update(e, t, r) {
    const n = Be() || {}, a = Array.isArray(n[e]) ? n[e] : [];
    return n[e] = a.map((s) => s.id === t ? { ...s, ...r } : s), Ve(n), n[e];
  },
  delete(e, t) {
    const r = Be() || {}, n = Array.isArray(r[e]) ? r[e] : [];
    return r[e] = n.filter((a) => a.id !== t), Ve(r), r[e];
  }
};
function cn(e = {}) {
  let t = e;
  return {
    get() {
      return t;
    },
    set(r) {
      return t = r, t;
    },
    update(r, n, a) {
      const s = Array.isArray(t[r]) ? t[r] : [];
      return t = {
        ...t,
        [r]: s.map((o) => o.id === n ? { ...o, ...a } : o)
      }, t[r];
    },
    delete(r, n) {
      const a = Array.isArray(t[r]) ? t[r] : [];
      return t = {
        ...t,
        [r]: a.filter((s) => s.id !== n)
      }, t[r];
    }
  };
}
const rr = "/api/categories";
function St(e = {}) {
  var t;
  return {
    ...e.config || {},
    dataMapper: e.dataMapper || ((t = e.config) == null ? void 0 : t.dataMapper) || null
  };
}
function ee(e = {}) {
  var t, r;
  return ((r = (t = e.config) == null ? void 0 : t.api) == null ? void 0 : r.baseUrl) || rr;
}
function it(e) {
  return Array.isArray(e) ? e : Array.isArray(e == null ? void 0 : e.records) ? e.records : Array.isArray(e == null ? void 0 : e.items) ? e.items : Array.isArray(e == null ? void 0 : e.data) ? e.data : [];
}
function xe(e) {
  return !e || Array.isArray(e) ? e : e.data || e.record || e;
}
async function te(e, t = {}) {
  const r = await fetch(e, {
    headers: {
      "Content-Type": "application/json",
      ...t.headers || {}
    },
    ...t
  });
  if (!r.ok) {
    const n = await r.text().catch(() => "");
    throw new Error(n || `Request failed with status ${r.status}.`);
  }
  return r.status === 204 ? null : r.json();
}
function Fe(e, t) {
  return ge(e, St(t), t);
}
function oe(e, t) {
  return G(e, St(t), t);
}
const nr = {
  async getList(e = {}) {
    const t = ee(e), r = await te(t, { method: "GET" });
    return oe(it(r), e);
  },
  async getById(e, t = {}) {
    const r = `${ee(t)}/${encodeURIComponent(e)}`, n = await te(r, { method: "GET" });
    return oe(xe(n), t);
  },
  async create(e, t = {}) {
    const r = ee(t), n = await te(r, {
      method: "POST",
      body: JSON.stringify(Fe(e, t))
    });
    return oe(xe(n), t);
  },
  async update(e, t, r = {}) {
    const n = `${ee(r)}/${encodeURIComponent(e)}`, a = await te(n, {
      method: "PUT",
      body: JSON.stringify(Fe(t, r))
    });
    return oe(xe(a), r);
  },
  async delete(e, t = {}) {
    const r = `${ee(t)}/${encodeURIComponent(e)}`;
    return await te(r, { method: "DELETE" }), { id: e };
  },
  async import(e, t = {}) {
    var a;
    const r = `${ee(t)}/import`, n = Array.isArray(e) ? e : (e == null ? void 0 : e.records) || [];
    return await te(r, {
      method: "POST",
      body: JSON.stringify({
        type: (a = t == null ? void 0 : t.config) == null ? void 0 : a.type,
        records: Fe(n, t)
      })
    }), oe(n, t);
  },
  async export(e = {}) {
    var r;
    const t = oe(it(await te(ee(e), { method: "GET" })), e);
    return {
      type: ((r = e == null ? void 0 : e.config) == null ? void 0 : r.type) || "category",
      records: t
    };
  }
}, Ee = {
  category: nr
};
function ar() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `mdm-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function At(e) {
  return JSON.parse(JSON.stringify(e));
}
function Mt() {
  if (!Z())
    return {};
  try {
    const e = window.localStorage.getItem($e);
    return e ? JSON.parse(e) : {};
  } catch {
    return {};
  }
}
function or(e) {
  return Z() && window.localStorage.setItem($e, JSON.stringify(e)), e;
}
function se(e) {
  const t = Mt();
  return Array.isArray(t == null ? void 0 : t[e]) ? t[e] : [];
}
function Ae(e, t) {
  const r = Mt();
  return r[e] = Array.isArray(t) ? t : [], or(r), r[e];
}
function Ke(e = {}, t = null) {
  const r = (/* @__PURE__ */ new Date()).toISOString();
  return {
    ...t || {},
    ...At(e),
    id: e.id || (t == null ? void 0 : t.id) || ar(),
    createdAt: (t == null ? void 0 : t.createdAt) || e.createdAt || r,
    updatedAt: r
  };
}
function ie(e = {}) {
  var t;
  return {
    ...e.config || {},
    dataMapper: e.dataMapper || ((t = e.config) == null ? void 0 : t.dataMapper) || null
  };
}
function sr(e, t) {
  return {
    type: e,
    records: At(t)
  };
}
const qe = /* @__PURE__ */ new Map();
function Ct(e) {
  if (qe.has(e))
    return qe.get(e);
  const t = {
    async getList(r = {}) {
      return G(se(e), ie(r), r);
    },
    async getById(r, n = {}) {
      const a = ie(n), s = se(e).find((o) => (o == null ? void 0 : o.id) === r);
      return s ? G(s, a, n) : null;
    },
    async create(r, n = {}) {
      const a = ie(n), s = se(e), o = Ke(ge(r, a, n));
      return Ae(e, [...s, o]), G(o, a, n);
    },
    async update(r, n, a = {}) {
      const s = ie(a), o = se(e), l = o.findIndex((f) => (f == null ? void 0 : f.id) === r);
      if (l < 0)
        return null;
      const p = Ke(
        {
          ...o[l],
          ...ge(n, s, a),
          id: o[l].id,
          createdAt: o[l].createdAt
        },
        o[l]
      );
      return o[l] = p, Ae(e, o), G(p, s, a);
    },
    async delete(r) {
      const n = se(e).filter((a) => (a == null ? void 0 : a.id) !== r);
      return Ae(e, n), n;
    },
    async import(r, n = {}) {
      const a = ie(n), o = (Array.isArray(r) ? r : (r == null ? void 0 : r.records) || []).map((l) => Ke(ge(l, a, n)));
      return Ae(e, o), o.map((l) => G(l, a, n));
    },
    async export(r = {}) {
      const n = G(se(e), ie(r), r);
      return sr(e, n);
    }
  };
  return qe.set(e, t), t;
}
let ve = {
  storageAdapter: Xe,
  adapters: Ee
};
function ir(e = {}) {
  ve = {
    ...ve,
    ...e
  };
}
function ln() {
  return ve;
}
function et() {
  return ve.storageAdapter || Xe;
}
function un(e) {
  var t;
  return ((t = ve.adapters) == null ? void 0 : t[e]) || Ee[e] || Ct(e);
}
function cr() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `mdm-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function tt(e) {
  return JSON.parse(JSON.stringify(e));
}
function we(e = {}) {
  const t = (/* @__PURE__ */ new Date()).toISOString();
  return {
    id: e.id || cr(),
    createdAt: e.createdAt || t,
    updatedAt: e.updatedAt || e.createdAt || t,
    ...e
  };
}
function We() {
  return me().reduce((e, t) => (e[t] = [], e), {});
}
function rt(e = {}) {
  return me().reduce((t, r) => {
    const n = Array.isArray(e[r]) ? e[r] : [];
    return t[r] = n.map((a) => we(a)), t;
  }, {});
}
function dn() {
  return rt(He);
}
function W() {
  var r;
  const e = et(), t = (r = e.get) == null ? void 0 : r.call(e);
  return rt(t ?? He);
}
function Y(e) {
  var n;
  const t = rt(e), r = et();
  return (n = r.set) == null || n.call(r, t), t;
}
function mn(e) {
  const t = W();
  return tt(t[e] || []);
}
function pn(e, t) {
  const r = W();
  return r[e] = tt(t), Y(r);
}
function lr(e, t) {
  const r = W(), n = we(t);
  return r[e] = [...r[e] || [], n], Y(r), r[e];
}
function ur(e, t, r) {
  const n = W(), a = (/* @__PURE__ */ new Date()).toISOString();
  return n[e] = (n[e] || []).map(
    (s) => s.id === t ? { ...s, ...r, id: s.id, updatedAt: a } : s
  ), Y(n), n[e];
}
function dr(e, t) {
  var s;
  const r = et(), n = (s = r.delete) == null ? void 0 : s.call(r, e, t);
  if (n)
    return n;
  const a = W();
  return a[e] = (a[e] || []).filter((o) => o.id !== t), Y(a), a[e];
}
function ce(e = null) {
  const t = W();
  return e ? {
    type: e,
    records: tt(t[e] || [])
  } : t;
}
function Ue(e) {
  const t = _t(e);
  return Y(t);
}
function _t(e) {
  if (Array.isArray(e))
    throw new Error("Import payload must be an object keyed by module type, or an envelope with type and records.");
  if (e && typeof e == "object" && e.type && Array.isArray(e.records)) {
    const r = e.type;
    if (!Ne(r))
      throw new Error(`Unknown module type: ${r}`);
    return {
      ...We(),
      [r]: e.records.map((n) => we(n))
    };
  }
  const t = We();
  return me().forEach((r) => {
    const n = Array.isArray(e == null ? void 0 : e[r]) ? e[r] : [];
    t[r] = n.map((a) => we(a));
  }), t;
}
function mr() {
  return Y(He);
}
function pr() {
  return Y(We());
}
function fr(e) {
  return ce(e);
}
function fn(e, t) {
  const r = W();
  return r[e] = Array.isArray(t) ? t.map((n) => we(n)) : [], Y(r);
}
function hr(e = ce()) {
  return JSON.stringify(e, null, 2);
}
function hn(e, t = fr(e).records || []) {
  return JSON.stringify(
    {
      type: e,
      records: t
    },
    null,
    2
  );
}
function yr(e, t = null) {
  const r = _t(e);
  if (t && (e != null && e.type) && e.type !== t)
    throw new Error(`Expected module type ${t} but received ${e.type}.`);
  return t ? {
    type: t,
    records: r[t] || []
  } : r;
}
function br(e, t = null) {
  const r = JSON.parse(e);
  return yr(r, t);
}
function gr(e, t) {
  if (typeof document > "u")
    return;
  const r = typeof t == "string" ? t : hr(t), n = new Blob([r], { type: "application/json;charset=utf-8" }), a = window.URL.createObjectURL(n), s = document.createElement("a");
  s.href = a, s.download = e, s.click(), window.setTimeout(() => window.URL.revokeObjectURL(a), 0);
}
async function Nr(e, t = null) {
  const r = await e.text();
  return br(r, t);
}
function vr(e = {}, t = {}) {
  return {
    ...e || {},
    ...t || {}
  };
}
const ct = (e) => {
  let t;
  const r = /* @__PURE__ */ new Set(), n = (f, h) => {
    const C = typeof f == "function" ? f(t) : f;
    if (!Object.is(C, t)) {
      const M = t;
      t = h ?? (typeof C != "object" || C === null) ? C : Object.assign({}, t, C), r.forEach((T) => T(t, M));
    }
  }, a = () => t, l = { setState: n, getState: a, getInitialState: () => p, subscribe: (f) => (r.add(f), () => r.delete(f)) }, p = t = e(n, a, l);
  return l;
}, wr = ((e) => e ? ct(e) : ct), kr = (e) => e;
function Sr(e, t = kr) {
  const r = be.useSyncExternalStore(
    e.subscribe,
    be.useCallback(() => t(e.getState()), [e, t]),
    be.useCallback(() => t(e.getInitialState()), [e, t])
  );
  return be.useDebugValue(r), r;
}
const lt = (e) => {
  const t = wr(e), r = (n) => Sr(t, n);
  return Object.assign(r, t), r;
}, Ar = ((e) => e ? lt(e) : lt), Mr = W();
function Je(e, t) {
  var r;
  return ((r = e.records) == null ? void 0 : r[t]) || [];
}
const L = Ar((e, t) => ({
  records: Mr,
  ui: {
    activeModule: me()[0] || null
  },
  setActiveModule: (r) => {
    e((n) => ({
      ui: {
        ...n.ui,
        activeModule: r
      }
    }));
  },
  createRecord: (r, n) => {
    const a = lr(r, n);
    return e((s) => ({
      records: {
        ...s.records,
        [r]: a
      }
    })), a[a.length - 1] || null;
  },
  setEntityRecords: (r, n) => (e((a) => ({
    records: {
      ...a.records,
      [r]: Array.isArray(n) ? n : []
    }
  })), Je(t(), r)),
  updateRecord: (r, n, a) => {
    const s = ur(r, n, a);
    return e((o) => ({
      records: {
        ...o.records,
        [r]: s
      }
    })), s.find((o) => o.id === n) || null;
  },
  deleteRecord: (r, n) => {
    const a = dr(r, n);
    return e((s) => ({
      records: {
        ...s.records,
        [r]: a
      }
    })), a;
  },
  replaceEntityRecords: (r, n) => {
    const a = ce();
    a[r] = Array.isArray(n) ? n : [];
    const s = Ue(a);
    return e({ records: s }), s[r];
  },
  resetAll: () => {
    const r = mr();
    return e({ records: r }), r;
  },
  clearAll: () => {
    const r = pr();
    return e({ records: r }), r;
  },
  exportAll: () => ce(),
  exportModule: (r) => ce(r),
  importAll: (r) => {
    const n = Ue(r);
    return e({ records: n }), n;
  },
  importModule: (r, n) => {
    const a = ce();
    a[r] = Array.isArray(n) ? n : [];
    const s = Ue(a);
    return e({ records: s }), s[r];
  },
  getEntityRecords: (r) => Je(t(), r),
  getAllRecords: () => t().records
}));
function Cr(e) {
  return {
    items: L((r) => Je(r, e)),
    createRecord: (r) => L.getState().createRecord(e, r),
    updateRecord: (r, n) => L.getState().updateRecord(e, r, n),
    deleteRecord: (r) => L.getState().deleteRecord(e, r),
    setEntityRecords: (r) => L.getState().setEntityRecords(e, r),
    replaceEntityRecords: (r) => L.getState().replaceEntityRecords(e, r),
    exportModule: () => L.getState().exportModule(e),
    importModule: (r) => L.getState().importModule(e, r),
    resetAll: () => L.getState().resetAll(),
    clearAll: () => L.getState().clearAll(),
    exportAll: () => L.getState().exportAll(),
    importAll: (r) => L.getState().importAll(r)
  };
}
function Et() {
  return L((e) => e.records);
}
const $t = Ot({
  theme: {},
  storageAdapter: null,
  adapters: {},
  getAdapter: null
});
function Rt() {
  return Lt($t);
}
function _r(e) {
  return {
    "--bg-color": e.colors.bg,
    "--surface-color": e.colors.surface,
    "--text-color": e.colors.text,
    "--muted-color": e.colors.muted,
    "--primary-color": e.colors.primary,
    "--primary-contrast-color": e.colors.primaryContrast,
    "--danger-color": e.colors.danger,
    "--border-color": e.colors.border,
    "--hover-color": e.colors.hover,
    "--radius-lg": e.radius,
    "--spacing-lg": e.spacing,
    "--shadow-lg": e.shadow,
    "--mdm-color-bg": e.colors.bg,
    "--mdm-color-surface": e.colors.surface,
    "--mdm-color-text": e.colors.text,
    "--mdm-color-muted": e.colors.muted,
    "--mdm-color-primary": e.colors.primary,
    "--mdm-color-primary-contrast": e.colors.primaryContrast,
    "--mdm-color-danger": e.colors.danger,
    "--mdm-color-border": e.colors.border,
    "--mdm-color-hover": e.colors.hover,
    "--mdm-border-radius": e.radius,
    "--mdm-spacing": e.spacing,
    "--mdm-shadow": e.shadow
  };
}
function Er({
  theme: e = Pt,
  storageAdapter: t = Xe,
  adapters: r = {},
  children: n
}) {
  const a = $(() => Bt(e), [e]), s = $(() => vr(Ee, r), [r]), o = $(
    () => (p) => (s == null ? void 0 : s[p]) || Ee[p] || Ct(p),
    [s]
  );
  H(() => {
    ir({ storageAdapter: t, adapters: s }), L.setState({ records: W() });
  }, [t, s]);
  const l = $(() => _r(a), [a]);
  return /* @__PURE__ */ i($t.Provider, { value: { theme: a, storageAdapter: t, adapters: s, getAdapter: o }, children: /* @__PURE__ */ i("div", { className: "mdm-themeRoot", style: l, children: n }) });
}
function pe(e) {
  return Cr(e);
}
function yn(e) {
  return L(e);
}
function bn() {
  return pe(ue.categories);
}
function gn() {
  return pe(ue.products);
}
function Nn() {
  return pe(ue.workstations);
}
function vn() {
  return pe(ue.resources);
}
function wn() {
  return pe(ue.warehouses);
}
function kn() {
  return pe(ue.inventories);
}
function $r(e, t = 250) {
  const [r, n] = E(e);
  return H(() => {
    const a = setTimeout(() => n(e), t);
    return () => clearTimeout(a);
  }, [t, e]), r;
}
const ut = {
  product: "M4 7.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v9a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 16.5v-9Zm4 0h8",
  category: "M5 6.5h14M7 10h10M9 13.5h6M6.5 4h11A2.5 2.5 0 0 1 20 6.5v11A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4Z",
  workstation: "M4 17h16M6 17V7h12v10M8 7V4h8v3M9 12h6",
  resource: "M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm-6 14a6 6 0 0 1 12 0v1H6v-1Z",
  warehouse: "M4 9.5 12 4l8 5.5v9A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-9ZM8 20v-6h8v6",
  inventory: "M5 6h14v12H5zM8 6v12M16 6v12M5 10h14"
};
function Rr({ name: e, className: t = "" }) {
  const r = ut[e] || ut.product;
  return /* @__PURE__ */ i(
    "svg",
    {
      className: `mdm-icon ${t}`.trim(),
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: /* @__PURE__ */ i("path", { d: r })
    }
  );
}
function Ir(e) {
  return /* @__PURE__ */ i("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", ...e, children: /* @__PURE__ */ i("path", { d: "M4 6h16M4 12h16M4 18h16" }) });
}
function Or(e) {
  return /* @__PURE__ */ m("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", ...e, children: [
    /* @__PURE__ */ i("circle", { cx: "11", cy: "11", r: "7" }),
    /* @__PURE__ */ i("path", { d: "m20 20-3.5-3.5" })
  ] });
}
function It(e) {
  return /* @__PURE__ */ i("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", className: "mdm-spinner", ...e, children: /* @__PURE__ */ i("path", { d: "M21 12a9 9 0 1 1-6.2-8.6" }) });
}
function Lr(e) {
  return /* @__PURE__ */ m("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", ...e, children: [
    /* @__PURE__ */ i("path", { d: "M4 7.5 12 4l8 3.5v9L12 20l-8-3.5z" }),
    /* @__PURE__ */ i("path", { d: "M12 4v16" })
  ] });
}
function Dr(e) {
  return /* @__PURE__ */ m("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", ...e, children: [
    /* @__PURE__ */ i("path", { d: "M7 17V7l5 3 5-3v10l-5 3-5-3Z" }),
    /* @__PURE__ */ i("path", { d: "M12 10v7" })
  ] });
}
function Tr(e) {
  return /* @__PURE__ */ i("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", ...e, children: /* @__PURE__ */ i("path", { d: "m6 9 6 6 6-6" }) });
}
function jr(e) {
  return /* @__PURE__ */ i("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", ...e, children: /* @__PURE__ */ i("path", { d: "m18 15-6-6-6 6" }) });
}
function Pr(e) {
  return /* @__PURE__ */ m("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", ...e, children: [
    /* @__PURE__ */ i("path", { d: "M20 21a8 8 0 0 0-16 0" }),
    /* @__PURE__ */ i("circle", { cx: "12", cy: "7.5", r: "4" })
  ] });
}
function Br(e) {
  return /* @__PURE__ */ m("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", ...e, children: [
    /* @__PURE__ */ i("path", { d: "M10 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5" }),
    /* @__PURE__ */ i("path", { d: "m15 7 5 5-5 5" }),
    /* @__PURE__ */ i("path", { d: "M20 12H10" })
  ] });
}
function Ge(e) {
  return e.type || e.inputType || "text";
}
function Vr(e, t) {
  return Ge(e) === "number" ? t === "" || t === null || t === void 0 ? "" : String(t) : t ?? "";
}
function xr(e, t) {
  return e.filter((r) => Array.isArray(r.dependsOn) && r.dependsOn.includes(t));
}
function Fr({ error: e, hint: t }) {
  return e ? /* @__PURE__ */ i("span", { className: "mdm-field__error", role: "alert", children: e }) : t ? /* @__PURE__ */ i("span", { className: "mdm-field__hint", children: t }) : null;
}
function Kr({
  schema: e = [],
  initialValues: t = {},
  onSubmit: r,
  submitLabel: n = "Save",
  cancelLabel: a = "Cancel",
  onCancel: s,
  context: o = {},
  className: l = "",
  loading: p = !1
}) {
  const f = $(() => at(t, e), [t, e]), [h, C] = E(f), [M, T] = E({});
  H(() => {
    C(f), T({});
  }, [f]);
  const S = $(
    () => e.reduce((u, _) => (u[_.name] = Nt(_, {
      values: h,
      context: o,
      field: _
    }), u), {}),
    [o, e, h]
  ), F = z((u, _) => {
    const U = Ge(u) === "number" ? bt(_) : _, D = xr(e, u.name), O = {
      ...h,
      [u.name]: U
    };
    D.forEach((c) => {
      O[c.name] = "";
    }), C(O), T((c) => {
      const b = [u, ...D], k = ot(O, b, o), K = { ...c };
      return b.forEach((P) => {
        k[P.name] ? K[P.name] = k[P.name] : delete K[P.name];
      }), K;
    });
  }, [o, e, h]), w = z((u) => {
    u.preventDefault();
    const _ = ot(h, e, o);
    T(_), !(Object.keys(_).length > 0) && (r == null || r(at(h, e)));
  }, [o, r, e, h]), R = z((u) => {
    ["-", "e", "E", "+"].includes(u.key) && u.preventDefault();
  }, []);
  return /* @__PURE__ */ m("form", { className: `mdm-form ${l}`.trim(), onSubmit: w, children: [
    e.map((u) => {
      var c, b;
      const _ = Ge(u), I = M[u.name], U = S[u.name] || [], D = `mdm-field-${u.name}`, O = {
        value: Vr(u, h[u.name]),
        onChange: (k) => F(u, k != null && k.target ? k.target.value : k),
        error: I,
        field: u,
        values: h,
        context: o,
        options: U,
        inputId: D
      };
      return /* @__PURE__ */ m("div", { className: "mdm-field", children: [
        /* @__PURE__ */ m("label", { className: "mdm-field__label", htmlFor: D, children: [
          u.label,
          (c = u.validation) != null && c.required || u.required ? /* @__PURE__ */ i("span", { className: "mdm-field__required", children: "*" }) : null
        ] }),
        typeof u.render == "function" ? u.render(O) : _ === "dropdown" ? /* @__PURE__ */ i("div", { className: "mdm-selectWrap", children: /* @__PURE__ */ m(
          "select",
          {
            id: D,
            className: `mdm-input ${I ? "mdm-input--error" : ""}`.trim(),
            value: O.value,
            onChange: (k) => O.onChange(k.target.value),
            children: [
              /* @__PURE__ */ i("option", { value: "", children: u.placeholder || `Select ${u.label}` }),
              U.map((k) => /* @__PURE__ */ i("option", { value: k.value, children: k.label }, k.value))
            ]
          }
        ) }) : _ === "number" ? /* @__PURE__ */ i(
          "input",
          {
            id: D,
            className: `mdm-input ${I ? "mdm-input--error" : ""}`.trim(),
            type: "number",
            min: ((b = u.validation) == null ? void 0 : b.min) ?? u.min ?? 0,
            step: u.step ?? "any",
            inputMode: "numeric",
            value: O.value,
            placeholder: u.placeholder || u.label,
            onKeyDown: R,
            onChange: (k) => O.onChange(k.target.value)
          }
        ) : /* @__PURE__ */ i(
          "input",
          {
            id: D,
            className: `mdm-input ${I ? "mdm-input--error" : ""}`.trim(),
            type: "text",
            value: O.value,
            placeholder: u.placeholder || u.label,
            onChange: (k) => O.onChange(k.target.value)
          }
        ),
        /* @__PURE__ */ i(Fr, { error: I, hint: u.description })
      ] }, u.name);
    }),
    /* @__PURE__ */ m("div", { className: "mdm-form__actions", children: [
      /* @__PURE__ */ m("button", { className: "mdm-button mdm-button--primary", type: "submit", disabled: p, children: [
        p ? /* @__PURE__ */ i(It, { className: "mdm-spinner--inline" }) : null,
        n
      ] }),
      s ? /* @__PURE__ */ i("button", { className: "mdm-button mdm-button--secondary", type: "button", onClick: s, disabled: p, children: a }) : null
    ] })
  ] });
}
const qr = pt(Kr);
function Ur({ title: e, description: t, actionLabel: r, onAction: n }) {
  return /* @__PURE__ */ m("div", { className: "mdm-emptyStateCard", children: [
    /* @__PURE__ */ i(Lr, { className: "mdm-emptyStateCard__icon" }),
    /* @__PURE__ */ i("h3", { children: e || "No data available" }),
    /* @__PURE__ */ i("p", { children: t || "Create your first entry to get started." }),
    /* @__PURE__ */ i("button", { className: "mdm-button mdm-button--primary", type: "button", onClick: n, disabled: !n, children: r || "Add New" })
  ] });
}
function zr({
  columns: e = [],
  data: t = [],
  pageSize: r = jt,
  searchPlaceholder: n = "Search",
  searchDebounceMs: a = 300,
  searchable: s = !0,
  sortable: o = !0,
  filters: l = [],
  className: p = "",
  loading: f = !1,
  emptyStateTitle: h,
  emptyStateDescription: C,
  emptyStateActionLabel: M,
  onEmptyStateAction: T
}) {
  const [S, F] = E(""), [w, R] = E(1), [u, _] = E(r), [I, U] = E({ key: null, direction: "asc" }), [D, O] = E(
    l.reduce((d, g) => (d[g.key] = g.defaultValue ?? "", d), {})
  );
  H(() => {
    _(r);
  }, [r]);
  const c = $r(S, a), b = $(() => e.filter((d) => d.hidden !== !0), [e]), k = $(() => b.filter((d) => d.searchable !== !1), [b]), K = $(
    () => b.find((d) => J(d) === I.key),
    [I.key, b]
  ), P = $(() => {
    let d = [...t];
    const g = c.trim().toLowerCase();
    return g && s && (d = d.filter(
      (A) => k.some((x) => String(ye(A, x) ?? "").toLowerCase().includes(g))
    )), Object.entries(D).forEach(([A, x]) => {
      if (x === "" || x === null || x === void 0)
        return;
      const X = b.find((y) => J(y) === A);
      d = d.filter((y) => String(ye(y, X) ?? "") === String(x));
    }), o && K && d.sort((A, x) => {
      const X = ye(A, K), y = ye(x, K);
      if (X === y)
        return 0;
      const N = String(X ?? "").localeCompare(String(y ?? ""), void 0, {
        numeric: !0,
        sensitivity: "base"
      });
      return I.direction === "asc" ? N : -N;
    }), d;
  }, [t, D, s, k, c, K, I.direction, o, b]), j = Math.max(1, Math.ceil(P.length / u)), V = Math.min(w, j), v = (V - 1) * u, Q = P.slice(v, v + u), fe = Q.length > 0, Se = z((d) => {
    if (d.sortable === !1 || o === !1)
      return;
    const g = J(d);
    g && U((A) => ({
      key: g,
      direction: A.key === g && A.direction === "asc" ? "desc" : "asc"
    }));
  }, [o]), Ie = z((d) => F(d.target.value), []), Oe = z((d) => _(Number(d.target.value)), []), Le = z((d, g) => {
    O((A) => ({
      ...A,
      [d]: g
    }));
  }, []), De = z(() => R((d) => Math.min(j, d + 1)), [j]);
  return /* @__PURE__ */ m("div", { className: `mdm-tableCard ${p}`.trim(), children: [
    /* @__PURE__ */ m("div", { className: "mdm-tableToolbar", children: [
      /* @__PURE__ */ m("div", { className: "mdm-tableToolbar__main", children: [
        s ? /* @__PURE__ */ m("div", { className: "mdm-searchField", children: [
          /* @__PURE__ */ i(Or, { className: "mdm-icon mdm-searchField__icon" }),
          /* @__PURE__ */ i(
            "input",
            {
              className: "mdm-input mdm-input--search",
              type: "search",
              value: S,
              placeholder: n,
              onChange: Ie
            }
          )
        ] }) : null,
        /* @__PURE__ */ i(
          "select",
          {
            className: "mdm-input mdm-input--select mdm-input--pageSize",
            value: u,
            onChange: Oe,
            children: [5, 10, 20, 50].map((d) => /* @__PURE__ */ m("option", { value: d, children: [
              d,
              " / page"
            ] }, d))
          }
        )
      ] }),
      /* @__PURE__ */ i("div", { className: "mdm-tableToolbar__filters", children: l.map((d) => /* @__PURE__ */ m(
        "select",
        {
          className: "mdm-input mdm-input--select mdm-input--pageSize",
          value: D[d.key] ?? "",
          onChange: (g) => Le(d.key, g.target.value),
          children: [
            /* @__PURE__ */ i("option", { value: "", children: d.label || "Filter" }),
            (d.options || []).map((g) => /* @__PURE__ */ i("option", { value: g.value, children: g.label }, g.value))
          ]
        },
        d.key
      )) })
    ] }),
    /* @__PURE__ */ i("div", { className: "mdm-tableScroll", children: /* @__PURE__ */ m("table", { className: "mdm-table", children: [
      /* @__PURE__ */ i("thead", { children: /* @__PURE__ */ i("tr", { children: b.map((d) => {
        const g = J(d), A = I.key === g;
        return /* @__PURE__ */ i(
          "th",
          {
            className: d.sortable !== !1 && o ? "mdm-table__sortable" : "",
            onClick: () => Se(d),
            role: d.sortable !== !1 && o ? "button" : void 0,
            scope: "col",
            children: /* @__PURE__ */ m("span", { className: "mdm-table__thContent", children: [
              d.label,
              A ? /* @__PURE__ */ i("span", { className: "mdm-table__sortMark", children: I.direction === "asc" ? "↑" : "↓" }) : null
            ] })
          },
          g
        );
      }) }) }),
      /* @__PURE__ */ i("tbody", { children: f ? Array.from({ length: u }).map((d, g) => /* @__PURE__ */ i("tr", { className: "mdm-skeletonRow", children: b.map((A) => /* @__PURE__ */ i("td", { children: /* @__PURE__ */ i("span", { className: "mdm-skeletonBlock" }) }, `skeleton-${g}-${J(A)}`)) }, `skeleton-${g}`)) : fe ? Q.map((d, g) => /* @__PURE__ */ i("tr", { children: b.map((A) => /* @__PURE__ */ i("td", { children: typeof A.render == "function" ? A.render(d, { row: d, columns: b }) : tr(ye(d, A)) }, `${(d == null ? void 0 : d.id) ?? g}-${J(A)}`)) }, (d == null ? void 0 : d.id) ?? `${g}-${J(b[0] || {})}`)) : /* @__PURE__ */ i("tr", { children: /* @__PURE__ */ i("td", { className: "mdm-emptyStateCell", colSpan: Math.max(1, b.length), children: /* @__PURE__ */ i(
        Ur,
        {
          title: h || "No data available",
          description: C,
          actionLabel: M,
          onAction: T
        }
      ) }) }) })
    ] }) }),
    /* @__PURE__ */ m("div", { className: "mdm-pagination", children: [
      /* @__PURE__ */ m("span", { className: "mdm-pagination__summary", children: [
        "Showing ",
        P.length === 0 ? 0 : v + 1,
        " to ",
        Math.min(v + u, P.length),
        " of ",
        P.length
      ] }),
      /* @__PURE__ */ m("div", { className: "mdm-pagination__actions", children: [
        /* @__PURE__ */ i("button", { className: "mdm-button mdm-button--secondary", type: "button", onClick: () => R((d) => Math.max(1, d - 1)), disabled: V === 1, children: "Previous" }),
        /* @__PURE__ */ m("span", { className: "mdm-pagination__page", children: [
          "Page ",
          V,
          " of ",
          j
        ] }),
        /* @__PURE__ */ i("button", { className: "mdm-button mdm-button--secondary", type: "button", onClick: De, disabled: V === j, children: "Next" })
      ] }),
      f ? /* @__PURE__ */ m("div", { className: "mdm-loadingInline", children: [
        /* @__PURE__ */ i(It, { className: "mdm-spinner--inline" }),
        "Loading records..."
      ] }) : null
    ] })
  ] });
}
const Wr = pt(zr);
function Jr({ open: e, title: t, children: r, onClose: n, footer: a = null, className: s = "" }) {
  const [o, l] = E(e), [p, f] = E(!1);
  return H(() => {
    if (e) {
      l(!0), f(!1);
      return;
    }
    if (o) {
      f(!0);
      const h = setTimeout(() => {
        l(!1), f(!1);
      }, 180);
      return () => clearTimeout(h);
    }
  }, [e, o]), o ? /* @__PURE__ */ m("div", { className: `mdm-modalRoot ${p ? "is-closing" : "is-open"}`.trim(), role: "presentation", children: [
    /* @__PURE__ */ i("div", { className: "mdm-modalOverlay" }),
    /* @__PURE__ */ m("div", { className: `mdm-modal ${s}`.trim(), role: "dialog", "aria-modal": "true", "aria-labelledby": "mdm-modal-title", children: [
      /* @__PURE__ */ m("div", { className: "mdm-modal__header", children: [
        /* @__PURE__ */ m("div", { children: [
          /* @__PURE__ */ i("p", { className: "mdm-modal__eyebrow", children: "Master Data" }),
          /* @__PURE__ */ i("h2", { id: "mdm-modal-title", className: "mdm-modal__title", children: t })
        ] }),
        /* @__PURE__ */ i("button", { className: "mdm-button mdm-button--ghost", type: "button", onClick: n, children: "Close" })
      ] }),
      /* @__PURE__ */ i("div", { className: "mdm-modal__body", children: r }),
      a ? /* @__PURE__ */ i("div", { className: "mdm-modal__footer", children: a }) : null
    ] })
  ] }) : null;
}
class Sn extends be.Component {
  constructor(t) {
    super(t), this.state = { hasError: !1, error: null };
  }
  static getDerivedStateFromError(t) {
    return { hasError: !0, error: t };
  }
  componentDidCatch(t, r) {
    typeof this.props.onError == "function" && this.props.onError(t, r);
  }
  render() {
    var t;
    return this.state.hasError ? /* @__PURE__ */ i("div", { className: "mdm-errorBoundary", children: /* @__PURE__ */ m("div", { className: "mdm-errorBoundary__card", children: [
      /* @__PURE__ */ i("h2", { className: "mdm-errorBoundary__title", children: "Something went wrong" }),
      /* @__PURE__ */ i("p", { className: "mdm-errorBoundary__description", children: "The application hit an unexpected error. Please refresh the page and try again." }),
      (t = this.state.error) != null && t.message ? /* @__PURE__ */ i("pre", { className: "mdm-errorBoundary__details", children: this.state.error.message }) : null,
      /* @__PURE__ */ i("button", { className: "mdm-button mdm-button--primary", type: "button", onClick: () => window.location.reload(), children: "Reload" })
    ] }) }) : this.props.children;
  }
}
function dt(e) {
  const t = Ne(e);
  return (t == null ? void 0 : t.displayName) || (t == null ? void 0 : t.moduleName) || e;
}
function Gr({
  activeModule: e,
  onModuleChange: t,
  title: r = "Master Data",
  subtitle: n = "Config-driven manufacturing dashboard",
  children: a,
  userName: s = "Admin User",
  userRole: o = "Administrator",
  onProfileClick: l,
  onLogout: p
}) {
  const [f, h] = E(!1), [C, M] = E(!1), T = ft(null), S = me(), F = Ne(e);
  return $(() => (F == null ? void 0 : F.displayName) || dt(e), [e, F]), H(() => {
    const w = (u) => {
      T.current && !T.current.contains(u.target) && M(!1);
    }, R = (u) => {
      u.key === "Escape" && M(!1);
    };
    return window.addEventListener("pointerdown", w), window.addEventListener("keydown", R), () => {
      window.removeEventListener("pointerdown", w), window.removeEventListener("keydown", R);
    };
  }, []), /* @__PURE__ */ m("div", { className: `mdm-dashboard ${f ? "mdm-dashboard--collapsed" : ""}`.trim(), children: [
    /* @__PURE__ */ m("aside", { className: "mdm-sidebar", "aria-label": "Sidebar navigation", children: [
      /* @__PURE__ */ m("div", { className: "mdm-sidebar__brand", children: [
        /* @__PURE__ */ i("div", { className: "mdm-sidebar__logo", "aria-hidden": "true", children: /* @__PURE__ */ i(Dr, { className: "mdm-sidebar__brandIcon" }) }),
        f ? null : /* @__PURE__ */ m("div", { className: "mdm-sidebar__brandText", children: [
          /* @__PURE__ */ i("strong", { children: "MDM Platform" }),
          /* @__PURE__ */ i("span", { children: n })
        ] })
      ] }),
      f ? null : /* @__PURE__ */ i("div", { className: "mdm-sidebar__divider", "aria-hidden": "true" }),
      /* @__PURE__ */ i("nav", { className: "mdm-sidebar__nav", children: S.map((w) => {
        const R = Ne(w), u = (R == null ? void 0 : R.displayName) || dt(w), _ = (R == null ? void 0 : R.icon) || w;
        return /* @__PURE__ */ m(
          "button",
          {
            type: "button",
            className: `mdm-sidebar__item ${e === w ? "is-active" : ""}`.trim(),
            onClick: () => t == null ? void 0 : t(w),
            title: u,
            "aria-current": e === w ? "page" : void 0,
            children: [
              /* @__PURE__ */ i(Rr, { name: _, className: "mdm-sidebar__itemIcon" }),
              f ? null : /* @__PURE__ */ i("span", { children: u })
            ]
          },
          w
        );
      }) })
    ] }),
    /* @__PURE__ */ m("div", { className: "mdm-dashboard__main", children: [
      /* @__PURE__ */ m("header", { className: "mdm-header", children: [
        /* @__PURE__ */ i(
          "button",
          {
            className: "mdm-iconButton mdm-header__sidebarToggle",
            type: "button",
            onClick: () => h((w) => !w),
            "aria-label": f ? "Expand sidebar" : "Collapse sidebar",
            children: /* @__PURE__ */ i(Ir, { className: "mdm-icon--button" })
          }
        ),
        /* @__PURE__ */ i("div", { className: "mdm-header__actions", children: /* @__PURE__ */ m("div", { className: "mdm-profileMenu", ref: T, children: [
          /* @__PURE__ */ m(
            "button",
            {
              className: "mdm-profile",
              type: "button",
              onClick: () => M((w) => !w),
              "aria-expanded": C,
              "aria-haspopup": "menu",
              children: [
                /* @__PURE__ */ i("span", { className: "mdm-profile__avatar", children: s.charAt(0) }),
                /* @__PURE__ */ m("span", { className: "mdm-profile__meta", children: [
                  /* @__PURE__ */ i("strong", { children: s }),
                  /* @__PURE__ */ i("small", { children: o })
                ] }),
                C ? /* @__PURE__ */ i(jr, { className: "mdm-profile__chevron" }) : /* @__PURE__ */ i(Tr, { className: "mdm-profile__chevron" })
              ]
            }
          ),
          C ? /* @__PURE__ */ m("div", { className: "mdm-profileMenu__dropdown", role: "menu", "aria-label": "Profile actions", children: [
            /* @__PURE__ */ m("button", { className: "mdm-profileMenu__item", type: "button", onClick: () => {
              M(!1), l == null || l();
            }, children: [
              /* @__PURE__ */ i(Pr, { className: "mdm-profileMenu__icon" }),
              /* @__PURE__ */ i("span", { children: "Profile" })
            ] }),
            /* @__PURE__ */ m("button", { className: "mdm-profileMenu__item mdm-profileMenu__item--danger", type: "button", onClick: () => {
              M(!1), p == null || p();
            }, children: [
              /* @__PURE__ */ i(Br, { className: "mdm-profileMenu__icon" }),
              /* @__PURE__ */ i("span", { children: "Logout" })
            ] })
          ] }) : null
        ] }) })
      ] }),
      /* @__PURE__ */ i("main", { className: "mdm-content", children: a })
    ] })
  ] });
}
function Hr(e) {
  return `${e.fileName || e.type || "module"}-data.json`;
}
function mt(e, t) {
  L.getState().setEntityRecords(e, t);
}
function Zr({ config: e, configOverride: t = null, adapter: r = null, dataMapper: n = null, className: a = "" }) {
  var x, X;
  const s = Rt(), o = Et();
  e == null || e.type;
  const [l, p] = E(!1), [f, h] = E(null), [C, M] = E(""), [T, S] = E(""), [F, w] = E(!0), [R, u] = E(!1), [_, I] = E([]), U = ft(null), D = $(
    () => Ce(e, t),
    [e, t]
  ), O = $(
    () => Ce(D, n ? { dataMapper: n } : null),
    [n, D]
  ), c = $(
    () => Gt(O || {}, {
      bundle: o,
      related: o,
      theme: s.theme
    }),
    [o, s.theme, O]
  ), b = Ht(c || {}), k = (c == null ? void 0 : c.fields) || [], K = $(
    () => f || (c == null ? void 0 : c.defaultValues) || {},
    [f, c == null ? void 0 : c.defaultValues]
  ), P = f ? `Edit ${(c == null ? void 0 : c.moduleName) || "Module"}` : `Add ${(c == null ? void 0 : c.moduleName) || "Module"}`, j = $(
    () => ({
      bundle: o,
      related: o,
      theme: s.theme,
      config: c || {},
      dataMapper: n
    }),
    [o, s.theme, n, c]
  ), V = c != null && c.type ? `module:${c.type}` : null, v = c != null && c.type && (r || ((x = s.getAdapter) == null ? void 0 : x.call(s, c.type)) || ((X = s.adapters) == null ? void 0 : X[c.type])) || null, Q = z(
    async ({ forceRefresh: y = !1 } = {}) => {
      if (!(c != null && c.type) || !(v != null && v.getList))
        return S(`No adapter found for ${(c == null ? void 0 : c.type) || "module"}.`), w(!1), [];
      if (!y) {
        const N = Xt(V);
        if (Array.isArray(N))
          return S(""), I(N), mt(c.type, N), w(!1), N;
      }
      S(""), w(!0);
      try {
        const N = await v.getList(j), B = Array.isArray(N) ? N : [];
        return I(B), mt(c.type, B), er(V, B), B;
      } catch (N) {
        return S((N == null ? void 0 : N.message) || "Failed to load records."), [];
      } finally {
        w(!1);
      }
    },
    [j, V, v, c == null ? void 0 : c.type]
  );
  H(() => {
    c != null && c.type || M("Missing module configuration.");
  }, [c]), H(() => {
    c != null && c.type && (h(null), p(!1), Q());
  }, [c == null ? void 0 : c.type, v]);
  function fe() {
    p(!1), h(null);
  }
  function Se() {
    h(null), p(!0);
  }
  function Ie(y) {
    h(y), p(!0);
  }
  async function Oe(y) {
    if (!v) {
      S(`No adapter available for ${c.type}.`);
      return;
    }
    u(!0), S("");
    try {
      f ? (await v.update(f.id, y, j), M(`${c.moduleName} updated successfully.`)) : (await v.create(y, j), M(`${c.moduleName} created successfully.`)), Pe(V), await Q({ forceRefresh: !0 }), fe();
    } catch (N) {
      S((N == null ? void 0 : N.message) || `Failed to save ${c.moduleName.toLowerCase()}.`);
    } finally {
      u(!1);
    }
  }
  async function Le(y) {
    if (!(v != null && v.delete)) {
      S(`No adapter available for ${c.type}.`);
      return;
    }
    u(!0), S("");
    try {
      await v.delete(y.id, j), M(`${c.moduleName} deleted successfully.`), Pe(V), await Q({ forceRefresh: !0 });
    } catch (N) {
      S((N == null ? void 0 : N.message) || `Failed to delete ${c.moduleName.toLowerCase()}.`);
    } finally {
      u(!1);
    }
  }
  async function De() {
    if (!(v != null && v.export)) {
      S(`No export adapter available for ${c.type}.`);
      return;
    }
    u(!0), S("");
    try {
      const y = await v.export(j);
      gr(Hr(c), y || { type: c.type, records: _ }), M(`${c.moduleName} exported successfully.`);
    } catch (y) {
      S((y == null ? void 0 : y.message) || `Failed to export ${c.moduleName.toLowerCase()}.`);
    } finally {
      u(!1);
    }
  }
  async function d(y) {
    var B;
    const N = (B = y.target.files) == null ? void 0 : B[0];
    if (N)
      try {
        u(!0), S("");
        const ne = await Nr(N, c.type);
        if ((ne == null ? void 0 : ne.type) !== c.type)
          throw new Error(`Expected ${c.type} import payload.`);
        if (!(v != null && v.import))
          throw new Error(`No import adapter available for ${c.type}.`);
        await v.import(ne, j), Pe(V), await Q({ forceRefresh: !0 }), M(`${c.moduleName} imported successfully.`);
      } catch (ne) {
        S(`Import failed: ${ne.message}`);
      } finally {
        u(!1), y.target.value = "";
      }
  }
  if (!(c != null && c.type))
    return /* @__PURE__ */ i("div", { className: "mdm-module", children: "Unknown module configuration." });
  const A = [...c.columns || []];
  return (b.edit || b.delete) && A.push({
    key: "__actions",
    label: "Actions",
    searchable: !1,
    sortable: !1,
    render: (y) => /* @__PURE__ */ m("div", { className: "mdm-rowActions", children: [
      b.edit ? /* @__PURE__ */ i("button", { className: "mdm-button mdm-button--small", type: "button", onClick: () => Ie(y), children: "Edit" }) : null,
      b.delete ? /* @__PURE__ */ i("button", { className: "mdm-button mdm-button--small mdm-button--danger", type: "button", onClick: () => Le(y), children: "Delete" }) : null
    ] })
  }), /* @__PURE__ */ m("section", { className: `mdm-module ${a}`.trim(), children: [
    /* @__PURE__ */ m("div", { className: "mdm-card mdm-card--module", children: [
      /* @__PURE__ */ m("header", { className: "mdm-module__header", children: [
        /* @__PURE__ */ m("div", { className: "mdm-module__headerContent", children: [
          /* @__PURE__ */ i("p", { className: "mdm-module__eyebrow", children: c.moduleName }),
          /* @__PURE__ */ i("h1", { className: "mdm-module__title", children: c.displayName || c.moduleName }),
          c.description ? /* @__PURE__ */ i("p", { className: "mdm-module__description", children: c.description }) : null
        ] }),
        /* @__PURE__ */ m("div", { className: "mdm-module__actions mdm-module__headerActions", children: [
          b.create ? /* @__PURE__ */ m("button", { className: "mdm-button mdm-button--primary", type: "button", onClick: Se, children: [
            "Add ",
            c.moduleName
          ] }) : null,
          b.export ? /* @__PURE__ */ m("button", { className: "mdm-button mdm-button--secondary", type: "button", onClick: De, disabled: R, children: [
            R ? /* @__PURE__ */ i("span", { className: "mdm-button__spinner" }) : null,
            "Export JSON"
          ] }) : null,
          b.import ? /* @__PURE__ */ m(Dt, { children: [
            /* @__PURE__ */ i("button", { className: "mdm-button mdm-button--secondary", type: "button", onClick: () => {
              var y;
              return (y = U.current) == null ? void 0 : y.click();
            }, children: "Import JSON" }),
            /* @__PURE__ */ i("input", { ref: U, type: "file", accept: "application/json,.json", hidden: !0, onChange: d })
          ] }) : null
        ] })
      ] }),
      C ? /* @__PURE__ */ i("div", { className: "mdm-message", children: C }) : null,
      T ? /* @__PURE__ */ i("div", { className: "mdm-message mdm-message--error", children: T }) : null,
      /* @__PURE__ */ i(
        Wr,
        {
          columns: A.map((y) => ({
            ...y,
            render: y.render || ((N) => {
              const B = N[y.key];
              return B === "" || B === null || B === void 0 ? "-" : B;
            })
          })),
          data: _,
          pageSize: c.pageSize,
          searchable: c.searchable !== !1,
          sortable: c.sortable !== !1,
          filters: c.filters || [],
          loading: F || R,
          emptyStateTitle: `No ${c.moduleName.toLowerCase()} records yet`,
          emptyStateDescription: `Add the first ${c.moduleName.toLowerCase()} to get started.`,
          emptyStateActionLabel: b.create ? `Add ${c.moduleName}` : "Create new",
          onEmptyStateAction: b.create ? Se : void 0
        }
      )
    ] }),
    /* @__PURE__ */ i(Jr, { open: l, title: P, onClose: fe, children: /* @__PURE__ */ i(
      qr,
      {
        schema: k,
        initialValues: K,
        submitLabel: f ? "Update" : "Create",
        onCancel: fe,
        onSubmit: Oe,
        context: {
          bundle: o,
          related: o,
          config: c,
          editingRecord: f
        },
        loading: R
      }
    ) })
  ] });
}
function re({
  type: e,
  configOverride: t = null,
  config: r = null,
  dataMapper: n = null,
  className: a = ""
}) {
  const s = Et(), o = Rt(), l = $(
    () => Ne(e, {
      bundle: s,
      related: s,
      theme: o.theme
    }),
    [s, o.theme, e]
  ), p = $(
    () => Ce(l, r),
    [l, r]
  ), f = $(
    () => Ce(p, t),
    [t, p]
  ), h = $(
    () => {
      var C, M;
      return ((C = o.getAdapter) == null ? void 0 : C.call(o, e)) || ((M = o.adapters) == null ? void 0 : M[e]) || null;
    },
    [o.getAdapter, o.adapters, e]
  );
  return f ? /* @__PURE__ */ i(
    Zr,
    {
      className: a,
      config: f,
      configOverride: null,
      adapter: h,
      dataMapper: n
    },
    e
  ) : /* @__PURE__ */ m("div", { className: "mdm-module", children: [
    "Unknown module type: ",
    e
  ] });
}
function An() {
  return /* @__PURE__ */ i(re, { type: "category" });
}
function Mn() {
  return /* @__PURE__ */ i(re, { type: "product" });
}
function Cn() {
  return /* @__PURE__ */ i(re, { type: "workstation" });
}
function _n() {
  return /* @__PURE__ */ i(re, { type: "resource" });
}
function En() {
  return /* @__PURE__ */ i(re, { type: "warehouse" });
}
function $n() {
  return /* @__PURE__ */ i(re, { type: "inventory" });
}
function Rn({
  initialModule: e,
  title: t = "Master Data Platform",
  subtitle: r = "SaaS-style manufacturing operations console",
  userName: n = "Admin User",
  userRole: a = "Administrator",
  adapters: s = {}
}) {
  const o = e || me()[0] || "product", [l, p] = E(o);
  return /* @__PURE__ */ i(Er, { adapters: s, children: /* @__PURE__ */ i(
    Gr,
    {
      activeModule: l,
      onModuleChange: p,
      title: t,
      subtitle: r,
      userName: n,
      userRole: a,
      children: /* @__PURE__ */ i(re, { type: l })
    }
  ) });
}
export {
  Dr as BrandMark,
  An as CategoryModule,
  Tr as ChevronDownIcon,
  jr as ChevronUpIcon,
  jt as DEFAULT_PAGE_SIZE,
  Gr as DashboardLayout,
  Wr as DataTable,
  qr as DynamicForm,
  ue as ENTITY_KEYS,
  en as ENTITY_LABELS,
  tn as ENTITY_ORDER,
  Lr as EmptyStateIcon,
  Sn as ErrorBoundary,
  Zr as GenericModule,
  $n as InventoryModule,
  Br as LogOutIcon,
  Tt as MODULE_TYPES,
  $t as MasterContext,
  Rn as MasterDashboard,
  Zr as MasterDataModuleView,
  re as MasterModule,
  Er as MasterProvider,
  Ir as MenuIcon,
  Jr as Modal,
  Rr as ModuleIcon,
  Xr as PACKAGE_NAME,
  Mn as ProductModule,
  _n as ResourceModule,
  $e as STORAGE_KEY,
  Or as SearchIcon,
  It as SpinnerIcon,
  Pr as UserIcon,
  En as WarehouseModule,
  Cn as WorkstationModule,
  Ee as adapterRegistry,
  nn as buildFieldErrorMap,
  nr as categoryAdapter,
  Vt as categoryConfig,
  an as clearAllCache,
  Pe as clearCache,
  pr as clearStoredBundle,
  q as cloneConfigValue,
  de as createBaseModuleConfig,
  lr as createEntityRecord,
  Ct as createLocalStorageModuleAdapter,
  cn as createMemoryStorageAdapter,
  on as debounce,
  He as defaultSeedData,
  Pt as defaultTheme,
  dr as deleteEntityRecord,
  gr as downloadJsonFile,
  fr as exportModuleRecords,
  ce as exportStoredBundle,
  tr as formatCellValue,
  un as getAdapter,
  Xt as getCache,
  Vt as getCategoryConfig,
  J as getColumnKey,
  dn as getDefaultBundle,
  We as getEmptyBundle,
  mn as getEntityRecords,
  Ut as getInventoryConfig,
  ln as getMasterRuntime,
  Ne as getModuleConfig,
  Ht as getModulePermissions,
  me as getModuleTypes,
  xt as getProductConfig,
  Kt as getResourceConfig,
  et as getStorageAdapter,
  W as getStoredBundle,
  qt as getWarehouseConfig,
  Ft as getWorkstationConfig,
  fn as importModuleRecords,
  Ue as importStoredBundle,
  Ut as inventoryConfig,
  nt as isBlank,
  rn as isNegativeNumber,
  yt as isNil,
  ht as lightTheme,
  Xe as localStorageAdapter,
  ge as mapToAPI,
  G as mapToUI,
  vr as mergeAdapterRegistry,
  Ce as mergeConfig,
  Ye as mergeDeep,
  ae as mergeList,
  Qe as moduleRegistry,
  He as moduleSeeds,
  rt as normalizeBundle,
  je as normalizeColumn,
  Te as normalizeField,
  _t as normalizeImportedBundle,
  bt as normalizeNumberValue,
  Bt as normalizeTheme,
  br as parseMasterDataText,
  xt as productConfig,
  Nr as readMasterDataFile,
  sn as registerModule,
  mr as resetStoredBundle,
  Ze as resolveApiKey,
  Nt as resolveFieldOptions,
  Gt as resolveModuleConfig,
  ye as resolveRowValue,
  ke as resolveUiKey,
  Kt as resourceConfig,
  at as sanitizeValues,
  pn as saveEntityRecords,
  Y as saveStoredBundle,
  hr as serializeBundle,
  hn as serializeModule,
  er as setCache,
  ir as setMasterRuntime,
  ur as updateEntityRecord,
  bn as useCategory,
  $r as useDebouncedValue,
  pe as useEntityData,
  kn as useInventory,
  Rt as useMasterContext,
  Cr as useMasterData,
  Et as useMasterDataBundle,
  L as useMasterDataStore,
  yn as useMasterStore,
  gn as useProduct,
  vn as useResource,
  wn as useWarehouse,
  Nn as useWorkstation,
  gt as validateField,
  ot as validateFields,
  yr as validateImportPayload,
  zt as validateValues,
  qt as warehouseConfig,
  Ft as workstationConfig
};
