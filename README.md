# WebAPP - Simplificación del proceso fotogramétrico

El objetivo de la presente aplicación web es poder democratizar y simplificar el proceso de reconstrucción tridimensional mediante técnicas pasiva aplicadas a un conjunto de imágenes sucesivas. 

La aplicación está subida mediante docker containers, para mantener la reproducibilidad en cualquier máquina/servidor en la que se quiera ejecutar el deployment. Adicionalmente, costa de dos capas: el front-end creado en React y el backend creado en python con el framework de Flask. El frontend permite al usuario subir imágenes, y luego envía las imágenes al backend. El backend procesa las imágenes, creando una malla 3D utilizando Meshroom y devuelve un archivo .zip descargable que contiene el modelo tridimensional resultante.

## Requisitos
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [WSL2](https://learn.microsoft.com/es-es/windows/wsl/install)
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html#docker)

### Troubleshooter
En el caso de Windows, es importante que, tras la instalación de nvidia container toolkit revises si la configuración de docker engine contiene:

```json
"runtimes": {
    "nvidia": {
      "args": [],
      "path": "nvidia-container-runtime"
    }
}
```

Si tras la instalación, nvidia-ctk solo cambia la configuración (el daemon) de docker en WSL2, el container de backend no se lanzará. 

## Lanzamiento de la aplicación

Primero, clona el repositorio:

```bash
git clone https://github.com/MVS-99/Splint_Photogrammetry
cd Splint_Photogrammetry/Docker
```

 Una vez dentro de la carpeta con los archivos de docker:

 ```bash
 docker compose build
 docker compose up -d
 ```

 La aplicación ya esta lanzada y lista para usar! Para acceder a la aplicación, deberás entrar mediante tu navegador a:

 ```http
 http://localhost:3000
 ```

## Workflow de la aplicación

1. El usuario primero deberá de leer atentamente la información en la sección *Información*, y, a posteriori, tomar las fotografías siguiendo las indicaciones

2. Si ya tenemos las imágenes, se deberán subir un mínimo de 20 y responder al pequeño cuestionario que sale en pantalla (luz y cambios de orientación).

3. Una vez respondido y enviadas las imágenes, el servidor backend las procesará para obtener la malla tridimensional. El proceso es largo y exige una gran cantidad de recursos, por lo que se le recomienda al usuario algunos videos sobre las tareas de posprocesamiento.

4. Success!! Si todos los pasos se han seguido con exito, el servidor devolverá un archivo .zip al frontend y finalmente al usuario con las texturas y el .obj.
