import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import FloatingAIChat from '../ai/FloatingAIChat';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0EBD8] text-[#0D1321] flex selection:bg-[#748CAB]/30 selection:text-[#1D2D44] relative">
      {/* Persistent Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Reusable Floating AI Chatbot (Fixed to bottom-right across all pages) */}
      <FloatingAIChat />
    </div>
  );
}
