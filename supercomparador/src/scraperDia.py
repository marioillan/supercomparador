import asyncio
from playwright.async_api import async_playwright
import json

async def auto_scroll(page, scroll_delay=1000, max_scrolls=20):
    for _ in range(max_scrolls):
        await page.evaluate('window.scrollBy(0, window.innerHeight)')
        await page.wait_for_timeout(scroll_delay)

async def scrape_dia(url):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Cambia a True para ocultar el navegador
        page = await browser.new_page()

        productos = []

        print(f"🛒 Cargando página: {url}")
        await page.goto(url)

        # Scroll dinámico (si hay productos cargados por scroll)
        await auto_scroll(page, scroll_delay=1500, max_scrolls=15)

        # Esperar a que carguen los productos
        await page.wait_for_selector('.search-product-card')

        cards = await page.query_selector_all('.search-product-card')

        for card in cards:
            nombre_el = await card.query_selector('p.search-product-card__product-name')
            nombre = (await nombre_el.inner_text()).strip() if nombre_el else ''

            precio_el = await card.query_selector('p.search-product-card__active-price')
            precio_texto = (await precio_el.inner_text()).strip() if precio_el else ''
            precio = precio_texto.replace("\xa0€", "").replace("€", "").replace(",", ".").strip()

            imagen_el = await card.query_selector('img.search-product-card__product-image')
            imagen = await imagen_el.get_attribute('src') if imagen_el else ''
            if imagen.startswith('/'):
                imagen = 'https://www.dia.es' + imagen

            productos.append({
                "nombre": nombre,
                "precio": float(precio) if precio else 0.0,
                "imagen": imagen,
                "supermercado": "Dia",
                "categoria": "charcutería"
            })

        await browser.close()
        return productos

if __name__ == "__main__":
    url_dia = "https://www.dia.es/yogures-y-postres/c/L113"
    productos = asyncio.run(scrape_dia(url_dia))

    with open("productos.json", "w", encoding="utf-8") as f:
        json.dump(productos, f, indent=2, ensure_ascii=False)

    print("- Datos guardados en productos.json")
