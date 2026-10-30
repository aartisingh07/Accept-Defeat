import BrandLogo from '../BrandLogo';

export default function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-4 selection:bg-purple-600/30">
      {/* Ambient background glow */}
      <div className="absolute w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-4">
        <BrandLogo size="lg" />

        {/* Loading ring */}
        <div className="flex items-center gap-3 text-xs font-mono text-purple-300">
          <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-400 rounded-full animate-spin" />
          <span>Authenticating battle arena session...</span>
        </div>
      </div>
    </div>
  );
}

