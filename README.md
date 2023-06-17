# WebAPP - Simplificación del proceso fotogramétrico

El objetivo de la presente aplicación web es poder democratizar y simplificar el proceso de reconstrucción tridimensional mediante técnicas pasiva aplicadas a un conjunto de imágenes sucesivas. 

La aplicación está subida mediante docker containers, para mantener la reproducibilidad en cualquier máquina/servidor en la que se quiera ejecutar el deployment. Adicionalmente, costa de dos capas: el front-end creado en React y el backend creado en python con el framework de Flask. El frontend permite al usuario subir imágenes, y luego envía las imágenes al backend. El backend procesa las imágenes, creando una malla 3D utilizando Meshroom y devuelve un archivo .zip descargable que contiene el modelo tridimensional resultante.
