import React, { useState } from 'react'
import axios from 'axios'

const App = () => {

  const [photoData, setPhotoData] = useState({})
  const [matchedCode, setMatchedCode] = useState("")

  const handleChange = (e) => {
    const { name, value, files } = e.target

    if (name === "photo") {
      setPhotoData((prev) => ({ ...prev, photo: files[0] }))
    } else {
      setPhotoData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const savePhoto = async () => {
    try {
      const formData = new FormData()
      formData.append("code", photoData.code)
      formData.append("photo", photoData.photo)

      const response = await axios.post(
        'http://localhost:5000/api/savePhoto',
        formData
      )

      if (response.data.success) {
        alert('Data send Succesfullty')
      }

    } catch (error) {
      alert(error.message)
    }
  }

  const analyzePhoto = async () => {
    try {
      if (!photoData.photo) {
        alert("Please select a photo first")
        return
      }

      const formData = new FormData()
      formData.append("photo", photoData.photo)
      
      const response = await axios.post(
        'http://localhost:5000/api/analyzePhoto',
        formData
      )

      if (response.data.success) {
        setMatchedCode(response.data.code)
        alert(`Data analyzed successfully. Employee code: ${response.data.code}`)
      } else {
        setMatchedCode("")
        alert(response.data.message || "No match found")
      }
      
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div>
      <label>Employee Code</label>
      <input type="text" name="code" onChange={handleChange} />

      <label>Upload Photo</label>
      <input
        type="file"
        name="photo"
        onChange={handleChange}
        accept="image/*"
      />

      <button onClick={savePhoto}>Save Photo</button>
      <button onClick={analyzePhoto}>Analyze Photo</button>
      {matchedCode && <p>Matched Employee Code: {matchedCode}</p>}
    </div>
  )
}

export default App
