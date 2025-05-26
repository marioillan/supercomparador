import asyncio
from playwright.async_api import async_playwright
import json

async def auto_scroll(page, scroll_delay=1000, max_scrolls=20):
    for _ in range(max_scrolls):
        await page.evaluate('window.scrollBy(0, window.innerHeight)')
        await page.wait_for_timeout(scroll_delay)

async def scrape_carrefour(url):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)  # Mostrar navegador
        page = await browser.new_page()

        productos = []

        print(f"🛒 Cargando página: {url}")
        await page.goto(url)

        # Scroll dinámico
        await auto_scroll(page, scroll_delay=1500, max_scrolls=15)

        # Esperar productos
        await page.wait_for_selector('.product-card')

        # Extraer datos
        cards = await page.query_selector_all('.product-card')

        for card in cards:
            nombre_el = await card.query_selector('.product-card__title')
            nombre = (await nombre_el.inner_text()).strip() if nombre_el else ''

            precio_el = await card.query_selector('.product-card__price')
            precio = (await precio_el.inner_text()).strip() if precio_el else ''

            imagen_el = await card.query_selector('img.product-card__image')
            imagen = await imagen_el.get_attribute('src') if imagen_el else ''

            productos.append({
                "nombre": nombre,
                "precio": precio,
                "imagen": imagen
            })

        await browser.close()
        return productos

if __name__ == "__main__":
    url_categoria = "https://www.carrefour.es/supermercado/productos-frescos/cat20002/c?offset=24"
    productos = asyncio.run(scrape_carrefour(url_categoria))

    # Guardar en archivo JSON
    with open("productos.json", "w", encoding="utf-8") as f:
        json.dump(productos, f, indent=2, ensure_ascii=False)

    print("✅ Datos guardados en productos.json")
