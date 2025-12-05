import type { PacienteDados } from "../../types/PacienteTypes";

interface Props {
  data: PacienteDados;
  setData: (valor: Partial<PacienteDados>) => void;
}

export default function PassoDados({ data, setData }: Props) {
  return (
    <div className="space-y-4">
      {/* NOME */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
        <input
          className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: João da Silva"
          value={data.nome || ""}
          onChange={(e) => setData({ nome: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* IDADE */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Idade</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Anos"
            value={data.idade || ""}
            onChange={(e) =>
              setData({ idade: e.target.value === "" ? "" : Number(e.target.value) })
            }
          />
        </div>

        {/* SEXO (Melhor usar Select para padronizar) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Sexo</label>
          <select
            className="w-full border p-2 rounded bg-white"
            value={data.sexo || ""}
            onChange={(e) => setData({ sexo: e.target.value })}
          >
            <option value="">Selecione...</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* PESO (Importante para o IMC) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Ex: 80.5"
            value={data.peso || ""}
            onChange={(e) =>
              setData({ peso: e.target.value === "" ? "" : Number(e.target.value) })
            }
          />
        </div>

        {/* ALTURA (Importante para o IMC) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Altura (cm)</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Ex: 175"
            value={data.altura || ""}
            onChange={(e) =>
              setData({ altura: e.target.value === "" ? "" : Number(e.target.value) })
            }
          />
        </div>
      </div>
    </div>
  );
}