from flask import Flask, request, send_file
from werkzeug.utils import secure_filename

import zipfile
import os
import subprocess

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, '..', 'temp_files', 'uploaded_photos')
OUTPUT_FOLDER = os.path.join(BASE_DIR, '..', 'temp_files', 'meshroom_output')
MESH_ZIP_PATH = os.path.join(BASE_DIR, '..', 'temp_files', 'mesh.zip')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # Comprobar que la request no viene vacia (doble capa de seguridad)
        if 'file0' not in request.files:
            return 'No files uploaded', 400

        # Recibir los archivos subido por la app de React
        files = [request.files[f'file{i}'] for i in range(len(request.files))]

        # Verificar & guardar
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        # Abrir Meshroom para las imágenes subidas
        meshroom_command = f"~/Meshroom/meshroom_batch --input {UPLOAD_FOLDER} --output{OUTPUT_FOLDER}"
        subprocess.run(meshroom_command, shell=True)

        # Crear un ZIP con los archivos mesh generados
        with zipfile.ZipFile(MESH_ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files in os.walk(OUTPUT_FOLDER):
                for file in files:
                    zipf.write(os.path.join(root,file), os.path.relpath(os.path.join(root, file), OUTPUT_FOLDER))

        # Mandar el zip de vuelta
        return send_file(MESH_ZIP_PATH, as_attachment=True, attachment_filename='mesh.zip')


if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)
