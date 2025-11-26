// src/components/wizard/PassoRevisao.tsx

import type { PacienteCompleto } from "../../types/PacienteTypes";

interface Props {
  data: PacienteCompleto;
}

export default function PassoRevisao({ data }: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Revisão Final dos Dados</h2>

      {/* SEÇÃO: Paciente */}
      <RevisaoCard titulo="Dados do Paciente" dados={data.paciente} />

      {/* SEÇÃO: Comorbidades */}
      <RevisaoCard titulo="Comorbidades" dados={data.comorbidades} />

      {/* SEÇÃO: Sinais Vitais */}
      <RevisaoCard titulo="Sinais Vitais" dados={data.sinaisVitais} />

      {/* SEÇÃO: Laboratório */}
      <RevisaoCard titulo="Exames Laboratoriais" dados={data.laboratorio} />

      {/* SEÇÃO: Cirurgia */}
      <RevisaoCard titulo="Cirurgia" dados={data.cirurgia} />

      {/* SEÇÃO: Anestesia */}
      <RevisaoCard titulo="Anestesia" dados={data.anestesia} />

      <p className="text-gray-600 text-sm">
        Verifique se todas as informações estão corretas antes de finalizar.
      </p>
    </div>
  );
}

/* Componente reutilizável */
function RevisaoCard({
  titulo,
  dados,
}: {
  titulo: string;
  dados: Record<string, any>;
}) {
  return (
    <div className="border p-4 rounded bg-gray-50 space-y-2">
      <h3 className="font-semibold text-lg">{titulo}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
        {Object.entries(dados).map(([campo, valor]) => (
          <div key={campo} className="flex justify-between">
            <span className="font-medium capitalize">{formatarCampo(campo)}:</span>
            <span className="text-gray-700">{valor !== "" ? String(valor) : "--"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatarCampo(campo: string) {
  return campo
    .replace(/([A-Z])/g, " $1") // camelCase → camel Case
    .replace(/^\w/, (c) => c.toUpperCase()); // primeira letra maiúscula
}
