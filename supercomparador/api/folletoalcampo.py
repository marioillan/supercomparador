from flask import Flask, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)

@app.route("/api/folleto-alcampo")
def obtener_folleto_alcampo():
    url = "https://www.compraonline.alcampo.es/content/folletos-alcampo?srsltid=AfmBOoqN99ioxiozUT0Z-at0AnCbLXgfohG17NEECY6QPMouoMZSuhy5"

    try:
        respuesta = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        html = respuesta.text
        soup = BeautifulSoup(html, "html.parser")

        img_tag = soup.select_one("img[src*='cover_page']")
        imagen_portada = img_tag["src"] if img_tag else None

        enlace_pdf_tag = soup.select_one("a#downloadAsPdf")
        enlace_pdf = enlace_pdf_tag["href"] if enlace_pdf_tag else None

        if not imagen_portada or not enlace_pdf:
            return jsonify({"error": "No se encontró el folleto de Alcampo."}), 404

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
