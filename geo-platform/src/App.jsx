import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import AiAssistant from "./pages/AiAssistant";
import AiDiagnosis from "./pages/AiDiagnosis";
import Materials from "./pages/Materials";
import AiWriting from "./pages/AiWriting";
import HotCopy from "./pages/HotCopy";
import Publish from "./pages/Publish";
import DataAnalysis from "./pages/DataAnalysis";
import AiTools from "./pages/AiTools";
import SeoGEO from "./pages/SeoGEO";
import TrustScore from "./pages/TrustScore";
import PlanMode from "./pages/PlanMode";
import Goals from "./pages/Goals";
import Settings from "./pages/Settings";
import Backlinks from "./pages/Backlinks";
import KeywordTracking from "./pages/KeywordTracking";
import Reports from "./pages/Reports";
import MediaPublish from "./pages/MediaPublish";
import HotCopyPro from "./pages/HotCopyPro";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("geo_user");
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch(e) {}
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("geo_user");
    setUser(null);
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
        <Route index element={<Dashboard />} />
        <Route path="ai-assistant" element={<AiAssistant />} />
        <Route path="ai-diagnosis" element={<AiDiagnosis />} />
        <Route path="materials" element={<Materials />} />
        <Route path="ai-writing" element={<AiWriting />} />
        <Route path="hot-copy" element={<HotCopy />} />
        <Route path="hot-copy-pro" element={<HotCopyPro />} />
        <Route path="publish" element={<Publish />} />
        <Route path="media-publish" element={<MediaPublish />} />
        <Route path="data-analysis" element={<DataAnalysis />} />
        <Route path="reports" element={<Reports />} />
        <Route path="ai-tools" element={<AiTools />} />
        <Route path="seo-geo" element={<SeoGEO />} />
        <Route path="keyword-tracking" element={<KeywordTracking />} />
        <Route path="backlinks" element={<Backlinks />} />
        <Route path="trust-score" element={<TrustScore />} />
        <Route path="plan-mode" element={<PlanMode />} />
        <Route path="goals" element={<Goals />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;