import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell.jsx";
import { DashboardPage } from "../pages/DashboardPage.jsx";
import { ProblemsPage } from "../pages/ProblemsPage.jsx";
import { WorkspacePage } from "../pages/WorkspacePage.jsx";
import { BookmarksPage } from "../pages/BookmarksPage.jsx";
import { RevisionPage } from "../pages/RevisionPage.jsx";
import { MockInterviewsPage } from "../pages/MockInterviewsPage.jsx";
import { ProgressPage } from "../pages/ProgressPage.jsx";
import { SettingsPage } from "../pages/SettingsPage.jsx";
import { NotFoundPage } from "../pages/NotFoundPage.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/workspace" element={<WorkspacePage />} />
        <Route path="/workspace/:problemId" element={<WorkspacePage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/revision" element={<RevisionPage />} />
        <Route path="/mock-interviews" element={<MockInterviewsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
