# Roadmap — AnesthPredict

## ✔ Etapa 1 — Estrutura básica do projeto (CONCLUÍDA)
- Criar repositório
- Criar pastas `app/`, `backend/`, `docs/`
- Criar README básico
- Criar `.gitignore`

## ✔ Etapa 2 — Backend mínimo (Node.js + Express) (CONCLUÍDA)
- Inicializar o backend (`npm init`)
- Instalar dependências (`express`, `cors`)
- Criar `server.js`
- Endpoint inicial funcionando (`/`)
- Backend rodando em: http://localhost:3000

## ✔ Etapa 3 — App Desktop (React + Vite → depois Electron) (CONCLUÍDA)
- Tela de login simples (mock)
- Dashboard do anestesista (mock, sem dados reais)
- Formulário de paciente funcional
- Histórico de previsões mock
- **Observação:** Etapa considerada concluída apenas do ponto de vista funcional do front-end. O design final do dashboard e histórico só faz sentido quando tivermos dados reais da IA/backend.

## 🔄 Etapa 4 — IA (Prototipagem do Modelo)
- Criar notebook `docs/model-prototype.ipynb`
- Baixar dataset público de anestesia
- Treinar modelo inicial (RandomForest / XGBoost)
- Exportar o modelo (`model.pkl`)
- Criar mini servidor Python local para integrar com Node
  - Recebe dados clínicos e retorna previsão

## 🔄 Etapa 5 — Integração Backend ⇄ IA
- Criar endpoint `/predict`  
  - Recebe dados do paciente  
  - Chama servidor Python  
  - Retorna previsão para frontend
- Criar endpoint `/generate-report`  
  - Gera relatório em PDF com dados + previsão

## 🔄 Etapa 6 — Geração de PDF local
- Criar serviço `/utils/pdfService.js`
- Template com:
  - Nome do paciente
  - Parâmetros inseridos
  - Resultado da IA
  - Risco/alertas em destaque
  - Recomendação automática
- Exportar para PDF local

## 🔄 Etapa 7 — Build final do App Desktop
- Empacotar Electron
- Criar executáveis:
  - Windows (.exe)
  - Mac (.app)

## 🎯 Status Atual
[✔] Etapa 1  
[✔] Etapa 2  
[✔] Etapa 3 ← front-end funcional, design final depende da IA e dados  
[ ] Etapa 4  
[ ] Etapa 5  
[ ] Etapa 6  
[ ] Etapa 7
