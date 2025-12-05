import { Link } from "react-router-dom";

export default function Ajuda() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* HEADER SIMPLES */}
      <header className="bg-white border-b p-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-blue-700">AnesthPredict</h1>
            <span className="text-gray-400">|</span>
            <span className="text-sm font-medium text-gray-600">Central de Ajuda</span>
          </div>
          <Link 
            to="/dashboard" 
            className="text-sm text-blue-600 hover:underline font-medium"
          >
            ← Voltar ao Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* INTRODUÇÃO */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Como usar o preditor?</h2>
          <p className="text-gray-600 leading-relaxed">
            O <strong>AnesthPredict</strong> é uma ferramenta de suporte à decisão clínica baseada em Inteligência Artificial. 
            Ele utiliza dados pré-operatórios para estimar a probabilidade de <strong>Hipotensão Arterial</strong> (PAS &lt; 100 mmHg) 
            durante o procedimento cirúrgico.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* GUIA DE DADOS */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 w-6 h-6 flex items-center justify-center rounded-full text-xs">1</span>
              Dados Críticos
            </h3>
            <div className="bg-white p-5 rounded-lg border shadow-sm space-y-3">
              <p className="text-sm text-gray-600">
                Para garantir a precisão do algoritmo (XGBoost), atenção especial aos campos:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                <li>
                  <strong>Peso e Altura:</strong> Obrigatórios. O sistema calcula o <strong>IMC</strong> automaticamente, que é um forte preditor de risco.
                </li>
                <li>
                  <strong>Comorbidades:</strong> Hipertensão e Diabetes são os fatores de maior peso no modelo.
                </li>
                <li>
                  <strong>Exames:</strong> Se não houver dados recentes, o sistema assume valores fisiológicos padrão (ex: Creatinina 1.0), mas isso reduz a personalização do risco.
                </li>
              </ul>
            </div>
          </section>

          {/* INTERPRETAÇÃO */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="bg-green-100 text-green-700 w-6 h-6 flex items-center justify-center rounded-full text-xs">2</span>
              Interpretando o Risco
            </h3>
            <div className="bg-white p-5 rounded-lg border shadow-sm space-y-4">
              
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 mt-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Risco Baixo (&lt; 40%)</p>
                  <p className="text-xs text-gray-500">Monitoramento padrão. Baixa probabilidade de instabilidade hemodinâmica grave.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-3 h-3 mt-1.5 rounded-full bg-yellow-500 flex-shrink-0"></div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Risco Moderado (40% - 65%)</p>
                  <p className="text-xs text-gray-500">Requer atenção na indução. Considerar titulação mais lenta de hipnóticos.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-3 h-3 mt-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Risco Alto (&gt; 65%)</p>
                  <p className="text-xs text-gray-500">Alta probabilidade de evento. Preparar vasopressores e considerar monitorização invasiva (PAI).</p>
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* DETALHES TÉCNICOS (O diferencial pro TCC) */}
        <section className="bg-gray-100 p-6 rounded-xl border border-gray-200 mt-8">
          <h3 className="text-md font-bold text-gray-800 mb-2">Nota Técnica & Disclaimer</h3>
          <p className="text-sm text-gray-600 mb-2">
            Este modelo foi treinado com <strong>37.040 pacientes</strong> reais do banco de dados <strong>MIMIC-IV (MIT)</strong>. 
            Foi utilizada a técnica de balanceamento <strong>SMOTE</strong> e o algoritmo <strong>XGBoost</strong> para maximizar a detecção de casos críticos.
          </p>
          <p className="text-xs text-gray-500 italic border-t border-gray-300 pt-2 mt-2">
            ⚠️ <strong>Aviso Legal:</strong> Esta aplicação é um protótipo acadêmico (MVP). 
            Os resultados são estatísticos e <strong>não substituem</strong> o julgamento clínico do anestesiologista. 
            Não utilize como única base para condutas médicas.
          </p>
        </section>

      </main>
    </div>
  );
}