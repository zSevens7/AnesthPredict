import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, roc_auc_score
from xgboost import XGBClassifier
from imblearn.over_sampling import SMOTE # O segredo do sucesso

# ================= CONFIGURAÇÃO =================
CSV_PATH = "dados_treino_anesth_full.csv"
MODEL_PATH = "models/hypo_model.pkl"

def train_xgboost_final():
    print("--- TREINAMENTO DEFINITIVO (XGBOOST + SMOTE) ---")
    
    # 1. Carregar
    if not os.path.exists(CSV_PATH):
        print("Erro: CSV não encontrado. Rode o extract_training_data.py primeiro.")
        return

    df = pd.read_csv(CSV_PATH)
    
    # 2. Engenharia de Features
    # Tratando Sexo
    df['sexo'] = df['sexo'].map({'M': 0, 'F': 1}).fillna(0)
    
    # Calculando IMC (Garantindo que existe)
    # Proteção contra divisão por zero
    df = df[df['altura'] > 0]
    df['imc'] = df['peso'] / ((df['altura'] / 100) ** 2)
    
    # Definindo Alvo
    df['target'] = (df['paSistolica'] < 100).astype(int)
    
    features = [
        'idade', 'sexo', 'peso', 'altura', 'imc',
        'hipertensao', 'diabetes', 'asma', 'dpoc', 'tabagismo', 'alcoolismo',
        'hemoglobina', 'creatinina', 'potassio', 'sodio', 'fc'
    ]
    
    # Limpeza básica (XGBoost lida bem com vazios, mas o SMOTE não, então precisamos preencher)
    for col in features:
        if col in df.columns:
            df[col] = df[col].fillna(df[col].mean())
            
    X = df[features]
    y = df['target']

    # 3. Divisão e Balanceamento
    # Separamos o teste ANTES de aplicar o SMOTE (Regra de Ouro)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"   > Distribuição Original (Treino): {y_train.value_counts().to_dict()}")
    
    # Aplicar SMOTE apenas no treino
    smote = SMOTE(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train, y_train)
    
    print(f"   > Distribuição Balanceada (Pós-SMOTE): {y_train_res.value_counts().to_dict()}")

    # 4. Treinamento XGBoost
    print("3. Treinando XGBoost...")
    
    # Configuração robusta
    model = XGBClassifier(
        n_estimators=300,        # Mais árvores
        learning_rate=0.05,      # Aprendizado suave
        max_depth=6,             # Profundidade média (evita decorar demais)
        subsample=0.8,           # Usa 80% dos dados por árvore (evita overfitting)
        colsample_bytree=0.8,    # Usa 80% das colunas por árvore
        eval_metric='logloss',
        use_label_encoder=False,
        random_state=42
        # Nota: Não precisamos de scale_pos_weight pois o SMOTE já equilibrou 50/50
    )
    
    model.fit(X_train_res, y_train_res)
    
    # 5. Avaliação Honesta (No dataset de teste real, desbalanceado)
    print("4. Avaliando performance...")
    preds = model.predict(X_test)
    probs = model.predict_proba(X_test)[:, 1]
    
    acc = accuracy_score(y_test, preds)
    auc = roc_auc_score(y_test, probs)
    
    print(f"   > Acurácia: {acc:.2%}")
    print(f"   > AUC-ROC: {auc:.3f}")
    print("\nRelatório Final:")
    print(classification_report(y_test, preds))
    
    # 6. Salvar
    artifact = {
        'model': model,
        'columns': features
        # Nota: XGBoost não precisa de scaler! Menos arquivos pra gerenciar.
    }
    
    if not os.path.exists('models'):
        os.makedirs('models')
        
    joblib.dump(artifact, MODEL_PATH)
    print(f"\n--- MODELO XGBOOST PRONTO EM: {MODEL_PATH} ---")

if __name__ == "__main__":
    train_xgboost_final()