# Roadmap — AnesthPredict 1.0

## ✔ Etapa 1 — Estrutura básica do projeto (CONCLUÍDA)
- Criar repositório
- Definição da stack (Python/React)
- Configuração do ambiente virtual (`venv`)

## ✔ Etapa 2 — Backend & IA (Python + FastAPI) (CONCLUÍDA)
- **Extração de Dados:** Script `extract_training_data.py` processando MIMIC-IV (37k+ pacientes com Peso/Altura reais).
- **Treinamento:** Script `train_final.py` utilizando **XGBoost + SMOTE** (Balanceamento).
- **Modelo:** Geração do arquivo `hypo_model.pkl`.
- **API:** Servidor `api.py` com FastAPI rodando, validando dados (Pydantic) e calculando IMC.
- **Segurança:** Configuração de CORS para comunicação local.

## ✔ Etapa 3 — Frontend (React + Vite) (CONCLUÍDA)
- **Wizard de Cadastro:** Formulário em 7 passos (Dados, Comorbidades, Sinais Vitais, etc).
- **Dashboard:** Visão geral com estatísticas e lista recente.
- **Histórico:** Lista completa com indicadores visuais de risco (Badges coloridas).
- **Detalhes (Prontuário):** Página de relatório completo com dados médicos originais salvos.
- **Ajuda:** Página explicativa sobre o modelo e guia de uso.
- **Persistência:** Sistema CRUD completo usando `localStorage` (Salvar, Ler, Excluir).

## ✔ Etapa 4 — Integração & Fluxo (CONCLUÍDA)
- Conexão Frontend ↔ Backend (Axios/Fetch).
- Tratamento de erros (Backend desligado, falha na previsão).
- Cálculo automático de IMC e inferência em tempo real.

## ⏳ Etapa 5 — Empacotamento Desktop (Electron) (EM ANDAMENTO)
- [✔] Configuração do `electron.js` (Janela 1920x1080).
- [✔] Congelamento do Backend (`pyinstaller` gerando `backend.exe`).
- [✔] Estruturação de pastas (Backend movido para `resources/`, site na raiz).
- [✔] Configuração de Scripts (`npm run electron`).
- [ ] Teste final do executável `.exe` (Build de Produção).

## 🔒 Etapa 6 — Melhorias Futuras (V2.0)
- Geração de PDF nativo (atualmente usamos `window.print` na tela de Detalhes).
- Substituir `localStorage` por Banco de Dados local (SQLite) para maior segurança.
- Login real com autenticação (atualmente é simulação local).
- Modo Escuro (Dark Mode).

## 🎯 Status Atual
- [✔] Etapa 1 (Estrutura)
- [✔] Etapa 2 (Cérebro - Python/IA)
- [✔] Etapa 3 (Corpo - React)
- [✔] Etapa 4 (Conexão)
- [⏳] Etapa 5 (Transformar em .exe) ← **VOCÊ ESTÁ AQUI**
- [🔒] Etapa 6 (Polimento Final)