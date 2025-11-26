// src/components/wizard/PassoComorbidades.tsx
import type { ComorbidadesDados } from "../../types/PacienteTypes";

interface Props {
  data: ComorbidadesDados;
  setData: (valor: Partial<ComorbidadesDados>) => void;
}

export default function PassoComorbidades({ data, setData }: Props) {
  const toggle = (field: keyof ComorbidadesDados) => {
    setData({ [field]: !data[field] });
  };

  const campos = [
    { label: "Hipertensão", field: "hipertensao" },
    { label: "Diabetes", field: "diabetes" },
    { label: "Asma", field: "asma" },
    { label: "DPOC", field: "dpoc" },
    { label: "Tabagismo", field: "tabagismo" },
    { label: "Alcoolismo", field: "alcoolismo" },
  ] as const;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Comorbidades</h2>

      {/* Checkboxes */}
      {campos.map((c) => (
        <label key={c.field} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={data[c.field] || false}
            onChange={() => toggle(c.field)}
          />
          {c.label}
        </label>
      ))}

      {/* Alergias */}
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Alergias (opcional)"
        value={data.alergias || ""}
        onChange={(e) => setData({ alergias: e.target.value })}
      />

      {/* Outras comorbidades */}
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Outras comorbidades relevantes"
        value={data.outrasComorbidades || ""}
        onChange={(e) => setData({ outrasComorbidades: e.target.value })}
      />
    </div>
  );
}
