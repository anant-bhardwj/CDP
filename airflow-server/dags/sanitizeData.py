from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.providers.google.cloud.operators.bigquery import BigQueryInsertJobOperator
from airflow.utils.dates import days_ago
import pandas as pd
from google.cloud import bigquery
from google.oauth2 import service_account
import os
default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
}
dag = DAG(
    'bigquery_etl_pipeline',
    default_args=default_args,
    description='ETL pipeline for cleaning data and loading into BigQuery',
    schedule_interval=None,
    start_date=days_ago(1),
)

def extract_data(**kwargs):
    df = pd.read_csv('/opt/airflow/dags/data/bquxjob_3b57dea0_192a6909532.csv') #name of table to read
    return df.to_json()

def clean_data(**kwargs):
    ti = kwargs['ti']
    df_json = ti.xcom_pull(task_ids='extract_data')
    df = pd.read_json(df_json)
    
    def clean_column_names(df):
        df.columns = df.columns.str.replace(r'\W', '_', regex=True)
        df.columns = df.columns.str.strip()
        df.columns = df.columns.str.lower()
        return df

    def handle_duplicate_columns(df):
        seen = {}
        new_columns = []
        for col in df.columns:
            if col in seen:
                seen[col] += 1
                new_columns.append(f"{col}_{seen[col]}")
            else:
                seen[col] = 0
                new_columns.append(col)
        df.columns = new_columns
        return df

    df = clean_column_names(df)
    df = handle_duplicate_columns(df)

    df.fillna('', inplace=True)
    df.drop_duplicates(inplace=True)

    #what name to give to the cleaned table
    cleaned_data_path = '/opt/airflow/dags/data/cleaned_data_1.csv'
    df.to_csv(cleaned_data_path, index=False)
    
    ti.xcom_push(key='cleaned_data_path', value=cleaned_data_path)

def load_to_bigquery(**kwargs):
    ti = kwargs['ti']
    cleaned_data_path = ti.xcom_pull(key='cleaned_data_path', task_ids='clean_data')

    credentials = service_account.Credentials.from_service_account_file(
        "/opt/airflow/dags/data/cdp1-439017-b441da520659.json",
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )

    client = bigquery.Client(
        credentials=credentials,
        project=credentials.project_id
    )

    #name of the table to be saved
    table_id = "cdp1-439017.user_1_dataset.djs_airflow_table_1"

    job_config = bigquery.LoadJobConfig(
        autodetect=True,
        skip_leading_rows=1,
        source_format=bigquery.SourceFormat.CSV,
    )

    with open(cleaned_data_path, "rb") as source_file:
        job = client.load_table_from_file(source_file, table_id, job_config=job_config)

    job.result()

    print(f"Loaded {job.output_rows} rows into {table_id}.")

extract_task = PythonOperator(
    task_id='extract_data',
    python_callable=extract_data,
    dag=dag,
)

clean_task = PythonOperator(
    task_id='clean_data',
    python_callable=clean_data,
    provide_context=True,
    dag=dag,
)

load_task = PythonOperator(
    task_id='load_to_bigquery',
    python_callable=load_to_bigquery,
    provide_context=True,
    dag=dag,
)

extract_task >> clean_task >> load_task