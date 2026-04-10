export const moduleSeeds = {
  category: [
    {
      id: 'cat-1',
      name: 'Raw Material',
      code: 'RM',
      description: 'Incoming raw materials and inputs'
    },
    {
      id: 'cat-2',
      name: 'Finished Goods',
      code: 'FG',
      description: 'Completed and shippable products'
    }
  ],
  product: [
    {
      id: 'prd-1',
      name: 'Steel Sheet',
      code: 'SS-001',
      categoryId: 'cat-1',
      unit: 'kg',
      minStock: 100
    }
  ],
  workstation: [
    {
      id: 'ws-1',
      name: 'Cutting Station',
      code: 'CUT-01',
      location: 'Line A',
      capacity: 5
    }
  ],
  resource: [
    {
      id: 'res-1',
      name: 'Laser Cutter',
      code: 'LAS-01',
      type: 'Machine',
      workstationId: 'ws-1'
    }
  ],
  warehouse: [
    {
      id: 'wh-1',
      name: 'Main Warehouse',
      code: 'WH-01',
      location: 'Plant 1',
      capacity: 5000
    }
  ],
  inventory: [
    {
      id: 'inv-1',
      productId: 'prd-1',
      warehouseId: 'wh-1',
      quantity: 250,
      reorderLevel: 100
    }
  ]
};
