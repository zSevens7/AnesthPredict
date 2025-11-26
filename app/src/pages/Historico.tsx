// src/pages/Historico.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { PacienteCompleto } from "../types/PacienteTypes";

export default function Historico() {
  const [lista, setLista] = useState<PacienteCompleto[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("historicoPacientes");
    if (saved) {
      setLista(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Histórico de Pacientes</h1>

      {lista.length === 0 && (
        <p className="text-gray-500">Nenhum paciente foi cadastrado ainda.</p>
      )}

      {lista.map((p, index) => (
        <div
          key={index}
          className="p-4 border rounded shadow-sm bg-white flex justify-between"
        >
          <div>
            <h2 className="font-semibold text-lg">
              {p.paciente.nome || "Paciente sem nome"}
            </h2>
            <p className="text-sm text-gray-600">
              Idade: {p.paciente.idade ?? "-"} | Peso: {p.paciente.peso ?? "-"} kg
            </p>
          </div>

          {/* Botão futuro para ver detalhes */}
          <Link
            to={`/historico/${index}`}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Ver
          </Link>
        </div>
      ))}
    </div>
  );
}
