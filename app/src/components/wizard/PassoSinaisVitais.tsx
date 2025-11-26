// src/components/wizard/PassoSinaisVitais.tsx

import type { SinaisVitaisDados } from "../../types/PacienteTypes";

interface Props {
  data: SinaisVitaisDados;
  setData: (valor: Partial<SinaisVitaisDados>) => void;
}

export default function PassoSinaisVitais({ data, setData }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Sinais Vitais</h2>

      <input
        type="number"
        className="w-full p-2 border rounded"
        placeholder="Pressão Sistólica"
        value={data.paSistolica ?? ""}
        onChange={(e) => setData({ paSistolica: Number(e.target.value) })}
      />

      <input
        type="number"
        className="w-full p-2 border rounded"
        placeholder="Pressão Diastólica"
        value={data.paDiastolica ?? ""}
        onChange={(e) => setData({ paDiastolica: Number(e.target.value) })}
      />

      <input
        type="number"
        className="w-full p-2 border rounded"
        placeholder="Frequência Cardíaca (FC)"
        value={data.fc ?? ""}
        onChange={(e) => setData({ fc: Number(e.target.value) })}
      />

      <input
        type="number"
        className="w-full p-2 border rounded"
        placeholder="Frequência Respiratória (FR)"
        value={data.fr ?? ""}
        onChange={(e) => setData({ fr: Number(e.target.value) })}
      />

      <input
        type="number"
        className="w-full p-2 border rounded"
        placeholder="Temperatura (°C)"
        value={data.temperatura ?? ""}
        onChange={(e) => setData({ temperatura: Number(e.target.value) })}
      />

      <input
        type="number"
        className="w-full p-2 border rounded"
        placeholder="SpO2 (%)"
        value={data.spo2 ?? ""}
        onChange={(e) => setData({ spo2: Number(e.target.value) })}
      />
    </div>
  );
}
