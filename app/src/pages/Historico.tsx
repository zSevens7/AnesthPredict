import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Interface que define o que salvamos no localStorage lá no PassoRevisao
interface HistoricoItem {
  id: number;
  nome: string;
  data: string;
  risco: 'Alto' | 'Moderado' | 'Baixo';
  probabilidade: number;
  detalhes: any; // O objeto completo do paciente está aqui dentro
}

export default function Historico() {
  const [lista, setLista] = useState<HistoricoItem[]>([]);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = () => {
    const saved = localStorage.getItem("historico_pacientes");
    if (saved) {
      try {
        // Ordena do mais recente para o mais antigo (reverse)
        const parsed = JSON.parse(saved).reverse();
        setLista(parsed);
      } catch (e) {
        console.error("Erro ao ler histórico", e);
      }
    }
  };

  // --- NOVA FUNÇÃO DE EXCLUIR ---
  const handleExcluir = (idParaExcluir: number) => {
    if (window.confirm("Tem certeza que deseja excluir este paciente do histórico?")) {
      
      // 1. Remove da lista visual
      const novaLista = lista.filter(item => item.id !== idParaExcluir);
      setLista(novaLista);

      // 2. Remove do localStorage (precisa inverter a lógica pois lá salvamos appendando no final)
      // O jeito mais seguro é pegar a nova lista, reverter ela (para ficar na ordem original de salvamento) e salvar
      const listaParaSalvar = [...novaLista].reverse(); 
      localStorage.setItem("historico_pacientes", JSON.stringify(listaParaSalvar));
    }
  };

  // Função para decidir a cor da "etiqueta" de risco
  const getCorRisco = (risco: string) => {
    switch (risco) {
      case 'Alto': return 'bg-red-100 text-red-800 border-red-200';
      case 'Moderado': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Histórico de Previsões</h1>
        <Link to="/novo-paciente" className="text-blue-600 hover:underline">
          + Novo Paciente
        </Link>
      </div>

      {lista.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed">
          <p className="text-gray-500">Nenhum paciente foi avaliado ainda.</p>
        </div>
      )}

      <div className="grid gap-4">
        {lista.map((item) => (
          <div
            key={item.id}
            className="p-4 border rounded-lg shadow-sm bg-white flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-shadow gap-4"
          >
            {/* Lado Esquerdo: Dados do Paciente */}
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-lg text-gray-800">
                  {item.nome}
                </h2>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {item.data}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                ID: {item.id}
              </p>
            </div>

            {/* Centro: O Resultado da IA */}
            <div className="flex-1 sm:text-right flex flex-col sm:items-end items-start gap-1">
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getCorRisco(item.risco)}`}>
                Risco {item.risco}
              </span>
              <span className="text-xs text-gray-600 font-medium">
                Probabilidade: {item.probabilidade}%
              </span>
            </div>

            {/* Lado Direito: Ações (Botões) */}
            <div className="flex items-center gap-2 sm:ml-4 sm:pl-4 sm:border-l border-gray-100 pt-2 sm:pt-0 border-t sm:border-t-0 w-full sm:w-auto justify-end">
              
              <Link
                to={`/historico/${item.id}`} 
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Detalhes
              </Link>

              {/* BOTÃO EXCLUIR */}
              <button
                onClick={() => handleExcluir(item.id)}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition"
                title="Excluir do histórico"
              >
                🗑️
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}