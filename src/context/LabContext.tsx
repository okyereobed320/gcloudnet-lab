import React, { createContext, useContext, useState } from 'react';

export type ToolType = 'SELECT' | 'WIRE' | 'DELETE' | 'NOTE';
export type SimMode = 'REALTIME' | 'SIMULATION';

interface LabContextType {
  tool: ToolType;
  setTool: (tool: ToolType) => void;
  mode: SimMode;
  setMode: (mode: SimMode) => void;
  isEducationMode: boolean;
  setIsEducationMode: (val: boolean) => void;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export const LabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tool, setTool] = useState<ToolType>('SELECT');
  const [mode, setMode] = useState<SimMode>('REALTIME');
  const [isEducationMode, setIsEducationMode] = useState(true);

  return (
    <LabContext.Provider value={{ tool, setTool, mode, setMode, isEducationMode, setIsEducationMode }}>
      {children}
    </LabContext.Provider>
  );
};

export const useLab = () => {
  const context = useContext(LabContext);
  if (!context) throw new Error('useLab must be used within a LabProvider');
  return context;
};
