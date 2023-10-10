# Test de permisos Cloud Storage 


1.- Generamos una API Key para la cuenta de servicio que queremos comprobar y lo descargamos en nuestro PC en formato JSON

2.- Indicamos en .env la localización del JSON y el nombre del Bucket de referencia. El .env se puede o no subir al repo git porque no es confidencial en este caso.


```
APIKEYJSON=$HOME/api-key..json
BUCKET=bucket-name

```

3.- Preparamos el entorno

```
npm i
```

4.- Ejecutamos el test

```
cd storage
node test-bucket.js
```

Resultado similar a

```
Test al fichero bucket-name/38b2ecd1-e312-4108-87b8-5af0274275a4/dummy.txt


 - Escritura OK bucket-name/38b2ecd1-e312-4108-87b8-5af0274275a4/dummy.txt
 - Lectura OK. Hay permisos de lectura y generación de URLs [ https://storage.googleapis.com/bucket-name/38b2ecd1-e312-4108-87b8-5af0274275a4/dummy.txt?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=cloud00storage00prod%40project.iam.gserviceaccount.com%2F20230118%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20230118T121525Z&X-Goog-Expires=901&X-Goog-SignedHeaders=host&X-Goog-Signature=bff00c4a070ed2f7d839104eff643af9f6692fc36e944a59c8e4684257cfe74c88c87b3a9bd883981f81aa88ccaee6988fc9e18ec6405b0c473c5b80dc389a24d6f99d7c057d774214c3db86844152260695414220f925fb2a7651efaa84ec156716d66b2b96f2edbd5466f84341ed74480417e17e341683e6b5976f72521e149139080b6f37759973f61be1da604e2183d54c59c6758acaba1ef8f83172d811a624dd4883baca034cf8dc68f4ed3e3e2bc7d69e0531d29436a529c56e214eb8a5fd34f2c9eff5c87322f62733183ce4fd2b3748af3f864f3801d3303780595bf34f948b3e9eecdbcad8db22c080124c51073ad775750bb3bfd6cc624c589f33 ]
 - Descarga OK
 - Borrado OK

```