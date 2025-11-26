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

import Passo1Paciente from "../components/wizard/PassoDados";
import Passo2Comorbidades from "../components/wizard/PassoComorbidades";
import Passo3SinaisVitais from "../components/wizard/PassoSinaisVitais";
import Passo4Laboratorio from "../components/wizard/PassoLaboratorio";
import Passo5Cirurgia from "../components/wizard/PassoCirurgia";
import Passo6Anestesia from "../components/wizard/PassoAnestesia";
import PassoRevisao from "../components/wizard/PassoRevisao";

export default function PacienteForm() {
  const [passo, setPasso] = useState(1);
  const navigate = useNavigate();

  const [dados, setDados] = useState<PacienteCompleto>({
    paciente: {} as PacienteDados,
    comorbidades: {} as ComorbidadesDados,
    sinaisVitais: {} as SinaisVitaisDados,
    laboratorio: {} as LaboratorioDados,
    cirurgia: {} as CirurgiaDados,
    anestesia: {} as AnestesiaDados,
  });

  const finalizarCadastro = () => {
    console.log("Dados do paciente:", dados);
    // opcional: salvar no localStorage
    // localStorage.setItem("ultimoPaciente", JSON.stringify(dados));
    navigate("/dashboard");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Cadastro do Paciente</h1>

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

      {/* BOTÕES */}
      <div className="flex justify-between pt-4">
        {passo > 1 ? (
          <button
            onClick={() => setPasso(passo - 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Voltar
          </button>
        ) : (
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Voltar ao Dashboard
          </button>
        )}

        {passo < 7 ? (
          <button
            onClick={() => setPasso(passo + 1)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Próximo
          </button>
        ) : (
          <button
            onClick={finalizarCadastro}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Finalizar
          </button>
        )}
      </div>
    </div>
  );
}
