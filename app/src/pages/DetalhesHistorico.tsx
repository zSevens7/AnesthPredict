import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { PacienteCompleto } from "../types/PacienteTypes";

interface HistoricoItem {
  id: number;
  nome: string;
  data: string;
  risco: string;
  probabilidade: number;
  mensagem: string;
  dados_medicos: PacienteCompleto; // Os dados salvos no Passo 1
}

export default function DetalhesHistorico() {
  const { id } = useParams(); // Pega o ID da URL (ex: /historico/172391...)
  const navigate = useNavigate();
  const [registro, setRegistro] = useState<HistoricoItem | null>(null);

  useEffect(() => {
    // Busca no localStorage pelo ID
    const saved = localStorage.getItem("historico_pacientes");
    if (saved && id) {
      const lista: HistoricoItem[] = JSON.parse(saved);
      // O ID na URL é string, o salvo é number, por isso convertemos
      const encontrado = lista.find((item) => item.id === Number(id));
      
      if (encontrado) {
        setRegistro(encontrado);
      } else {
        alert("Registro não encontrado.");
        navigate("/historico");
      }
    }
  }, [id, navigate]);

  if (!registro) return <div className="p-10 text-center">Carregando prontuário...</div>;

  const d = registro.dados_medicos; // Atalho para digitar menos

  // Define cor do cabeçalho baseado no risco
  const getCorHeader = (risco: string) => {
    if (risco === 'Alto') return 'bg-red-600';
    if (risco === 'Moderado') return 'bg-yellow-500';
    return 'bg-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* NAVEGAÇÃO */}
        <Link to="/historico" className="text-blue-600 hover:underline text-sm font-medium">
          &larr; Voltar para Histórico
        </Link>

        {/* CARTÃO PRINCIPAL */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          
          {/* CABEÇALHO COLORIDO */}
          <div className={`${getCorHeader(registro.risco)} p-6 text-white flex justify-between items-center`}>
            <div>
              <h1 className="text-2xl font-bold">{registro.nome}</h1>
              <p className="opacity-90 text-sm">Avaliado em: {registro.data}</p>
              <p className="opacity-75 text-xs font-mono mt-1">ID: {registro.id}</p>
            </div>
            <div className="text-right bg-white/20 p-3 rounded-lg backdrop-blur-sm">
              <p className="text-sm font-medium uppercase tracking-wider">Risco Previsto</p>
              <p className="text-3xl font-extrabold">{registro.risco}</p>
              <p className="text-sm">{registro.probabilidade}% de probabilidade</p>
            </div>
          </div>

          {/* MENSAGEM DA IA */}
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <h3 className="text-blue-800 font-bold mb-1">🤖 Análise da IA:</h3>
            <p className="text-blue-900 italic">"{registro.mensagem}"</p>
          </div>

          {/* GRID DE DADOS MÉDICOS */}
          <div className="p-8 grid md:grid-cols-2 gap-8">
            
            {/* COLUNA 1: DADOS GERAIS */}
            <div className="space-y-6">
              <section>
                <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-3 border-b pb-1">Perfil do Paciente</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-600">Idade:</span>
                  <span className="font-semibold">{d.paciente.idade} anos</span>
                  
                  <span className="text-gray-600">Sexo:</span>
                  <span className="font-semibold">{d.paciente.sexo === 'M' ? 'Masculino' : 'Feminino'}</span>
                  
                  <span className="text-gray-600">Peso / Altura:</span>
                  <span className="font-semibold">{d.paciente.peso}kg / {d.paciente.altura}cm</span>
                </div>
              </section>

              <section>
                <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-3 border-b pb-1">Comorbidades</h3>
                <div className="flex flex-wrap gap-2">
                  {d.comorbidades.hipertensao && <Badge label="Hipertensão" color="red" />}
                  {d.comorbidades.diabetes && <Badge label="Diabetes" color="red" />}
                  {d.comorbidades.asma && <Badge label="Asma" color="orange" />}
                  {d.comorbidades.dpoc && <Badge label="DPOC" color="orange" />}
                  {d.comorbidades.tabagismo && <Badge label="Tabagismo" color="gray" />}
                  {d.comorbidades.alcoolismo && <Badge label="Etilismo" color="gray" />}
                  
                  {!d.comorbidades.hipertensao && !d.comorbidades.diabetes && !d.comorbidades.asma && 
                   !d.comorbidades.dpoc && !d.comorbidades.tabagismo && !d.comorbidades.alcoolismo && (
                    <span className="text-sm text-gray-400 italic">Nenhuma comorbidade relatada.</span>
                   )}
                </div>
              </section>
            </div>

            {/* COLUNA 2: CLÍNICA */}
            <div className="space-y-6">
              <section>
                <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-3 border-b pb-1">Sinais Vitais Basais</h3>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <span className="text-gray-600">Frequência Cardíaca:</span>
                  <span className="font-semibold">{d.sinaisVitais.fc || "-"} bpm</span>
                  <span className="text-gray-600">PA Sistólica:</span>
                  <span className="font-semibold">{d.sinaisVitais.paSistolica || "-"} mmHg</span>
                </div>
              </section>

              <section>
                <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider mb-3 border-b pb-1">Laboratório</h3>
                <ul className="text-sm space-y-1">
                  <LabItem label="Hemoglobina" value={d.laboratorio.hemoglobina} unit="g/dL" />
                  <LabItem label="Creatinina" value={d.laboratorio.creatinina} unit="mg/dL" />
                  <LabItem label="Potássio" value={d.laboratorio.potassio} unit="mEq/L" />
                  <LabItem label="Sódio" value={d.laboratorio.sodio} unit="mEq/L" />
                </ul>
              </section>
            </div>
          </div>

          {/* RODAPÉ DO CARD */}
          <div className="bg-gray-50 p-4 border-t text-center">
            <button 
              onClick={() => window.print()} 
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-white transition text-sm font-medium"
            >
              🖨️ Imprimir Relatório / Salvar PDF
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// Pequenos componentes visuais (Badges)
const Badge = ({ label, color }: { label: string, color: string }) => {
  const styles: any = {
    red: "bg-red-100 text-red-700",
    orange: "bg-orange-100 text-orange-700",
    gray: "bg-gray-100 text-gray-700",
  };
  return <span className={`${styles[color] || styles.gray} px-2 py-1 rounded text-xs font-bold mr-1`}>{label}</span>;
};

const LabItem = ({ label, value, unit }: any) => (
  <li className="flex justify-between border-b border-gray-100 py-1 last:border-0">
    <span className="text-gray-600">{label}:</span>
    <span className="font-medium text-gray-900">{value ? `${value} ${unit}` : <span className="text-gray-300">-</span>}</span>
  </li>
);