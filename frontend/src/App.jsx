import "./global.css";
import { Toaster } from "./components/ui/toaster.jsx";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "./components/ui/sonner.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Connect from "./pages/Connect.jsx";
import Metrics from "./pages/Metrics.jsx";
import SocketWiki from "./pages/SocketWiki.jsx";
import TestLab from "./pages/TestLab.jsx";
import Login from "./pages/Login.jsx";
import Replay from "./pages/Replay.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/metrics" element={<Metrics />} />
          <Route path="/wiki" element={<SocketWiki />} />
          <Route path="/test" element={<TestLab />} />
          <Route path="/replay" element={<Replay />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")).render(<App />);
