// IMPORTAR TIPOS
import type { AnestesiaDados } from "../../types/PacienteTypes";

interface Props {
  data: AnestesiaDados;
  setData: (valor: Partial<AnestesiaDados>) => void;
}

export default function PassoAnestesia({ data, setData }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Plano Anestésico</h2>

      <select
        className="w-full p-2 border rounded"
        value={data.tipoAnestesia || ""}
        onChange={(e) => setData({ tipoAnestesia: e.target.value })}
      >
        <option value="">Selecione o tipo de anestesia</option>
        <option value="geral">Anestesia Geral</option>
        <option value="raqui">Raquidiana</option>
        <option value="peridural">Peridural</option>
        <option value="peridural-combinada">Combinada Raqui + Peri</option>
        <option value="sedacao">Sedação</option>
      </select>

      <textarea
        className="w-full p-2 border rounded"
        rows={4}
        placeholder="Observações / detalhes da técnica"
        value={data.obsAnestesia || ""}
        onChange={(e) => setData({ obsAnestesia: e.target.value })}
      />
    </div>
  );
}
