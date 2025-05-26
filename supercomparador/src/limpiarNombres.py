import json
import re
import time
import requests

cache_resultados = {}

PALABRAS_INUTILES = {
    "carrefour", "marca", "blanca", "pack", "unidad", "kg", "g", "gr",
    "ud", "uds", "nuevo", "oferta", "promo", "descuento", "precio", "extra"
}

def limpiar_nombre(nombre):
    nombre = nombre.lower()
    nombre = re.sub(r'[^a-záéíóúñü ]', '', nombre)  # elimina símbolos y números
    nombre = re.sub(r'\s+', ' ', nombre).strip()
    palabras = nombre.split()
    palabras_utiles = [p for p in palabras if p not in PALABRAS_INUTILES]
    return palabras_utiles[0] if palabras_utiles else ''

def consultar_open_food_facts(termino):
    if termino in cache_resultados:
        print(f"🔁 En caché: {termino}")
        return cache_resultados[termino]

    url = 'https://world.openfoodfacts.org/cgi/search.pl'
    params = {
        'search_terms': termino,
        'search_simple': 1,
        'action': 'process',
        'json': 1
    }

    try:
        response = requests.get(url, params=params, timeout=15)
        response.raise_for_status()
        data = response.json()
        if data.get('products'):
            producto = data['products'][0]
            info = {
                'nombre_of': producto.get('product_name', ''),
                'marca': producto.get('brands', ''),
                'categoria': producto.get('categories', ''),
                'nutriscore': producto.get('nutriscore_grade', ''),
                'energia_100g': producto.get('nutriments', {}).get('energy_100g', ''),
                'grasas_100g': producto.get('nutriments', {}).get('fat_100g', ''),
                'azucares_100g': producto.get('nutriments', {}).get('sugars_100g', ''),
                'imagen': producto.get('image_url') or None,
                'supermercado': producto.get('supermerado')or None
            }
            cache_resultados[termino] = info
            return info
    except Exception as e:
        print(f"* Error al consultar '{termino}': {e}")

    cache_resultados[termino] = {}
    return {}

def main():
    try:
        with open("productos.json", "r", encoding="utf-8") as f:
            productos = json.load(f)
    except Exception as e:
        print(f"* Error al cargar productos.json: {e}")
        return

    productos_enriquecidos = []
    productos_no_encontrados = []

    print(f"🔍 Procesando {len(productos)} productos...\n")

    for i, producto in enumerate(productos):
        nombre_original = producto.get("nombre", "")
        nombre_limpio = limpiar_nombre(nombre_original)

        print(f"\n({i+1}/{len(productos)}) 🛒 Producto: {nombre_original}")
        print(f"   🔎 Buscando con primera palabra útil: '{nombre_limpio}'")

        if not nombre_limpio:
            print("   * Nombre no válido tras limpiar. Saltando...")
            productos_no_encontrados.append(producto)
            continue

        resultado = consultar_open_food_facts(nombre_limpio)

        if resultado:
            print(f"   - Coincidencia: {resultado.get('nombre_of', 'desconocido')}")
            producto_actualizado = {
                **producto,
                "nombre_limpio": nombre_limpio,
                **resultado
            }
            productos_enriquecidos.append(producto_actualizado)
        else:
            print(f"   * No se encontró información para: '{nombre_limpio}'")
            productos_no_encontrados.append(producto)

        time.sleep(1.5)

    with open("productos_enriquecidos.json", "w", encoding="utf-8") as f:
        json.dump(productos_enriquecidos, f, indent=2, ensure_ascii=False)
        print("\n✅ Archivo generado: productos_enriquecidos.json")

    with open("productos_no_encontrados.json", "w", encoding="utf-8") as f:
        json.dump(productos_no_encontrados, f, indent=2, ensure_ascii=False)
        print("⚠️  Archivo generado: productos_no_encontrados.json")

    print(f"\n🔁 Total consultas únicas a la API: {len(cache_resultados)}")

if __name__ == "__main__":
    main()
