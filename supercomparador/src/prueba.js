import axios from 'axios';

// Configura los headers como recomienda Open Food Facts
const headers = {
  'User-Agent': 'SuperComparadorApp/1.0 (https://tusitio.com)',
};

const obtenerProductos = async () => {
  try {
    const response = await axios.get('https://world.openfoodfacts.org/api/v2/search', {
      headers,
      params: {
        page: 1,
        page_size: 50,
        fields: 'product_name,brands,categories,image_url,nutrition_grades,ingredients_text,nutriments',
        sort_by: 'unique_scans_n',
                lc: 'es',
        cc: 'es', // orden por escaneos únicos
      }
    });

    const productos = response.data.products;

    productos.forEach((p, i) => {
      console.log(`\n#${i + 1}`);
      console.log(`Nombre: ${p.product_name}`);
      console.log(`Marca: ${p.brands}`);
      console.log(`Nutri-Score: ${p.nutrition_grades}`);
      console.log(`Calorías: ${p.nutriments?.['energy-kcal_100g'] || 'N/D'} kcal`);
      console.log(`Azúcares: ${p.nutriments?.sugars_100g || 'N/D'} g`);
      console.log(`Grasas: ${p.nutriments?.fat_100g || 'N/D'} g`);
      console.log(`Ingredientes: ${p.ingredients_text || 'No disponible'}`);
      console.log(`Imagen: ${p.image_url || 'Sin imagen'}`);
    });

    console.log(`\n✅ Total de productos cargados: ${productos.length}`);
  } catch (error) {
    console.error('❌ Error al consultar la API:', error.message);
  }
};

obtenerProductos();
