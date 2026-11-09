import { useState, useEffect } from 'react';
import { Cpu, Edit3, Plus, X, Check } from 'lucide-react';
import userService from '../../services/userService';
import { useAuth } from '../../context/useAuth';

export default function SkillsCard() {
  const { updateUser } = useAuth();
  const [skills, setSkills] = useState(['React', 'Node.js', 'MongoDB', 'JavaScript', 'HTML', 'CSS']);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    let mounted = true;
    userService.getSkills().then((data) => {
      if (mounted && Array.isArray(data)) {
        setSkills(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.includes(newSkill.trim())) {
      setNewSkill('');
      return;
    }
    const updated = [...skills, newSkill.trim()];
    setSkills(updated);
    updateUser({ skills: updated });
    userService.updateSkills(updated);
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    setSkills(updated);
    updateUser({ skills: updated });
    userService.updateSkills(updated);
  };

  return (
    <>
      <div className="dashboard-card rounded-2xl p-5 space-y-3.5 text-left">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#1D2D44]" />
            <h2 className="text-sm font-bold text-[#0D1321] tracking-wide">Your Skills</h2>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-bold text-[#1D2D44] hover:text-[#0D1321] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
        </div>

        {/* Selected Skills Tags */}
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-xs text-[#0D1321] font-medium hover:border-[#748CAB] transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#55765B]" />
              <span>{skill}</span>
            </span>
          ))}

          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#FFFFFF] border border-[#DDDCCF] text-xs font-semibold text-[#1D2D44] hover:bg-[#F7F5EF] transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Edit Skills Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md rounded-2xl bg-[#FFFFFF] border border-[#DDDCCF] p-6 space-y-4 text-left shadow-2xl text-[#0D1321]">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[#0D1321]">Manage Your Technologies</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-[#3E5C76] hover:text-[#0D1321] hover:bg-[#F7F5EF] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#3E5C76]">
              Add or remove skills to receive relevant challenges tailored to your engineering stack.
            </p>

            <form onSubmit={handleAddSkill} className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. TypeScript, GraphQL, Docker..."
                className="flex-1 h-9 px-3 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-xs text-[#0D1321] placeholder-[#3E5C76]/60 focus:outline-none focus:border-[#1D2D44] focus:ring-1 focus:ring-[#1D2D44]/30"
              />
              <button
                type="submit"
                className="bg-[#1D2D44] hover:bg-[#0D1321] text-[#F0EBD8] px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              >
                Add
              </button>
            </form>

            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#F7F5EF] border border-[#DDDCCF] text-xs text-[#0D1321]"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-[#3E5C76] hover:text-[#B65C50] cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-[#1D2D44] hover:bg-[#0D1321] text-[#F0EBD8] px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Skills</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
