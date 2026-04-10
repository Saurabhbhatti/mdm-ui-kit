import React, { createContext, useContext } from 'react';

export const MasterContext = createContext({
  theme: {},
  storageAdapter: null,
  adapters: {},
  getAdapter: null
});

export function useMasterContext() {
  return useContext(MasterContext);
}
