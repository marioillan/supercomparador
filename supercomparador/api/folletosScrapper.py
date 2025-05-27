from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route("/api/folletos-dia")
def obtener_folletos_dia():
    url = "https://www.dia.es/tiendas/folletos?t=2708"
    base_url = "https://www.dia.es"

    try:
        respuesta = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        html = respuesta.text
        soup = BeautifulSoup(html, "html.parser")

        folletos = []
        columnas = soup.select("table#folletosTable td")
        for columna in columnas:
            imagen_tag = columna.select_one("img.imagen")
            enlace_pdf_tag = columna.select_one("a.downloadPDF")

            if imagen_tag and enlace_pdf_tag:
                imagen_portada = base_url + imagen_tag["src"]
                enlace_pdf = base_url + enlace_pdf_tag["href"]
                folletos.append({
                    "supermercado": "DIA",
                    "imagen_portada": imagen_portada,
                    "enlace_pdf": enlace_pdf
                })

            if not folletos:
                return jsonify({"error": "No se encontraron folletos de DIA."}), 404

            return jsonify(folletos)
    
    except Exception as e:
        return jsonify({
            "error": "Error al obtener el folleto de DIA.",
            "detalle": str(e)
        }), 500


@app.route("/api/folletos-mas")
def obtener_folletos_mas():
    url = "https://folletos.supermercadosmas.com/indice/"  
    base_url = "" 

    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        respuesta = requests.get(url, headers=headers)
        soup = BeautifulSoup(respuesta.text, "html.parser")

        folletos = []

        #Buscar todos los bloques que contienen los folletos
        bloques = soup.select("div.contenedor-folleto-completo")

        for bloque in bloques:
            imagen_tag = bloque.find("img")
            enlace_tag = bloque.find("a", href=True)

            if imagen_tag and enlace_tag:
                imagen_portada = imagen_tag["src"]
                enlace_pdf = enlace_tag["href"]

                folletos.append({
                    "supermercado": "MAS",
                    "imagen_portada": imagen_portada,
                    "enlace_pdf": enlace_pdf
                })

        #Validación: si no se encontró ninguno
        if not folletos:
            return jsonify({"error": "No se encontraron folletos de Supermercados MAS."}), 404

        return jsonify(folletos)

    except Exception as e:
        return jsonify({
            "error": "Error al hacer scraping de Supermercados MAS.",
            "detalle": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)
