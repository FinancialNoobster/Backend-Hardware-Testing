from flask import Flask, request, jsonify
from deepface import DeepFace
import os

app = Flask(__name__)

DB_PATH = "face_db"

if not os.path.exists(DB_PATH):
    os.makedirs(DB_PATH)


# ✅ SAVE FACE
@app.route('/save-face', methods=['POST'])
def save_face():
    if 'photo' not in request.files:
        return jsonify({"success": False, "message": "photo is required"}), 400

    if 'code' not in request.form or not request.form['code'].strip():
        return jsonify({"success": False, "message": "code is required"}), 400

    file = request.files['photo']
    code = request.form['code'].strip()

    file_path = f"{DB_PATH}/{code}.jpg"
    file.save(file_path)

    return jsonify({"success": True})


# ✅ ANALYZE FACE USING VERIFY
@app.route('/analyze-face', methods=['POST'])
def analyze_face():
    if 'photo' not in request.files:
        return jsonify({"success": False, "message": "photo is required"}), 400

    known_faces = [name for name in os.listdir(DB_PATH) if os.path.isfile(os.path.join(DB_PATH, name))]
    if not known_faces:
        return jsonify({
            "success": False,
            "message": "No saved employee photos found. Save at least one photo first."
        }), 400

    file = request.files['photo']
    temp_path = "temp.jpg"
    file.save(temp_path)

    try:
        for filename in known_faces:
            db_image_path = os.path.join(DB_PATH, filename)

            result = DeepFace.verify(
                img1_path=temp_path,
                img2_path=db_image_path,
                enforce_detection=False,
                model_name="Facenet"
            )

            if result["verified"]:
                code = os.path.basename(filename).split('.')[0]

                return jsonify({
                    "success": True,
                    "code": code,
                    "distance": result["distance"]
                })

        return jsonify({"success": False, "message": "No match found"})

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        })


if __name__ == "__main__":
    app.run(port=8000, debug=True)
