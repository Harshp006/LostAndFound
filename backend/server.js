const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

app.post("/submit", upload.single("image"), async (req, res) => {
  try {
    const payload = {
      ...req.body,
      imageBase64: req.file
        ? req.file.buffer.toString("base64")
        : "",
    };

    const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();

    res.json({
      success: true,
      message: "Form submitted successfully",
      response: text,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
