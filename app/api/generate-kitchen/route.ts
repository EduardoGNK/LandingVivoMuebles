import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const HF_TOKEN = process.env.HF_TOKEN
if (!HF_TOKEN) {
  throw new Error('HF_TOKEN no está configurado en las variables de entorno')
}

// Intentar con FLUX primero, si no funciona, usar Stable Diffusion como alternativa
const MODEL_ID = process.env.HF_MODEL_ID || 'black-forest-labs/FLUX.1-dev'
const FALLBACK_MODEL_ID = 'stabilityai/stable-diffusion-xl-base-1.0'

// Inicializar el cliente de HuggingFace
const hf = new HfInference(HF_TOKEN)

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    console.log('Generating kitchen with prompt:', prompt)
    console.log('Using model:', MODEL_ID)

    // Usar la biblioteca oficial de HuggingFace que maneja el router automáticamente
    const modelsToTry = [MODEL_ID, FALLBACK_MODEL_ID]
    let imageBlob: Blob | null = null;
    let lastError: any = null;
    const maxAttempts = 3;
    
    for (const currentModel of modelsToTry) {
      console.log(`Trying model: ${currentModel}`)
      
      let attempts = 0;
      while (attempts < maxAttempts) {
        try {
          attempts++;
          console.log(`Attempt ${attempts} of ${maxAttempts} with model ${currentModel}`)
          
          // Usar la biblioteca oficial que maneja el router automáticamente
          const result = await hf.textToImage({
            model: currentModel,
            inputs: prompt,
            parameters: {
              negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy",
              num_inference_steps: 20,
              guidance_scale: 7.5,
            }
          });
          
          // La biblioteca devuelve un Blob directamente
          imageBlob = result;
          console.log(`Success with model: ${currentModel}`)
          break; // Salir del loop de intentos
          
        } catch (error: any) {
          lastError = error;
          console.log(`Attempt ${attempts} failed with model ${currentModel}:`, error);
          
          // Si es un error de modelo no encontrado o no disponible, probar siguiente modelo
          if (error?.message?.includes('404') || error?.message?.includes('not found') || error?.status === 404) {
            console.log(`Model ${currentModel} not available, trying next model...`);
            break; // Salir del loop de intentos para probar siguiente modelo
          }
          
          if (attempts >= maxAttempts) {
            // Si agotamos los intentos, probar siguiente modelo
            break;
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
        }
      }
      
      // Si obtuvimos una imagen exitosamente, salir del loop de modelos
      if (imageBlob) {
        break;
      }
    }
    
    // Si no obtuvimos imagen después de probar todos los modelos
    if (!imageBlob) {
      if (lastError) {
        console.error('Error generating kitchen image:', lastError);
        
        // Proporcionar mensajes de error más específicos
        if (lastError?.message?.includes('401') || lastError?.status === 401) {
          return NextResponse.json(
            { error: 'Token de API inválido o expirado. Por favor, verifica tu HF_TOKEN.' },
            { status: 401 }
          )
        } else if (lastError?.message?.includes('429') || lastError?.status === 429) {
          return NextResponse.json(
            { error: 'Límite de créditos excedido. Por favor, intenta más tarde.' },
            { status: 429 }
          )
        } else if (lastError?.message?.includes('503') || lastError?.status === 503) {
          return NextResponse.json(
            { error: 'El servicio está temporalmente no disponible. Por favor, intenta más tarde.' },
            { status: 503 }
          )
        }
        
        return NextResponse.json(
          { error: `Error al generar la imagen: ${lastError?.message || 'Error desconocido'}` },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: 'No se pudo generar la imagen después de probar todos los modelos disponibles.' },
        { status: 500 }
      )
    }
    
    // Convert to base64 for frontend
    const arrayBuffer = await imageBlob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const mimeType = imageBlob.type || 'image/jpeg'
    const dataUrl = `data:${mimeType};base64,${base64}`

    console.log('Image generated successfully')
    return NextResponse.json({ 
      success: true, 
      image: dataUrl 
    })

  } catch (error) {
    console.error('Error generating kitchen image:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.' },
          { status: 500 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor. Por favor, intenta más tarde.' },
      { status: 500 }
    )
  }
} 