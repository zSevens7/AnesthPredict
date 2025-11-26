import type { CirurgiaDados } from "../../types/PacienteTypes";

interface Props {
  data: CirurgiaDados;
  setData: (valor: Partial<CirurgiaDados>) => void;
}

export default function PassoCirurgia({ data, setData }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Detalhes da Cirurgia</h2>

      {/* Tipo da cirurgia */}
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Tipo da cirurgia"
        value={data.tipoCirurgia || ""}
        onChange={(e) => setData({ tipoCirurgia: e.target.value })}
      />

      {/* Urgência */}
      <select
        className="w-full p-2 border rounded"
        value={data.urgencia || ""}
        onChange={(e) => setData({ urgencia: e.target.value })}
      >
        <option value="">Urgência</option>
        <option value="eletiva">Eletiva</option>
        <option value="urgencia">Urgência</option>
        <option value="emergencia">Emergência</option>
      </select>

      {/* Duração prevista */}
      <input
        type="number"
        className="w-full p-2 border rounded"
        placeholder="Duração prevista (min)"
        value={data.duracaoPrevista ?? ""}
        onChange={(e) => {
          const v = e.target.value === "" ? "" : Number(e.target.value);
          setData({ duracaoPrevista: v });
        }}
      />
    </div>
  );
}
