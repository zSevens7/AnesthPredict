import pandas as pd
import os

# ==============================================================================
# CONFIGURAÇÃO - APONTE PARA ONDE VOCÊ BAIXOU/DESCOMPACTOU A PASTA RAIZ
# Exemplo: Se extraiu em Downloads, deve ter uma pasta 'mimic-iv-3.1'
# ==============================================================================
MIMIC_ROOT = "C:/Users/SEU_USUARIO/Downloads/mimic-iv-3.1" 

def get_path(module, filename):
    return os.path.join(MIMIC_ROOT, module, filename)

def run_extraction():
    print("1. Carregando dados base (Pacientes)...")
    # Patients é pequeno, dá pra ler direto
    patients = pd.read_csv(get_path('hosp', 'patients.csv.gz'), usecols=['subject_id', 'gender', 'anchor_age'])
    
    # Renomeando para bater com seu api.py
    patients = patients.rename(columns={'gender': 'sex', 'anchor_age': 'age'})
    
    print(f"   > Encontrados {len(patients)} pacientes.")

    # ---------------------------------------------------------
    # 2. Processando Hipertensão (Diagnósticos) - Arquivo Médio
    # ---------------------------------------------------------
    print("2. Buscando histórico de Hipertensão...")
    diagnoses_path = get_path('hosp', 'diagnoses_icd.csv.gz')
    
    # Vamos ler apenas as colunas necessárias para economizar RAM
    # Códigos de hipertensão começam geralmente com 401 (ICD9) ou I10 (ICD10)
    hypertensive_subjects = set()
    
    # Chunksize: lê de 100 em 100 mil linhas
    for chunk in pd.read_csv(diagnoses_path, chunksize=100000, usecols=['subject_id', 'icd_code', 'icd_version']):
        # Filtra quem tem hipertensão no chunk
        mask = chunk['icd_code'].str.startswith(('I10', '401'), na=False)
        subjects = chunk.loc[mask, 'subject_id'].unique()
        hypertensive_subjects.update(subjects)
        
    # Adiciona coluna no dataframe principal (1 se tiver na lista, 0 se não)
    patients['hypertension'] = patients['subject_id'].isin(hypertensive_subjects).astype(int)
    print("   > Diagnósticos processados.")

    # ---------------------------------------------------------
    # 3. Processando Pressão Arterial (Sinais Vitais) - ARQUIVO GIGANTE
    # ---------------------------------------------------------
    print("3. Extraindo Pressão Arterial Inicial (Isso pode demorar um pouco)...")
    chartevents_path = get_path('icu', 'chartevents.csv.gz')
    
    # Dicionário para guardar a primeira medição de cada paciente: {subject_id: valor}
    bp_data = {}
    
    # ITEMID 220179 = Non Invasive Blood Pressure systolic
    # Ler em chunks maiores para agilizar, se tiver 16GB de RAM, pode aumentar o chunk
    chunk_n = 0
    try:
        for chunk in pd.read_csv(chartevents_path, chunksize=1000000, usecols=['subject_id', 'itemid', 'valuenum', 'charttime']):
            chunk_n += 1
            # Filtra só pressão sistólica
            systolic = chunk[chunk['itemid'] == 220179]
            
            if not systolic.empty:
                # Ordena por tempo
                systolic = systolic.sort_values('charttime')
                
                # Para cada paciente nesse chunk
                for subject, group in systolic.groupby('subject_id'):
                    # Se a gente ainda não tem medição pra esse paciente, pega a primeira desse chunk
                    if subject not in bp_data:
                        bp_data[subject] = group.iloc[0]['valuenum']
            
            print(f"   > Processando parte {chunk_n} do arquivo gigante...", end='\r')
            
            # (Opcional) Para teste rápido, descomente abaixo para parar após 50 chunks
            # if chunk_n > 50: break 
            
    except FileNotFoundError:
        print("\n   [AVISO] Arquivo chartevents não encontrado. Verifique se baixou a pasta 'icu'.")
    
    # Transforma o dicionário em DataFrame e junta
    df_bp = pd.DataFrame(list(bp_data.items()), columns=['subject_id', 'baseline_systolic'])
    final_df = pd.merge(patients, df_bp, on='subject_id', how='left')
    
    # ---------------------------------------------------------
    # 4. Limpeza e Salvamento
    # ---------------------------------------------------------
    print("\n4. Finalizando dataset...")
    
    # Preenche quem não tem pressão medida com média (ou 120)
    final_df['baseline_systolic'] = final_df['baseline_systolic'].fillna(120)
    
    # Dados faltantes simulados (Peso/Altura precisam vir da tabela OMR, simplifiquei aqui)
    final_df['weight'] = 75.0
    final_df['height'] = 170.0
    final_df['bmi'] = 25.0
    final_df['meds_antihypertensive'] = 0
    final_df['previous_hypotension'] = 0
    
    # Filtra apenas quem tem dados reais de pressão (opcional, ou mantem todos)
    # final_df = final_df.dropna(subset=['baseline_systolic'])
    
    output_file = 'training_data.csv'
    final_df.to_csv(output_file, index=False)
    print(f"\nSUCESSO! Arquivo '{output_file}' criado com {len(final_df)} linhas.")
    print("Agora você pode rodar o script de treinamento.")

if __name__ == "__main__":
    run_extraction()