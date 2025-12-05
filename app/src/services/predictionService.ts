// src/services/predictionService.ts
import type { PacienteCompleto } from '../types/PacienteTypes';

const API_URL = 'http://127.0.0.1:8000';

export interface PredictionResponse {
  risco: 'Baixo' | 'Moderado' | 'Alto';
  probabilidade: number;
  mensagem: string;
  dados_calculados: {
    imc: number;
  };
}

export const predictHypotension = async (dados: PacienteCompleto): Promise<PredictionResponse> => {
  
  // 1. O "Adapter": Transforma seus objetos aninhados no JSON plano que o Python quer
  // Convertendo booleanos para inteiros (0 ou 1) e tratando vazios
  const payload = {
    idade: Number(dados.paciente.idade) || 0,
    sexo: dados.paciente.sexo, // "M" ou "F"
    peso: Number(dados.paciente.peso) || 0,
    altura: Number(dados.paciente.altura) || 0,
    
    // Comorbidades (Boolean -> Int)
    hipertensao: dados.comorbidades.hipertensao ? 1 : 0,
    diabetes: dados.comorbidades.diabetes ? 1 : 0,
    asma: dados.comorbidades.asma ? 1 : 0,
    dpoc: dados.comorbidades.dpoc ? 1 : 0,
    tabagismo: dados.comorbidades.tabagismo ? 1 : 0,
    alcoolismo: dados.comorbidades.alcoolismo ? 1 : 0,
    
    // Exames (Se string vazia, manda null ou 0)
    hemoglobina: Number(dados.laboratorio.hemoglobina) || 0,
    creatinina: Number(dados.laboratorio.creatinina) || 0,
    potassio: Number(dados.laboratorio.potassio) || 0,
    sodio: Number(dados.laboratorio.sodio) || 0,
    fc: Number(dados.sinaisVitais.fc) || 0
  };

  try {
    const response = await fetch(`${API_URL}/predict/hypotension`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.statusText}`);
    }

    const result: PredictionResponse = await response.json();
    return result;
    
  } catch (error) {
    console.error("Erro ao conectar com a IA:", error);
    throw error;
  }
};