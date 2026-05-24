import type { NetworkState } from './network';

export interface Objective {
  id: string;
  task: string;
  hint: string;
  isCompleted: boolean;
  validationFn: (state: NetworkState) => boolean;
}

export interface LearningResource {
  title: string;
  content: string;
  url?: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  objectives: Objective[];
  learningResources: LearningResource[];
  nextMissionId?: string;
}
