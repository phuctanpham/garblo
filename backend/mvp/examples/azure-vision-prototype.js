/**
 * Azure Vision Prototype
 *
 * A standalone prototype demonstrating Azure AI Vision background-removal and
 * smart-crop features for clothing images.
 *
 * Run with its own dependencies (not part of the main API package):
 *   npm install @azure-rest/ai-vision-image-analysis @azure/core-auth cors dotenv multer
 *
 * Required environment variables:
 *   VISION_ENDPOINT – Azure Computer Vision endpoint URL
 *   VISION_KEY      – Azure Computer Vision API key
 *
 * Usage:
 *   VISION_ENDPOINT=<url> VISION_KEY=<key> node examples/azure-vision-prototype.js
 */
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { ImageAnalysisClient } = require("@azure-rest/ai-vision-image-analysis");
const createClient = require("@azure-rest/ai-vision-image-analysis").default;
const { AzureKeyCredential } = require("@azure/core-auth");

const app = express();
const upload = multer({ dest: "uploads/" });
app.use(require("cors")());
app.use("/static", express.static("processed")); // Serve processed images

// Azure configuration
const endpoint = process.env.VISION_ENDPOINT;
const key = process.env.VISION_KEY;
const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

// Output directory for processed images (configurable via OUTPUT_DIR env var)
const OUTPUT_DIR = process.env.OUTPUT_DIR ?? path.resolve(__dirname, "..", "processed");

// NOTE: This prototype does not implement rate-limiting or authentication.
// Before deploying to a production or internet-facing environment, add
// express-rate-limit (or similar middleware) and proper authentication.
app.post("/api/upload-clothing", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);

    // --- TOOL 1: REMOVE BACKGROUND (SEGMENTATION) ---
    const segmentationResult = await client
      .path("/imageanalysis:segment")
      .post({
        body: imageBuffer,
        queryParameters: { mode: "backgroundRemoval" },
        contentType: "application/octet-stream",
      });

    const removedBgFilename = `${req.file.filename}_nobg.png`;
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(OUTPUT_DIR, removedBgFilename),
      segmentationResult.body
    );

    // --- TOOL 2: SMART CROP (THUMBNAIL) ---
    // Request a 1:1 smart crop bounding box from Azure Vision.
    const cropResponse = await client.path("/imageanalysis:analyze").post({
      body: imageBuffer,
      queryParameters: {
        features: ["smartCrops"],
        "smartCrops-aspect-ratios": [1.0],
      },
      contentType: "application/octet-stream",
    });
    // TODO: use cropResponse.body.smartCropsResult to crop the image precisely.
    // For this prototype we copy the original file as the thumbnail placeholder.
    void cropResponse;

    const thumbFilename = `${req.file.filename}_thumb.jpg`;
    fs.copyFileSync(
      imagePath,
      path.join(OUTPUT_DIR, thumbFilename)
    );

    res.json({
      id: req.file.filename,
      image: `http://localhost:3000/static/${removedBgFilename}`,
      thumbnail: `http://localhost:3000/static/${thumbFilename}`,
      name: "New Item",
    });
  } catch (error) {
    console.error("Azure Error (Falling back to mock):", error.message);
    res.json({
      id: Date.now(),
      image:
        "https://via.placeholder.com/500x500/transparent/000000?text=Processed+Image",
      thumbnail: "https://via.placeholder.com/150/cccccc/000000?text=Thumb",
      name: "Demo Item",
    });
  }
});

app.listen(3000, () => console.log("Azure Vision prototype running on port 3000"));
