// ------------------------------
// DADOS BÁSICOS
// ------------------------------
export interface PacienteDados {
  nome: string;
  idade: number | "";
  sexo: string;
  peso?: number | "";
  altura?: number | "";
}

// ------------------------------
// COMORBIDADES
// ------------------------------
export interface ComorbidadesDados {
  hipertensao?: boolean;
  diabetes?: boolean;
  asma?: boolean;
  dpoc?: boolean;
  tabagismo?: boolean;
  alcoolismo?: boolean;

  alergias?: string;
  outrasComorbidades?: string;
}

// ------------------------------
// SINAIS VITAIS
// ------------------------------
export interface SinaisVitaisDados {
  paSistolica?: number | "";
  paDiastolica?: number | "";
  fc?: number | "";
  fr?: number | "";
  temperatura?: number | "";
  spo2?: number | "";
}

// ------------------------------
// LABORATÓRIO
// ------------------------------
export interface LaboratorioDados {
  hemoglobina?: number | "";
  hematocrito?: number | "";
  plaquetas?: number | "";
  glicemia?: number | "";
  creatinina?: number | "";
  potassio?: number | "";
  sodio?: number | "";
}

// ------------------------------
// CIRURGIA
// ------------------------------
export interface CirurgiaDados {
  tipoCirurgia?: string;
  duracaoPrevista?: number | "";
  urgencia?: string;
  riscoASA?: string;
}

// ------------------------------
// ANESTESIA
// ------------------------------
export interface AnestesiaDados {
  tipoAnestesia?: string;
  obsAnestesia?: string;
}


// ------------------------------
// OBJETO COMPLETO
// ------------------------------
export interface PacienteCompleto {
  paciente: PacienteDados;
  comorbidades: ComorbidadesDados;
  sinaisVitais: SinaisVitaisDados;
  laboratorio: LaboratorioDados;
  cirurgia: CirurgiaDados;
  anestesia: AnestesiaDados;
}
