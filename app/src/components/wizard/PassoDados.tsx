import type { PacienteDados } from "../../types/PacienteTypes";

interface Props {
  data: PacienteDados;
  setData: (valor: Partial<PacienteDados>) => void;
}

export default function PassoDados({ data, setData }: Props) {
  return (
    <div className="space-y-4">
      <input
        className="w-full border p-2"
        placeholder="Nome do paciente"
        value={data.nome || ""}
        onChange={(e) => setData({ nome: e.target.value })}
      />

      <input
        className="w-full border p-2"
        placeholder="Idade"
        value={data.idade || ""}
        onChange={(e) =>
          setData({ idade: e.target.value === "" ? "" : Number(e.target.value) })
        }
      />

      <input
        className="w-full border p-2"
        placeholder="Sexo"
        value={data.sexo || ""}
        onChange={(e) => setData({ sexo: e.target.value })}
      />
    </div>
  );
}
