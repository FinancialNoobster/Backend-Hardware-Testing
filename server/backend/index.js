import express from 'express'
import multer from 'multer'
import cors from 'cors'
import axios from 'axios'
import FormData from 'form-data'

const app = express()
app.use(cors())

const upload = multer({ storage: multer.memoryStorage() })

// ✅ SAVE PHOTO → send to Python
app.post('/api/savePhoto', upload.single('photo'), async (req, res) => {
  try {
    const form = new FormData()
    form.append('photo', req.file.buffer, 'image.jpg')
    form.append('code', req.body.code)

    const response = await axios.post(
      'http://localhost:8000/save-face',
      form,
      { headers: form.getHeaders() }
    )

    res.json(response.data)

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// ✅ ANALYZE PHOTO → send to Python
app.post('/api/analyzePhoto', upload.single('photo'), async (req, res) => {
  try {
    const form = new FormData()
    form.append('photo', req.file.buffer, 'image.jpg')

    const response = await axios.post(
      'http://localhost:8000/analyze-face',
      form,
      { headers: form.getHeaders() }
    )

    res.status(200).json(response.data)

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// health check
app.get('/api/health', (req, res) => {
  res.json({ success: true })
})

app.listen(5000, () => {
  console.log("Node server running on 5000")
})