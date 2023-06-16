from flask import Flask, request, send_file, send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import shutil

import zipfile
import os
import subprocess

app = Flask(__name__)

CORS(app) # Activar CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, '..', 'temp_files', 'uploaded_photos')
OUTPUT_FOLDER = os.path.join(BASE_DIR, '..', 'temp_files', 'meshroom_output')
MESH_ZIP_PATH = os.path.join(BASE_DIR, '..', 'temp_files', 'mesh.zip')


ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

if not os.path.exists(app.config['OUTPUT_FOLDER']):
    os.makedirs(app.config['OUTPUT_FOLDER'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def clean_up():
    if os.path.exists(app.config['UPLOAD_FOLDER']):
        shutil.rmtree(app.config['UPLOAD_FOLDER'])
    if os.path.exists(app.config['OUTPUT_FOLDER']):
        shutil.rmtree(app.config['OUTPUT_FOLDER'])
    if os.path.exists(MESH_ZIP_PATH):
        os.remove(MESH_ZIP_PATH)

def choose_pipeline(lighting_grade, photo_range, orientation_change):
    base_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pipelines')

    print(f'Lighting Grade: {lighting_grade}, type: {type(lighting_grade)}')
    print(f'Photo Range: {photo_range}, type: {type(photo_range)}')
    print(f'Orientation Change: {orientation_change}, type: {type(orientation_change)}')

    # If light is too bright or too dark (assuming values 0 and 4)
    if lighting_grade in {0, 4}:
        # Uneven light distribution, use AKAZE with LIOP
        return os.path.join(base_path, 'akaze_liop.mg')

    # If light is not extreme
    else:
        if not orientation_change:
            # If orientation is consistent, use Upright SIFT
            return os.path.join(base_path, 'sift_upright.mg')
        else:
            if photo_range == 2:  # +60
                # Images of various scales or requiring higher precision, use Float SIFT
                return os.path.join(base_path, 'sift_float.mg')
            elif photo_range == 1:  # 40-60
                # Complex scenes with many features of interest, use Dense SIFT
                return os.path.join(base_path, 'depsift.mg')
            elif photo_range == 0:  # 20-40
                # General purpose, use AKAZE with MLDB
                return os.path.join(base_path, 'akaze_mldb.mg')


@app.route('/', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        # Comprobar que la request no viene vacia (doble capa de seguridad)
        if 'file0' not in request.files:
            return 'No files uploaded', 400

        lightingGrade = int(request.form.get('lightingGrade'))
        photoRange = int(request.form.get('photoRange'))
        orientationChange = request.form.get('orientationChange') == 'true'

        pipeline = choose_pipeline(lightingGrade, photoRange, orientationChange)

        # Recibir los archivos subido por la app de React
        files = [request.files[f'file{i}'] for i in range(len(request.files))]

        # Verificar & guardar
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        # Abrir Meshroom para las imágenes subidas
        meshroom_command = f"/opt/Meshroom_bundle/meshroom_batch -p {pipeline} -i {UPLOAD_FOLDER} -o {OUTPUT_FOLDER}"
        print(meshroom_command)
        subprocess.run(meshroom_command, shell=True)

        # Crear un ZIP con los archivos mesh generados
        with zipfile.ZipFile(MESH_ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, _, files in os.walk(OUTPUT_FOLDER):
                for file in files:
                    zipf.write(os.path.join(root,file), os.path.relpath(os.path.join(root, file), OUTPUT_FOLDER))

        # Mandar el zip de vuelta
        reesp = send_file(MESH_ZIP_PATH, 
                 as_attachment=True,
                 mimetype='application/zip')
        
        clean_up()
        
        return reesp


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
