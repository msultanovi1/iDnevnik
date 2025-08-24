// src/app/context/ChildContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

// Definiramo tip za pojedinačni profil djeteta

type ChildProfile = {
  id: string;
  name: string;
  school: string; 
};

// Definiramo tip za naš kontekst
type ChildContextType = {
  children: ChildProfile[];
  setChildren: Dispatch<SetStateAction<ChildProfile[]>>;
  selectedChild: ChildProfile | null;
  setSelectedChild: Dispatch<SetStateAction<ChildProfile | null>>;
};

// Kreiramo kontekst s početnim vrijednostima
const ChildContext = createContext<ChildContextType | undefined>(undefined);

// Kreiramo Provider komponentu
export const ChildProvider = ({ children }: { children: ReactNode }) => {
  const [childrenList, setChildrenList] = useState<ChildProfile[]>([]);
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);

  return (
    <ChildContext.Provider value={{
      children: childrenList,
      setChildren: setChildrenList,
      selectedChild,
      setSelectedChild,
    }}>
      {children}
    </ChildContext.Provider>
  );
};

// Kreiramo custom hook za jednostavnu upotrebu konteksta
export const useChild = () => {
  const context = useContext(ChildContext);
  if (context === undefined) {
    throw new Error('useChild must be used within a ChildProvider');
  }
  return context;
};