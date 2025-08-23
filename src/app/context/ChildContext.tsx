// src/app/context/ChildContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Child = {
  id: string;
  name: string;
  school: string;
};

type ChildContextType = {
  selectedChild: Child | null;
  setSelectedChild: (child: Child | null) => void;
};

const ChildContext = createContext<ChildContextType | undefined>(undefined);

export function ChildProvider({ children }: { children: ReactNode }) {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);

  useEffect(() => {
    // Učitava odabir iz localStorage-a pri prvom renderovanju
    const storedChild = localStorage.getItem('selectedChild');
    if (storedChild) {
      setSelectedChild(JSON.parse(storedChild));
    }
  }, []);

  return (
    <ChildContext.Provider value={{ selectedChild, setSelectedChild }}>
      {children}
    </ChildContext.Provider>
  );
}

export function useChild() {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
}