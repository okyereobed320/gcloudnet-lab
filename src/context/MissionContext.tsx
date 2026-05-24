import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Mission } from '../types/mission';
import type { NetworkState } from '../types/network';
import { MISSIONS } from '../data/missions';

interface MissionContextType {
  currentMission: Mission;
  completedObjectives: string[];
  allMissions: Mission[];
  setMission: (id: string) => void;
  nextMission: () => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode, state: NetworkState }> = ({ children, state }) => {
  const [missionIndex, setMissionIndex] = useState(0);
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);

  const currentMission = MISSIONS[missionIndex];

  useEffect(() => {
    const newlyCompleted = currentMission.objectives
      .filter(obj => !completedObjectives.includes(obj.id))
      .filter(obj => obj.validationFn(state))
      .map(obj => obj.id);

    if (newlyCompleted.length > 0) {
      setCompletedObjectives(prev => [...prev, ...newlyCompleted]);
    }
  }, [state, currentMission, completedObjectives]);

  const setMission = (id: string) => {
    const index = MISSIONS.findIndex(m => m.id === id);
    if (index !== -1) {
      setMissionIndex(index);
      setCompletedObjectives([]);
    }
  };

  const nextMission = () => {
    if (missionIndex < MISSIONS.length - 1) {
      setMissionIndex(prev => prev + 1);
      setCompletedObjectives([]);
    }
  };

  return (
    <MissionContext.Provider value={{ 
      currentMission, 
      completedObjectives, 
      allMissions: MISSIONS,
      setMission,
      nextMission
    }}>
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) throw new Error('useMission must be used within a MissionProvider');
  return context;
};
