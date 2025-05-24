from flask import Flask, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/folleto-dia")
def obtener_folleto_dia():
    url = "https://www.dia.es/tiendas/folletos?t=2708"
    base_url = "https://www.dia.es"

    try:
        respuesta = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        html = respuesta.text
        soup = BeautifulSoup(html, "html.parser")

        imagen_tag = soup.select_one("img.imagen")
        enlace_pdf_tag = soup.select_one("a.downloadPDF")

        if not imagen_tag or not enlace_pdf_tag:
            return jsonify({"error": "No se encontró imagen o PDF."}), 404

        imagen_portada = base_url + imagen_tag["src"]
        enlace_pdf = base_url + enlace_pdf_tag["href"]

        return jsonify({
            "supermercado": "DIA",
            "imagen_portada": imagen_portada,
            "enlace_pdf": enlace_pdf
        })

    except Exception as e:
        return jsonify({
            "error": "Error al obtener el folleto DIA.",
            "detalle": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)
