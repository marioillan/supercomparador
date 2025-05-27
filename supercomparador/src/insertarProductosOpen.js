import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yizuxbujwcebmmhnifie.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpenV4YnVqd2NlYm1taG5pZmllIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk2NTQ1MiwiZXhwIjoyMDU5NTQxNDUyfQ.4k9mR-178UKxkjQ-VHW1SeYs_t1fQtkNNxqtyN5CfkE';

const supabase = createClient(supabaseUrl, supabaseKey);

const headers = {
  'User-Agent': 'SuperComparadorApp/1.0 (https://tusitio.com)',
};

const guardarProductos = async () => {
  try {
    console.log('▶️ Consultando Open Food Facts...');
    const { data } = await axios.get('https://world.openfoodfacts.org/api/v2/search', {
      headers,
      params: {
        page: 3,
        page_size: 50,
        lc: 'es',
        cc: 'es',
        fields: 'product_name,brands,nutrition_grades,nutriments,ingredients_text,image_url',
        sort_by: 'unique_scans_n',
      }
    });

    const productos = data.products;
    console.log(`✅ Obtenidos ${productos.length} productos`);

    let insertados = 0;

    for (const p of productos) {
      if (!p.product_name) continue;

      const { data: existe } = await supabase
        .from('productos_openfoodfacts')
        .select('id')
        .eq('nombre', p.product_name)
        .maybeSingle();

      if (existe) continue;

      const { error } = await supabase.from('productos_openfoodfacts').insert([{
        nombre: p.product_name,
        marca: p.brands || null,
        nutriscore: p.nutrition_grades || null,
        energia_100g: p.nutriments?.['energy-kcal_100g']?.toString() || null,
        azucares_100g: p.nutriments?.sugars_100g?.toString() || null,
        grasas_100g: p.nutriments?.fat_100g?.toString() || null,
        ingredientes: p.ingredients_text || null,
        imagen: p.image_url || null,
        fuente: 'OpenFoodFacts'
      }]);

      if (error) {
        console.warn(`⚠️ Error guardando: ${p.product_name}`);
        console.error(error.message);
        continue;
      }

      insertados++;
      console.log(`✅ Guardado: ${p.product_name} (${insertados}/50)`);

      if (insertados >= 50) break;
    }

    console.log(`🎉 Guardados ${insertados} productos nuevos en total.`);
  } catch (err) {
    console.error('❌ Error con la API:', err.message);
  }
};

guardarProductos();
