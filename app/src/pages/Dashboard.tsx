import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

type PredictionItem = {
  id: string;
  pacienteNome: string;
  createdAt: string; // ISO
  summary: string;
  risks: Record<string, number>;
};

function loadPredictionsFromStorage(): PredictionItem[] {
  try {
    const raw = localStorage.getItem("predictions");
    if (!raw) return [];
    return JSON.parse(raw) as PredictionItem[];
  } catch {
    return [];
  }
}

export default function Dashboard({ user }: { user: string }) {
  const navigate = useNavigate();
  const [predictions, setPredictions] = useState<PredictionItem[]>([]);
  const [todayCount, setTodayCount] = useState(0);

  useEffect(() => {
    const data = loadPredictionsFromStorage();
    // sort desc by date
    data.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    setPredictions(data);

    // count today's
    const today = new Date().toISOString().slice(0, 10);
    const count = data.filter(p => p.createdAt.slice(0, 10) === today).length;
    setTodayCount(count);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    // opcional: não remover previsões, apenas logout
    navigate("/");
  };

  const last = predictions[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-bold text-blue-600">AnesthPredict</div>
          <div className="text-sm text-gray-500">Dashboard</div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700">Usuário: <span className="font-medium">{user}</span></div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="p-6">
        {/* Quick actions */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold">Visão Geral</h2>
            <div className="flex gap-3">
              <Link to="/paciente" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Nova Previsão
              </Link>
              <Link to="/historico" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
                Histórico
              </Link>
            </div>
          </div>
        </section>

        {/* Summary cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Previsões hoje</div>
            <div className="text-2xl font-bold">{todayCount}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Total de previsões</div>
            <div className="text-2xl font-bold">{predictions.length}</div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-sm text-gray-500">Última previsão</div>
            <div className="text-base">
              {last ? (
                <>
                  <div className="font-medium">{last.pacienteNome}</div>
                  <div className="text-xs text-gray-500">{new Date(last.createdAt).toLocaleString()}</div>
                </>
              ) : (
                <div className="text-sm text-gray-500">Nenhuma previsão</div>
              )}
            </div>
          </div>
        </section>

        {/* Recent predictions list */}
        <section className="mb-6">
          <h3 className="text-lg font-medium mb-3">Previsões recentes</h3>

          <div className="space-y-3">
            {predictions.length === 0 && (
              <div className="text-gray-500">Ainda não há previsões. Clique em "Nova Previsão".</div>
            )}

            {predictions.slice(0, 6).map((p) => (
              <div key={p.id} className="bg-white p-3 rounded-lg shadow flex justify-between items-start">
                <div>
                  <div className="font-medium">{p.pacienteNome}</div>
                  <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</div>
                  <div className="text-sm text-gray-700 mt-1">{p.summary}</div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <button
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => navigate(`/historico`)}
                  >
                    Abrir
                  </button>
                  <button
                    className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => {
                      // placeholder: aqui você pode chamar geração de PDF ou reprocessar
                      alert("Geração de PDF (placeholder)");
                    }}
                  >
                    Exportar PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Placeholder for future charts or alerts */}
        <section>
          <h3 className="text-lg font-medium mb-3">Alertas / Observações</h3>
          <div className="bg-white p-4 rounded-lg shadow text-gray-600">
            Espaço para alertas do sistema, notas rápidas do residente ou resumo estatístico do modelo.
          </div>
        </section>
      </main>
    </div>
  );
}
