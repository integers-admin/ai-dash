import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import PerplexityData from "./components/PerplexityData";
import { useEffect, useState } from "react";
import ApolloData from "./components/ApolloData";
import OpenAIData from "./components/OpenAIData";
import ApifyData from "./components/ApifyData";
import NotFound from "./components/NotFound";
import { ToastContainer } from 'react-toastify';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const rawData = localStorage.getItem("dark_mode");
      return rawData !== null ? JSON.parse(rawData) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    localStorage.setItem("dark_mode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <BrowserRouter>
    <ToastContainer/>
      <div
        className={`flex h-screen overflow-hidden transition-colors duration-500 ${
          darkMode ? "bg-[#0b0e14]" : "bg-slate-50"
        }`}
      >
        <Sidebar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<ApifyData darkMode={darkMode} />} />
            <Route
              path="/openai"
              element={<OpenAIData darkMode={darkMode} />}
            />
            <Route
              path="/perplexity"
              element={<PerplexityData darkMode={darkMode} />}
            />

            <Route
              path="/apollo"
              element={<ApolloData darkMode={darkMode} />}
            />

            <Route path="*" element={<NotFound darkMode={darkMode} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
