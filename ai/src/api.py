from fastapi import FastAPI
from pydantic import BaseModel
from pydantic_settings import BaseSettings
from dotenv import load_dotenv
import os
import joblib
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# Carrega variáveis
load_dotenv()

class Settings(BaseSettings):
    app_host: str = os.getenv("APP_HOST", "127.0.0.1")
    app_port: int = int(os.getenv("APP_PORT", 8000))
    model_path: str = os.getenv("MODEL_PATH", "models/hypo_model.pkl")

settings = Settings()
app = FastAPI(title="AnesthPredict IA Service")


# --- ADICIONE ISSO AQUI ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Libera para qualquer site (útil em dev)
    allow_credentials=True,
    allow_methods=["*"],  # Libera POST, GET, etc.
    allow_headers=["*"],
)
# --------------------------

# Globais
model = None
model_columns = None

# Carga do Modelo
if os.path.exists(settings.model_path):
    try:
        artifact = joblib.load(settings.model_path)
        if isinstance(artifact, dict) and 'model' in artifact:
            model = artifact['model']
            model_columns = artifact.get('columns', [])
            print("✅ Modelo XGBoost carregado com sucesso!")
        else:
            print("❌ Formato inválido.")
    except Exception as e:
        print(f"❌ Erro ao carregar: {e}")
else:
    print("⚠️ Modelo não encontrado.")

class PatientInput(BaseModel):
    idade: int
    sexo: str
    peso: float
    altura: float
    # Comorbidades
    hipertensao: bool = False
    diabetes: bool = False
    asma: bool = False
    dpoc: bool = False
    tabagismo: bool = False
    alcoolismo: bool = False
    # Exames
    hemoglobina: float = None
    creatinina: float = None
    potassio: float = None
    sodio: float = None
    fc: float = None

@app.post("/predict/hypotension")
def predict(p: PatientInput):
    if not model:
        return {"error": "Modelo offline"}

    # 1. Processar Entrada
    d = p.dict()
    
    # Cálculos
    altura_m = d['altura'] / 100.0
    # Evita divisão por zero
    imc = d['peso'] / (altura_m ** 2) if altura_m > 0 else 0
    sexo_n = 1 if d['sexo'].upper() == 'F' else 0
    
    # Montar DataFrame
    raw = {
        'idade': d['idade'],
        'sexo': sexo_n,
        'peso': d['peso'],
        'altura': d['altura'],
        'imc': imc,
        'hipertensao': int(d['hipertensao']),
        'diabetes': int(d['diabetes']),
        'asma': int(d['asma']),
        'dpoc': int(d['dpoc']),
        'tabagismo': int(d['tabagismo']),
        'alcoolismo': int(d['alcoolismo']),
        'hemoglobina': d['hemoglobina'],
        'creatinina': d['creatinina'],
        'potassio': d['potassio'],
        'sodio': d['sodio'],
        'fc': d['fc']
    }
    
    df = pd.DataFrame([raw])
    
    # 2. Alinhar Colunas
    if model_columns:
        df = df.reindex(columns=model_columns)
        # Preencher exames vazios com valores neutros para não quebrar o XGBoost
        defaults = {'hemoglobina': 12, 'creatinina': 1, 'potassio': 4, 'sodio': 140, 'fc': 75}
        df = df.fillna(defaults).fillna(0)

    # 3. Previsão
    prob = float(model.predict_proba(df)[:, 1][0])
    
    # Lógica de Negócio (Thresholds)
    if prob > 0.65:
        risk = "Alto"
        msg = "Forte indício de instabilidade."
    elif prob > 0.40:
        risk = "Moderado"
        msg = "Monitorar indução com cautela."
    else:
        risk = "Baixo"
        msg = "Paciente estável no modelo."

    return {
        "risco": risk,
        "probabilidade": round(prob * 100, 1),
        "mensagem": msg,
        "dados_calculados": {"imc": round(imc, 2)}
    }