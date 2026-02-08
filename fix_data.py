import json
import random
from datetime import datetime, timedelta

# Lista de locaciones
locations = [
    # (Dept, Prov, Dist, Lat, Lon, Weight)
    ("LIMA", "LIMA", "CERCADO DE LIMA", -12.0464, -77.0428, 0.4),
    ("LIMA", "LIMA", "SANTIAGO DE SURCO", -12.12, -76.99, 0.3),
    ("LIMA", "LIMA", "MIRAFLORES", -12.11, -77.03, 0.3),
    ("LIMA", "HUARAL", "HUARAL", -11.49, -77.21, 0.1),
    
    ("LORETO", "MAYNAS", "IQUITOS", -3.7491, -73.2539, 0.05),
    ("LORETO", "MAYNAS", "PUNCHANA", -3.71, -73.23, 0.05),
    
    ("PIURA", "PIURA", "PIURA", -5.19, -80.63, 0.05),
    ("UCAYALI", "CORONEL PORTILLO", "PUCALLPA", -8.38, -74.55, 0.05),
    ("LA LIBERTAD", "TRUJILLO", "TRUJILLO", -8.11, -79.03, 0.05),
]

types = ["Sintomático", "Sospechoso", "Confirmado"]
states = ["Confirmado", "En investigación", "Recuperado", "Fallecido"]
sources = {"Sintomático": "SIVAPRE", "Sospechoso": "NOTI", "Confirmado": "NETLAB"}

data = []

def get_location():
    r = random.random()
    if r < 0.7: 
        return random.choice([l for l in locations if l[0] == "LIMA"])
    else:
        return random.choice([l for l in locations if l[0] != "LIMA"])

for i in range(1, 1400):
    loc = get_location()
    t = random.choice(types)
    source = sources[t]
    date = datetime(2026, 2, 6) - timedelta(days=random.randint(0, 30))
    
    
    lat = loc[3] + random.uniform(-0.02, 0.02)
    lon = loc[4] + random.uniform(-0.02, 0.02)
    
    data.append({
        "id_reporte": 2000 + i,
        "fecha_reporte": date.isoformat(),
        "tipo_reporte": t,
        "latitud": lat,
        "longitud": lon,
        "departamento": loc[0].title(),
        "provincia": loc[1].title(),
        "distrito": loc[2].title(),
        "estado_caso": random.choice(states) if t == "Confirmado" else "En investigación",
        "fuente_dato": source
    })

with open('src/data/reportes.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print(f"Generated {len(data)} records. Red zone should be LIMA.")
