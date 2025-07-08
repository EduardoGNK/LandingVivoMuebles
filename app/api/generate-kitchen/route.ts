import { NextRequest, NextResponse } from 'next/server'

const HF_TOKEN = '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'
const MODEL_URL = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Call HuggingFace API
    const response = await fetch(MODEL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: "blurry, low quality, distorted, ugly, bad anatomy",
          num_inference_steps: 30,
          guidance_scale: 7.5,
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`)
    }

    // Get the image as blob
    const imageBlob = await response.blob()
    
    // Convert to base64 for frontend
    const arrayBuffer = await imageBlob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')
    const mimeType = imageBlob.type || 'image/jpeg'
    const dataUrl = `data:${mimeType};base64,${base64}`

    return NextResponse.json({ 
      success: true, 
      image: dataUrl 
    })

  } catch (error) {
    console.error('Error generating kitchen image:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
} 