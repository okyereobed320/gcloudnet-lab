import React, { createContext, useContext } from 'react';

const EducationContext = createContext<boolean>(false);

export const EducationProvider: React.FC<{ value: boolean; children: React.ReactNode }> = ({ value, children }) => (
  <EducationContext.Provider value={value}>
    {children}
  </EducationContext.Provider>
);

export const useEducationMode = () => useContext(EducationContext);
