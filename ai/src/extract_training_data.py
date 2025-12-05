import pandas as pd
import os
import gc

# ================= CONFIGURAÇÃO =================
MIMIC_PATH = r"C:\Users\Usuario\Documents\progamacao\DATA_RAW\mimic-iv-3.1"
OUTPUT_FILE = "dados_treino_anesth_full.csv"

# IDs dos Exames (Labevents)
LAB_IDS = {
    51222: 'hemoglobina',
    51221: 'hematocrito',
    51265: 'plaquetas',
    50931: 'glicemia',
    50912: 'creatinina',
    50971: 'potassio',
    50983: 'sodio'
}

# Prefixos ICD (Comorbidades)
ICD_MAPPING = {
    'hipertensao': ['I10', '401'],
    'diabetes':    ['E11', '250'],
    'asma':        ['J45', '493'],
    'dpoc':        ['J44', '496'],
    'tabagismo':   ['F17', '3051'],
    'alcoolismo':  ['F10', '303']
}

def get_path(module, filename):
    return os.path.join(MIMIC_PATH, module, filename)

def run_full_extraction():
    print("--- INICIANDO EXTRAÇÃO AVANÇADA (COM PESO/ALTURA REAIS) ---")

    # 1. PACIENTES
    print("\n[1/4] Carregando Pacientes...")
    df = pd.read_csv(get_path('hosp', 'patients.csv.gz'), usecols=['subject_id', 'gender', 'anchor_age'])
    df = df.rename(columns={'gender': 'sexo', 'anchor_age': 'idade'})

    # 2. COMORBIDADES
    print("\n[2/4] Mapeando Comorbidades...")
    path_diag = get_path('hosp', 'diagnoses_icd.csv.gz')
    
    for col in ICD_MAPPING.keys():
        df[col] = 0
    
    found_conditions = {k: set() for k in ICD_MAPPING.keys()}

    for chunk in pd.read_csv(path_diag, chunksize=500000, usecols=['subject_id', 'icd_code']):
        chunk['icd_code'] = chunk['icd_code'].astype(str)
        for condition, codes in ICD_MAPPING.items():
            mask = chunk['icd_code'].str.startswith(tuple(codes), na=False)
            found_conditions[condition].update(chunk.loc[mask, 'subject_id'].unique())
    
    for condition, ids in found_conditions.items():
        df[condition] = df['subject_id'].isin(ids).astype(int)

    del found_conditions
    gc.collect()

    # 3. LABORATORIO
    print("\n[3/4] Extraindo Exames...")
    path_labs = get_path('hosp', 'labevents.csv.gz')
    lab_data_map = {} # { subject_id: { 'hemoglobina': 12.0 } }

    try:
        for chunk in pd.read_csv(path_labs, chunksize=1000000, usecols=['subject_id', 'itemid', 'valuenum']):
            relevant_rows = chunk[chunk['itemid'].isin(LAB_IDS.keys())]
            if not relevant_rows.empty:
                for row in relevant_rows.itertuples(index=False):
                    if pd.isna(row.valuenum): continue
                    
                    col_name = LAB_IDS[row.itemid]
                    if row.subject_id not in lab_data_map:
                        lab_data_map[row.subject_id] = {}
                    
                    # Sobrescreve (pega o último lido do chunk)
                    lab_data_map[row.subject_id][col_name] = row.valuenum
    except FileNotFoundError:
        print("[ERRO] labevents não encontrado.")

    for col_name in LAB_IDS.values():
        df[col_name] = df['subject_id'].map(lambda x: lab_data_map.get(x, {}).get(col_name, None))

    del lab_data_map
    gc.collect()

    # 4. SINAIS VITAIS + PESO + ALTURA (A GRANDE MUDANÇA)
    print("\n[4/4] Buscando Pressão, Peso e Altura (Lendo chartevents)...")
    path_chart = get_path('icu', 'chartevents.csv.gz')
    
    # NOVOS IDs ADICIONADOS:
    # 226512 = Admission Weight (Kg)
    # 226730 = Height (cm)
    TARGET_ITEMS = [220179, 220050, 220045, 226512, 226730]
    
    vitals_map = {} 

    chunk_count = 0
    try:
        for chunk in pd.read_csv(path_chart, chunksize=1000000, usecols=['subject_id', 'itemid', 'valuenum']):
            chunk_count += 1
            print(f"   > Processando lote {chunk_count}...", end='\r')
            
            relevant = chunk[chunk['itemid'].isin(TARGET_ITEMS)]
            
            if not relevant.empty:
                for row in relevant.itertuples(index=False):
                    if pd.isna(row.valuenum): continue
                    if row.valuenum <= 0: continue # Ignora valores negativos ou zero

                    sid = row.subject_id
                    item = row.itemid
                    val = row.valuenum
                    
                    if sid not in vitals_map: vitals_map[sid] = {}
                    
                    # Mapeamento
                    if item == 220045:
                        vitals_map[sid]['fc'] = val
                    elif item == 226512:
                        vitals_map[sid]['peso'] = val
                    elif item == 226730:
                        vitals_map[sid]['altura'] = val
                    elif item in [220179, 220050]:
                        if 'paSistolica' not in vitals_map[sid]: # Prioriza o primeiro que achar
                            vitals_map[sid]['paSistolica'] = val

    except FileNotFoundError:
        print("\n[ERRO] chartevents não encontrado.")

    print("\n   > Consolidando vitais e antropometria...")
    df['paSistolica'] = df['subject_id'].map(lambda x: vitals_map.get(x, {}).get('paSistolica', None))
    df['fc'] = df['subject_id'].map(lambda x: vitals_map.get(x, {}).get('fc', None))
    df['peso'] = df['subject_id'].map(lambda x: vitals_map.get(x, {}).get('peso', None))
    df['altura'] = df['subject_id'].map(lambda x: vitals_map.get(x, {}).get('altura', None))

    # 5. FINALIZAÇÃO E LIMPEZA
    print("\n--- LIMPEZA FINAL ---")
    
    # Remove quem não tem o alvo (Pressão)
    df = df.dropna(subset=['paSistolica'])
    
    # Remove quem não tem peso OU altura (pois sem isso o IMC quebra)
    # Se quiser ser menos rígido, pode remover essa linha e usar média depois
    df_com_peso = df.dropna(subset=['peso', 'altura'])
    
    print(f"Total inicial: {len(df)} -> Com Peso/Altura reais: {len(df_com_peso)}")
    
    # Se sobrar muito pouco paciente (ex: < 5000), a gente usa a média nos que faltaram
    # Mas vamos tentar salvar o dataset de elite primeiro
    if len(df_com_peso) > 10000:
        print("Temos dados suficientes! Salvando apenas registros completos.")
        df_final = df_com_peso
    else:
        print("Muitos dados de peso faltando. Mantendo todos e preenchendo vazios com média.")
        df_final = df
        # (O preenchimento acontecerá no script de treino)

    df_final.to_csv(OUTPUT_FILE, index=False)
    print(f"Salvo em: {OUTPUT_FILE}")

if __name__ == "__main__":
    run_full_extraction()