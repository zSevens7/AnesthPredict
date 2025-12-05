import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importação das Páginas
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PacienteForm from "./pages/PacienteForm";
import Historico from "./pages/Historico";
import Ajuda from "./pages/Ajuda";
import DetalhesHistorico from "./pages/DetalhesHistorico"; // <--- IMPORT NOVO AQUI

export default function App() {
  const [user, setUser] = useState<string | null>(null);

  // Verifica se já tem login salvo ao abrir o app
  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed.username || parsed); 
      } catch {
        setUser(saved);
      }
    }
  }, []);

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem("user", JSON.stringify({ username }));
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* ROTAS PÚBLICAS (Sem Login) */}
        {!user ? (
          <>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          /* ROTAS PRIVADAS (Logado) */
          <>
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            
            <Route path="/novo-paciente" element={<PacienteForm />} />
            
            <Route path="/historico" element={<Historico />} />
            
            {/* --- ROTA NOVA PARA OS DETALHES --- */}
            {/* O ":id" diz pro React que essa parte do link muda (é dinâmico) */}
            <Route path="/historico/:id" element={<DetalhesHistorico />} />
            
            <Route path="/ajuda" element={<Ajuda />} />

            {/* Se digitar rota doida, volta pro dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}