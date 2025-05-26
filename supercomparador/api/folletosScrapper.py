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


@app.route("/api/folleto-alcampo")
def obtener_folleto_alcampo():
    url = "https://www.compraonline.alcampo.es/content/folletos-alcampo"

    try:
        respuesta = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        html = respuesta.text
        soup = BeautifulSoup(html, "html.parser")

        img_tag = soup.select_one("img[src*='cover_page']")
        imagen_portada = img_tag["src"] if img_tag else None

        enlace_visor_tag = soup.find("a", string="Ver folleto")
        enlace_visor = enlace_visor_tag["href"] if enlace_visor_tag else None

        if not imagen_portada or not enlace_visor:
            return jsonify({"error": "No se encontro el folleto de Alcampo."}), 404
        
        respuesta_visor = requests.get(enlace_visor, headers={"User-Agent": "Mozilla/5.0"})
        soup_visor = BeautifulSoup(respuesta_visor.text, "html.parser")

        enlace_pdf_tag = soup_visor.select_one("a#downloadAsPdf")
        enlace_pdf = enlace_pdf_tag["href"] if enlace_pdf_tag else None

        if not enlace_pdf:
            return jsonify({"error": "No se encontró el PDF en el visor."}), 404

        return jsonify({
            "supermercado": "Alcampo",
            "imagen_portada": imagen_portada,
            "enlace_pdf": enlace_pdf
        })

    except Exception as e:
        return jsonify({
            "error": "Error al obtener el folleto de Alcampo.",
            "detalle": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)
