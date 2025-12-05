import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Definindo o tipo do histórico
interface HistoricoItem {
  id: number;
  nome: string;
  data: string;
  risco: 'Alto' | 'Moderado' | 'Baixo';
  probabilidade: number;
}

// Definindo as Props que o componente aceita (CORREÇÃO DO ERRO)
interface DashboardProps {
  user?: string; // O ? torna opcional, mas vamos aceitar se vier
}

// Recebendo o 'user' via props, com um valor padrão caso não venha nada
export default function Dashboard({ user = "Dr. Residente" }: DashboardProps) {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<HistoricoItem[]>([]);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("historico_pacientes");
      if (raw) {
        const data: HistoricoItem[] = JSON.parse(raw);
        
        // Ordena pelo ID (que é o timestamp) decrescente
        data.sort((a, b) => b.id - a.id);
        setPredictions(data);

        // Conta os de hoje
        const hoje = new Date().toLocaleDateString();
        const count = data.filter(p => p.data === hoje).length;
        setTodayCount(count);
      }
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Se você usa isso para login
    navigate("/"); 
  };

  const last = predictions[0];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* HEADER */}
      <header className="flex items-center justify-between p-4 bg-white shadow-sm border-b">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-blue-700 tracking-tight">AnesthPredict</div>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">Dashboard</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600 hidden sm:block">
            Olá, <span className="font-semibold text-gray-900">{user}</span>
          </div>
          
          <Link 
            to="/ajuda" 
            className="text-sm px-3 py-1 text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition"
          >
            ? Ajuda
          </Link>

          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition text-sm font-medium"
          >
            Sair
          </button>
        </div>
      </header>
      
      {/* ... O RESTO DO CÓDIGO PERMANECE IGUAL AO ANTERIOR ... */}
      
      <main className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* ACTION BAR */}
        <section className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Visão Geral</h2>
            <p className="text-sm text-gray-500">Gerencie suas avaliações pré-anestésicas</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link 
              to="/novo-paciente" 
              className="flex-1 sm:flex-none text-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition font-medium"
            >
              + Nova Previsão
            </Link>
            <Link 
              to="/historico" 
              className="flex-1 sm:flex-none text-center px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Ver Histórico
            </Link>
          </div>
        </section>

        {/* STATS CARDS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Avaliações Hoje</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{todayCount}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Acumulado</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{predictions.length}</p>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl shadow-sm border border-blue-100">
            <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">Último Paciente</p>
            {last ? (
              <div className="mt-2">
                <p className="text-xl font-bold text-gray-900 truncate">{last.nome}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                    last.risco === 'Alto' ? 'bg-red-200 text-red-800' :
                    last.risco === 'Moderado' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {last.risco}
                  </span>
                  <span className="text-sm text-gray-500">{last.probabilidade}%</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400 mt-2 italic">Nenhum registro</p>
            )}
          </div>
        </section>

        {/* LISTA RECENTE */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-bold text-gray-800">Recentes</h3>
            {predictions.length > 5 && (
              <Link to="/historico" className="text-sm text-blue-600 hover:underline">Ver todos</Link>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {predictions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Sua lista está vazia. Comece uma nova previsão acima.
              </div>
            ) : (
              <div className="divide-y">
                {predictions.slice(0, 5).map((p) => (
                  <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div>
                      <p className="font-semibold text-gray-900">{p.nome}</p>
                      <p className="text-xs text-gray-500">{p.data}</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                       <div className={`px-3 py-1 rounded-full text-sm font-bold w-24 text-center ${
                          p.risco === 'Alto' ? 'bg-red-100 text-red-700' :
                          p.risco === 'Moderado' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {p.risco}
                        </div>
                        <Link 
                          to={`/historico`} 
                          className="text-gray-400 hover:text-blue-600"
                        >
                          →
                        </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}