/**
 * Azure Vision prototype – standalone exploration script.
 *
 * This is NOT the application server.  The real server is at src/server.ts
 * (run via `npm run dev` or `npm start`).
 *
 * To run this script you will need to install the Azure packages separately:
 *   npm install @azure-rest/ai-vision-image-analysis @azure/core-auth dotenv cors multer
 *
 * Required environment variables:
 *   VISION_ENDPOINT – Azure Computer Vision endpoint URL
 *   VISION_KEY      – Azure Computer Vision API key
 */
require('dotenv').config()
const express = require('express')
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis')
const createClient = require('@azure-rest/ai-vision-image-analysis').default
const { AzureKeyCredential } = require('@azure/core-auth')

const app = express()
const upload = multer({ dest: 'uploads/' })
app.use(require('cors')())
app.use('/static', express.static('processed')) // Serve ảnh đã xử lý

// Cấu hình Azure
const endpoint = process.env.VISION_ENDPOINT
const key = process.env.VISION_KEY
const credential = new AzureKeyCredential(key)
const client = createClient(endpoint, credential)

// Hàm giả lập xử lý (Nếu không muốn gọi Azure thật lúc code)
const mockProcess = (file) => {
  // Trong thực tế, bạn sẽ copy file và đổi tên
  return {
    overlayUrl: `/static/${file.filename}_removed_bg.png`,
    thumbUrl: `/static/${file.filename}_thumb.png`,
  }
}

app.post('/api/upload-clothing', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path
    const imageBuffer = fs.readFileSync(imagePath)

    // --- CÔNG CỤ 1: REMOVE BACKGROUND (SEGMENTATION) ---
    // Lưu ý: Đây là code mẫu logic, cần Azure Vision 4.0 preview
    const segmentationResult = await client.path('/imageanalysis:segment').post({
      body: imageBuffer,
      queryParameters: { mode: 'backgroundRemoval' },
      contentType: 'application/octet-stream',
    })

    // Lưu ảnh đã tách nền
    const removedBgFilename = `${req.file.filename}_nobg.png`
    fs.writeFileSync(path.join(__dirname, 'processed', removedBgFilename), segmentationResult.body)

    // --- CÔNG CỤ 2: SMART CROP (THUMBNAIL) ---
    // Tạo thumbnail vuông 200x200 tập trung vào vùng quan trọng
    const cropResult = await client.path('/imageanalysis:analyze').post({
      body: imageBuffer,
      queryParameters: {
        features: ['smartCrops'],
        'smartCrops-aspect-ratios': [1.0],
      },
      contentType: 'application/octet-stream',
    })

    // (Giả sử logic crop ảnh từ tọa độ trả về được thực hiện ở đây)
    // Để đơn giản cho demo, ta lưu file gốc làm thumb
    const thumbFilename = `${req.file.filename}_thumb.jpg`
    fs.copyFileSync(imagePath, path.join(__dirname, 'processed', thumbFilename))

    res.json({
      id: req.file.filename,
      image: `http://localhost:3000/static/${removedBgFilename}`,
      thumbnail: `http://localhost:3000/static/${thumbFilename}`,
      name: 'New Item',
    })
  } catch (error) {
    console.error('Azure Error (Falling back to mock):', error.message)
    // Fallback về chế độ giả lập nếu lỗi hoặc chưa config key
    res.json({
      id: Date.now(),
      // Trả về ảnh gốc để test nếu không có Azure
      image: 'https://via.placeholder.com/500x500/transparent/000000?text=Processed+Image',
      thumbnail: 'https://via.placeholder.com/150/cccccc/000000?text=Thumb',
      name: 'Demo Item',
    })
  }
})

app.listen(3000, () => console.log('Server running on port 3000'))
