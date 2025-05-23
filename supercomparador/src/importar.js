import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

async function obtenerProductos(marca = "Hacendado", pagina = 1) {
  const url = `https://world.openfoodfacts.org/cgi/search.pl?brand=${marca}&json=true&page=${pagina}&page_size=5&fields=product_name,brands,ingredients_text,categories_tags,image_url,nutriments`;

  try {
    const response = await axios.get(url);
        const productos = response.data.products;

    if (!Array.isArray(productos)) {
      console.error("⚠️ La respuesta no contiene un array de productos:", productos);
      return;
    }

    for (const p of productos) {
      console.log("📦 Producto:", p.product_name);
    }

  } catch (err) {
    console.error("❌ Error al conectar con la API:", err.message);
  }
}

obtenerProductos();