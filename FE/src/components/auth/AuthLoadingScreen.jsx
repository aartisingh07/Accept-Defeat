import BrandLogo from '../BrandLogo';

export default function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-[#F0EBD8] flex flex-col items-center justify-center p-4 selection:bg-[#748CAB]/30">
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 bg-[#748CAB]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-4">
        <BrandLogo size="lg" />

        {/* Loading ring */}
        <div className="flex items-center gap-3 text-xs font-mono text-[#3E5C76]">
          <div className="w-4 h-4 border-2 border-[#748CAB]/40 border-t-[#1D2D44] rounded-full animate-spin" />
          <span>Authenticating battle arena session...</span>
        </div>
      </div>
    </div>
  );
}
