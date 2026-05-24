import React from 'react';
import { useMission } from '../context/MissionContext';
import { CheckCircle2, Circle, BookOpen, Lightbulb, ChevronRight } from 'lucide-react';

export const MissionControl: React.FC = () => {
  const { currentMission, completedObjectives, nextMission } = useMission();

  const isMissionComplete = currentMission.objectives.every(obj => 
    completedObjectives.includes(obj.id)
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white w-72 border-r border-white/10 shadow-2xl z-50">
      <div className="p-6 border-b border-white/10 bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-blue-500 rounded-lg shadow-lg shadow-blue-500/20">
            <BookOpen size={18} />
          </div>
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Active Mission</span>
        </div>
        <h2 className="text-xl font-black tracking-tight leading-none mb-2">{currentMission.title}</h2>
        <p className="text-xs text-white/60 leading-relaxed italic">{currentMission.description}</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
        {/* Objectives Section */}
        <section>
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            Objectives
            <div className="h-px flex-1 bg-white/5" />
          </h3>
          <div className="space-y-4">
            {currentMission.objectives.map((obj) => (
              <div key={obj.id} className="group">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 transition-colors ${completedObjectives.includes(obj.id) ? 'text-green-400' : 'text-white/20'}`}>
                    {completedObjectives.includes(obj.id) ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                  </div>
                  <div>
                    <p className={`text-sm font-bold transition-colors ${completedObjectives.includes(obj.id) ? 'text-white/40 line-through' : 'text-white'}`}>
                      {obj.task}
                    </p>
                    {!completedObjectives.includes(obj.id) && (
                      <div className="mt-2 flex items-start gap-2 p-2 bg-blue-500/5 border border-blue-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Lightbulb size={12} className="text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-blue-300 leading-tight italic">{obj.hint}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Learning Hub Section */}
        <section>
          <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            Learning Hub
            <div className="h-px flex-1 bg-white/5" />
          </h3>
          <div className="space-y-4">
            {currentMission.learningResources.map((res, i) => (
              <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all cursor-help group">
                <h4 className="text-xs font-black text-blue-400 mb-1 group-hover:text-blue-300 transition-colors uppercase tracking-tight">{res.title}</h4>
                <p className="text-[11px] text-white/60 leading-relaxed">{res.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isMissionComplete && (
        <div className="p-6 border-t border-white/10 bg-blue-600 animate-in slide-in-from-bottom duration-500">
          <button 
            onClick={nextMission}
            className="w-full py-3 bg-white text-blue-600 font-black text-sm rounded-xl shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            NEXT MISSION
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};
