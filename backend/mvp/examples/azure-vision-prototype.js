require('dotenv').config()
const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis')
const { AzureKeyCredential } = require('@azure/core-auth')
const fs = require('fs')

const endpoint = process.env.AZURE_VISION_ENDPOINT
const key = process.env.AZURE_VISION_KEY
const credential = new AzureKeyCredential(key)
const client = new ImageAnalysisClient(endpoint, credential)

const features = ['BackgroundRemoval']

async function removeBackground(imageUrl) {
  const result = await client.path('imageanalysis:segment').post({
    body: {
      url: imageUrl,
    },
    queryParameters: {
      'api-version': '2023-02-01-preview',
    },
    headers: { 'Content-Type': 'application/json' },
  })

  if (result.status !== '200') {
    console.error(`Status: ${result.status}`)
    console.error(result.body.error)
    return
  }

  console.log(
    `Foreground image URL: ${result.body.result.foreground_image_url}`,
  )

  // To save the background-removed image, you'll need to make another request to the URL
  // provided in the result.
}

// The sample image is a model wearing a Garblo-branded t-shirt. The background is a retail
// store setting, which we want to remove so we can place the model and shirt in a new setting.
removeBackground(
  'https://user-images.githubusercontent.com/1529464/287669455-b46132b4-7a4c-47bb-b14a-fb7d56de0575.png',
)
