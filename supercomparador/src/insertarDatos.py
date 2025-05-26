import json
import requests

# Configura tus credenciales de Supabase
SUPABASE_URL = "https://yizuxbujwcebmmhnifie.supabase.co"
SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpenV4YnVqd2NlYm1taG5pZmllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NjU0NTIsImV4cCI6MjA1OTU0MTQ1Mn0.cUZGoKi0C2PumEkzxh9ipXre5sHrrhJ3F7l1sK_bQJc"
SUPABASE_TABLE = "productos"

def insertar_producto(producto):
    url = f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}"
    headers = {
        "apikey": SUPABASE_API_KEY,
        "Authorization": f"Bearer {SUPABASE_API_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

    response = requests.post(url, json=producto, headers=headers)
    if response.status_code == 201:
        print(f"- Insertado: {producto['nombre']}")
    else:
        print(f"* Error al insertar {producto['nombre']}: {response.status_code}")
        print(response.text)

def main():
    try:
        with open("productos.json", "r", encoding="utf-8") as f:
            productos = json.load(f)
    except Exception as e:
        print(f"* Error al cargar productos_enriquecidos.json: {e}")
        return

    print(f"+ Insertando {len(productos)} productos en Supabase...\n")
    for producto in productos:
        datos = {
            "nombre": producto.get("nombre", ""),
            "precio": producto.get("precio", ""),
            "marca": producto.get("marca", ""),
            "categoria": producto.get("categoria", ""),
            "nutriscore": producto.get("nutriscore", ""),
            "energia_100g": producto.get("energia_100g") or None,
            "grasas_100g": producto.get("grasas_100g") or None,
            "azucares_100g": producto.get("azucares_100g") or None,
            "imagen": producto.get("imagen") or None,
            "supermercado": producto.get("supermercado")or "Dia"

        }

        insertar_producto(datos)

if __name__ == "__main__":
    main()
