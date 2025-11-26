# Arquitetura do AnesthPredict

O projeto consiste em duas partes principais:

1. **Aplicação Desktop (app)**  
   - Desenvolvida com Electron + React  
   - Interface para inserir dados do paciente  
   - Consome a API local em Python  
   - Gera e exporta relatórios

2. **Backend local (backend)**  
   - Desenvolvido em Python  
   - Roda IA e modelos preditivos  
   - Funciona totalmente offline  
   - Expõe endpoints (FastAPI)

A comunicação será feita via `http://localhost:5000/`.
