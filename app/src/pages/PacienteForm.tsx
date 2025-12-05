import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
  PacienteCompleto,
  PacienteDados,
  ComorbidadesDados,
  SinaisVitaisDados,
  LaboratorioDados,
  CirurgiaDados,
  AnestesiaDados,
} from "../types/PacienteTypes";

// IMPORTANTE: Importar o serviço que conecta com o Python
import { predictHypotension } from "../services/predictionService"; 

import Passo1Paciente from "../components/wizard/PassoDados";
import Passo2Comorbidades from "../components/wizard/PassoComorbidades";
import Passo3SinaisVitais from "../components/wizard/PassoSinaisVitais";
import Passo4Laboratorio from "../components/wizard/PassoLaboratorio";
import Passo5Cirurgia from "../components/wizard/PassoCirurgia";
import Passo6Anestesia from "../components/wizard/PassoAnestesia";
import PassoRevisao from "../components/wizard/PassoRevisao";

export default function PacienteForm() {
  const [passo, setPasso] = useState(1);
  const [loading, setLoading] = useState(false); // Para desabilitar botão enquanto calcula
  const navigate = useNavigate();

  const [dados, setDados] = useState<PacienteCompleto>({
    paciente: {} as PacienteDados,
    comorbidades: {} as ComorbidadesDados,
    sinaisVitais: {} as SinaisVitaisDados,
    laboratorio: {} as LaboratorioDados,
    cirurgia: {} as CirurgiaDados,
    anestesia: {} as AnestesiaDados,
  });

  // --- FUNÇÃO FINALIZAR CORRIGIDA ---
  const finalizarCadastro = async () => {
    setLoading(true); // Trava o botão
    try {
      console.log("Enviando para IA...", dados);
      
      // 1. Chama o Python
      const resultadoIA = await predictHypotension(dados);

      // 2. Cria o registro para o histórico
      const novoRegistro = {
        id: Date.now(),
        nome: dados.paciente.nome || "Paciente Sem Nome",
        data: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString(), // Adicionei hora pra ficar melhor
        risco: resultadoIA.risco,
        probabilidade: resultadoIA.probabilidade, 
        mensagem: resultadoIA.mensagem, // Salva a mensagem da IA
        
        // --- O PULO DO GATO ESTÁ AQUI EMBAIXO ---
        // Salvamos os dados originais para poder ver na página de Detalhes depois
        dados_medicos: dados 
        // ---------------------------------------
      };

      // 3. Salva no Banco de Dados do Navegador (LocalStorage)
      const historicoAntigo = JSON.parse(localStorage.getItem('historico_pacientes') || '[]');
      historicoAntigo.push(novoRegistro);
      localStorage.setItem('historico_pacientes', JSON.stringify(historicoAntigo));

      // 4. Feedback para o usuário
      alert(`Análise Concluída!\n\nRisco: ${resultadoIA.risco}\nProbabilidade: ${resultadoIA.probabilidade}%\n\nMensagem: ${resultadoIA.mensagem}`);

      // 5. Vai para o Dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao conectar com a IA. Verifique se o terminal do Python está aberto.");
    } finally {
      setLoading(false); // Destrava o botão
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Cadastro do Paciente</h1>

      {/* Renderização condicional dos passos */}
      {passo === 1 && (
        <Passo1Paciente
          data={dados.paciente}
          setData={(valor: Partial<PacienteDados>) =>
            setDados((prev) => ({ ...prev, paciente: { ...prev.paciente, ...valor } }))
          }
        />
      )}
      {passo === 2 && (
        <Passo2Comorbidades
          data={dados.comorbidades}
          setData={(valor: Partial<ComorbidadesDados>) =>
            setDados((prev) => ({ ...prev, comorbidades: { ...prev.comorbidades, ...valor } }))
          }
        />
      )}
      {passo === 3 && (
        <Passo3SinaisVitais
          data={dados.sinaisVitais}
          setData={(valor: Partial<SinaisVitaisDados>) =>
            setDados((prev) => ({ ...prev, sinaisVitais: { ...prev.sinaisVitais, ...valor } }))
          }
        />
      )}
      {passo === 4 && (
        <Passo4Laboratorio
          data={dados.laboratorio}
          setData={(valor: Partial<LaboratorioDados>) =>
            setDados((prev) => ({ ...prev, laboratorio: { ...prev.laboratorio, ...valor } }))
          }
        />
      )}
      {passo === 5 && (
        <Passo5Cirurgia
          data={dados.cirurgia}
          setData={(valor: Partial<CirurgiaDados>) =>
            setDados((prev) => ({ ...prev, cirurgia: { ...prev.cirurgia, ...valor } }))
          }
        />
      )}
      {passo === 6 && (
        <Passo6Anestesia
          data={dados.anestesia}
          setData={(valor: Partial<AnestesiaDados>) =>
            setDados((prev) => ({ ...prev, anestesia: { ...prev.anestesia, ...valor } }))
          }
        />
      )}
      {passo === 7 && <PassoRevisao data={dados} />}

      {/* BOTÕES DE NAVEGAÇÃO */}
      <div className="flex justify-between pt-4">
        {passo > 1 ? (
          <button
            onClick={() => setPasso(passo - 1)}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Voltar
          </button>
        ) : (
          <button
            onClick={() => navigate("/dashboard")}
            disabled={loading}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Cancelar
          </button>
        )}

        {passo < 7 ? (
          <button
            onClick={() => setPasso(passo + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Próximo
          </button>
        ) : (
          <button
            onClick={finalizarCadastro}
            disabled={loading}
            className={`px-4 py-2 text-white rounded flex items-center gap-2 ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {loading ? "Calculando com IA..." : "Finalizar e Calcular"}
          </button>
        )}
      </div>
    </div>
  );
}