// src/components/wizard/PassoLaboratorio.tsx

import type { LaboratorioDados } from "../../types/PacienteTypes";

interface Props {
  data: LaboratorioDados;
  setData: (valor: Partial<LaboratorioDados>) => void;
}

export default function PassoLaboratorio({ data, setData }: Props) {
  const fields = [
    { key: "hemoglobina", label: "Hemoglobina" },
    { key: "hematocrito", label: "Hematócrito" },
    { key: "plaquetas", label: "Plaquetas" },
    { key: "glicemia", label: "Glicemia" },
    { key: "creatinina", label: "Creatinina" },
    { key: "potassio", label: "Potássio" },
    { key: "sodio", label: "Sódio" },
  ] as const;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Exames Laboratoriais</h2>

      {fields.map((f) => (
        <input
          key={f.key}
          type="number"
          className="w-full p-2 border rounded"
          placeholder={f.label}
          value={data[f.key] ?? ""}
          onChange={(e) => {
            const value = e.target.value === "" ? "" : Number(e.target.value);
            setData({ [f.key]: value });
          }}
        />
      ))}
    </div>
  );
}
