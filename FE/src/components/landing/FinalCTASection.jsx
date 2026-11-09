import { Swords, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FinalCTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Deep Space Blue Container Card */}
        <div className="relative rounded-3xl p-8 sm:p-14 bg-[#1D2D44] text-[#F0EBD8] border border-[#34465C] shadow-2xl text-center overflow-hidden">
          
          {/* Subtle ambient glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#748CAB]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-20 right-0 w-[350px] h-[350px] bg-[#0D1321]/30 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#152237] border border-[#34465C] text-[#748CAB] text-xs font-mono shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#748CAB]" />
              <span>Step Onto The Proving Grounds</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F0EBD8] tracking-tight leading-tight">
              Ready to Accept the Challenge?
            </h2>

            <p className="text-base sm:text-lg text-[#748CAB] max-w-2xl mx-auto leading-relaxed font-normal">
              Stop coding alone. Join the arena, challenge developers, and turn your skills into achievements.
            </p>

            {/* Primary & Secondary Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-[#1D2D44] bg-[#F0EBD8] hover:bg-[#FFFFFF] flex items-center justify-center gap-2.5 cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Swords className="w-4 h-4 text-[#1D2D44]" />
                <span>Join Accept&Defeat</span>
                <ArrowRight className="w-4 h-4 text-[#1D2D44]" />
              </button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-[#F0EBD8] hover:text-[#FFFFFF] bg-[#152237] hover:bg-[#1D2D44] border border-[#34465C] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <span>Already have an account? Login</span>
              </button>
            </div>

            {/* Micro assurances */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#748CAB]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#55765B]" />
                <span>Free developer account</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#748CAB]" />
                <span>Instant GitHub / Google setup</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#F0EBD8]" />
                <span>Real-time code evaluation</span>
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
