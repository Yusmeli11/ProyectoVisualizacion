import pandas as pd
import numpy as np
import json

# Cargar y analizar los datos de fertilidad
url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/API_SP.DYN.TFRT.IN_DS2_EN_csv_v2_37712-ntT0a2JFFLF2E6SNJTDb92RrFOCfSr.csv"

try:
    df = pd.read_csv(url)
    print("Dataset cargado exitosamente!")
    print(f"Dimensiones: {df.shape}")
    print("\nPrimeras 5 filas:")
    print(df.head())
    print("\nColumnas:")
    print(df.columns.tolist())
    print("\nInformación del dataset:")
    print(df.info())
    
    # Analizar datos faltantes
    print("\nDatos faltantes por columna:")
    missing_data = df.isnull().sum()
    print(missing_data[missing_data > 0])
    
    # Analizar países únicos
    if 'Country Name' in df.columns:
        print(f"\nNúmero de países: {df['Country Name'].nunique()}")
        print("Algunos países:")
        print(df['Country Name'].unique()[:10])
    
    # Analizar años disponibles
    year_columns = [col for col in df.columns if col.isdigit()]
    if year_columns:
        print(f"\nAños disponibles: {min(year_columns)} - {max(year_columns)}")
        print(f"Total de años: {len(year_columns)}")
    
    # Preparar datos para visualización
    # Filtrar países principales y limpiar datos
    countries_to_focus = [
        'World', 'United States', 'China', 'India', 'Germany', 'Japan', 
        'Brazil', 'Nigeria', 'Bangladesh', 'Pakistan', 'Indonesia',
        'Russian Federation', 'Mexico', 'Iran, Islamic Rep.', 'Turkey',
        'Vietnam', 'Philippines', 'Ethiopia', 'Egypt, Arab Rep.', 'South Africa'
    ]
    
    # Crear dataset limpio para visualización
    viz_data = []
    
    for _, row in df.iterrows():
        country = row['Country Name']
        country_code = row.get('Country Code', '')
        
        for year in year_columns:
            value = row[year]
            if pd.notna(value) and value != '':
                viz_data.append({
                    'country': country,
                    'country_code': country_code,
                    'year': int(year),
                    'fertility_rate': float(value),
                    'is_focus_country': country in countries_to_focus
                })
    
    # Convertir a DataFrame y guardar estadísticas
    viz_df = pd.DataFrame(viz_data)
    
    print(f"\nDatos procesados: {len(viz_df)} registros")
    print(f"Rango de años con datos: {viz_df['year'].min()} - {viz_df['year'].max()}")
    print(f"Rango de tasas de fertilidad: {viz_df['fertility_rate'].min():.2f} - {viz_df['fertility_rate'].max():.2f}")
    
    # Estadísticas por década
    viz_df['decade'] = (viz_df['year'] // 10) * 10
    decade_stats = viz_df.groupby('decade')['fertility_rate'].agg(['mean', 'std', 'count']).round(2)
    print("\nEstadísticas por década:")
    print(decade_stats)
    
    # Países con mayor cambio
    country_trends = viz_df.groupby('country').agg({
        'fertility_rate': ['first', 'last', 'mean'],
        'year': ['min', 'max']
    }).round(2)
    
    country_trends.columns = ['first_rate', 'last_rate', 'avg_rate', 'first_year', 'last_year']
    country_trends['change'] = country_trends['last_rate'] - country_trends['first_rate']
    country_trends['years_span'] = country_trends['last_year'] - country_trends['first_year']
    
    # Filtrar países con datos suficientes
    country_trends = country_trends[country_trends['years_span'] >= 20]
    
    print("\nPaíses con mayor descenso en fertilidad:")
    print(country_trends.nsmallest(10, 'change')[['first_rate', 'last_rate', 'change']])
    
    print("\nPaíses con mayor aumento en fertilidad:")
    print(country_trends.nlargest(10, 'change')[['first_rate', 'last_rate', 'change']])
    
    # Guardar datos procesados como JSON para D3.js
    # Datos globales por año
    world_data = viz_df[viz_df['country'] == 'World'].sort_values('year')
    world_json = world_data[['year', 'fertility_rate']].to_dict('records')
    
    # Datos de países principales
    focus_countries_data = viz_df[viz_df['is_focus_country'] & (viz_df['country'] != 'World')]
    countries_json = []
    
    for country in countries_to_focus[1:]:  # Excluir 'World'
        country_data = focus_countries_data[focus_countries_data['country'] == country].sort_values('year')
        if len(country_data) > 0:
            countries_json.append({
                'country': country,
                'data': country_data[['year', 'fertility_rate']].to_dict('records')
            })
    
    # Datos para mapa (últimos datos disponibles por país)
    latest_year = viz_df['year'].max()
    map_data = viz_df[viz_df['year'] == latest_year].copy()
    map_json = map_data[['country', 'country_code', 'fertility_rate']].to_dict('records')
    
    print(f"\nDatos preparados para visualización:")
    print(f"- Datos mundiales: {len(world_json)} puntos")
    print(f"- Países principales: {len(countries_json)} países")
    print(f"- Datos para mapa: {len(map_json)} países")
    
    # Guardar en archivos JSON
    with open('public/data/world_fertility.json', 'w') as f:
        json.dump(world_json, f)
    
    with open('public/data/countries_fertility.json', 'w') as f:
        json.dump(countries_json, f)
    
    with open('public/data/map_fertility.json', 'w') as f:
        json.dump(map_json, f)
    
    print("\nArchivos JSON guardados exitosamente!")
    
except Exception as e:
    print(f"Error al procesar los datos: {e}")
