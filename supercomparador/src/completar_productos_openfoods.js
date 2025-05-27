import axios from 'axios'
import { supabase } from './supabaseClient.js'

const delay = ms => new Promise(res => setTimeout(res, ms))

const buscarProducto = async (nombre) => {
  const url = `https://world.openfoodfacts.org/api/v2/search`
  const params = {
    fields: 'product_name,brands,nutrition_grades,nutriments,image_url,ingredients_text',
    sort_by: 'unique_scans_n',
    page_size: 5,
    search_terms: nombre,
  }

  try {
    const { data } = await axios.get(url, { params })
    return data.products?.find(p =>
      p.product_name?.toLowerCase().includes(nombre.toLowerCase())
    )
  } catch (err) {
    console.error(`Error en búsqueda de ${nombre}:`, err.message)
    return null
  }
}

const completarProductos = async () => {
  const { data: productos, error } = await supabase
    .from('productos')
    .select('*')
    .limit(80)

  if (error) {
    console.error('Error cargando productos:', error.message)
    return
  }

  for (const producto of productos) {
    const nombre = producto.nombre
    if (!nombre) continue

    const match = await buscarProducto(nombre)

    if (!match) {
      console.log(`Sin coincidencia para: ${nombre}`)
      await delay(1000)
      continue
    }

    const updateData = {}
    if (!producto.nutriscore && match.nutrition_grades)
      updateData.nutriscore = match.nutrition_grades
    if (!producto.energia_100g && match.nutriments?.energy_100g)
      updateData.energia_100g = match.nutriments.energy_100g.toString()
    if (!producto.grasas_100g && match.nutriments?.fat_100g)
      updateData.grasas_100g = match.nutriments.fat_100g.toString()
    if (!producto.azucares_100g && match.nutriments?.sugars_100g)
      updateData.azucares_100g = match.nutriments.sugars_100g.toString()
    if (!producto.imagen && match.image_url)
      updateData.imagen = match.image_url

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from('productos')
        .update(updateData)
        .eq('id', producto.id)

      if (updateError) {
        console.error(`Error actualizando ${nombre}:`, updateError.message)
      } else {
        console.log(`Producto actualizado: ${nombre}`)
      }
    }

    // Insertar nutrición si no existe
    const { data: existingNutri } = await supabase
      .from('nutricion')
      .select('id')
      .eq('producto_id', producto.id)
      .maybeSingle()

        if (!existingNutri) {
        await supabase.from('nutricion').insert([{
            producto_id: producto.id,
            calorias: match.nutriments?.['energy-kcal_100g'] || null,
            grasas: match.nutriments?.fat_100g || null,
            grasas_saturadas: match.nutriments?.['saturated-fat_100g'] || null,
            hidratos: match.nutriments?.carbohydrates_100g || null,
            azucares: match.nutriments?.sugars_100g || null,
            proteinas: match.nutriments?.proteins_100g || null,
            sal:     match.nutriments?.salt_100g || null,
        }])
        }

    //Insertar ingredientes si hay
    const ingredientesText = match.ingredients_text
        if (ingredientesText) {
        const ingredientes = ingredientesText
            .split(/[.,;]/)
            .map(i => i.trim().toLowerCase())
            .filter(i => i.length > 0)

        for (const ing of ingredientes) {
            let ingredienteId

            const { data: existingIng } = await supabase
            .from('ingredientes')
            .select('id')
            .eq('nombre', ing)
            .limit(1)

            if (existingIng.length > 0) {
            ingredienteId = existingIng[0].id
            } else {
            const { data: newIng } = await supabase
                .from('ingredientes')
                .insert([{ nombre: ing }])
                .select()
            ingredienteId = newIng[0].id
            }

        //Relación producto-ingrediente
        const { data: rel } = await supabase
          .from('producto_ingrediente')
          .select('id')
          .eq('producto_id', producto.id)
          .eq('ingrediente_id', ingredienteId)
          .limit(1)

        if (!rel.length) {
          await supabase.from('producto_ingrediente').insert([{
            producto_id: producto.id,
            ingrediente_id: ingredienteId,
          }])
        }
      }
    }

    await delay(1000)
  }

  console.log('Proceso finalizado')
}

completarProductos()
