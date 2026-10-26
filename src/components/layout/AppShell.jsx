import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar.jsx";
import { Topbar } from "./Topbar.jsx";
import { GlobalSearchModal } from "./GlobalSearchModal.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { searchModalOpen, setSearchModalOpen } = useApp();

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchModalOpen]);

  return (
    <div className="app-shell">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="app-main">
        <Topbar onOpenMobile={() => setMobileOpen(true)} />
        <main className="page-content-scroll">
          <Outlet />
        </main>
      </div>

      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}
