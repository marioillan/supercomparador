import requests
from bs4 import BeautifulSoup

BASE_URL = "https://www.dia.es/folleto"

response = requests.get(BASE_URL)
soup = BeautifulSoup(response.content, "html.parser")

folletos = soup.select("div#folletos table td")

for folleto in folletos:
    img_tag = folleto.find("img")
    img_src = "https://www.dia.es" + img_tag["src"]

    vigencia = folleto.select_one(".vigenciaFolleto").text.strip()

    ver_folleto = folleto.select_one("a.verFolletoAct, a.verFolletoProx")
    url_ver_folleto = "https://www.dia.es" + ver_folleto["href"]

    pdf_link = folleto.select_one("a.downloadPDF")
    url_pdf = "https://www.dia.es" + pdf_link["href"]

    print("📰 Vigencia:", vigencia)
    print("🖼️ Imagen:", img_src)
    print("🌐 Ver online:", url_ver_folleto)
    print("📄 PDF:", url_pdf)
    print("-" * 50)
