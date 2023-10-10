const uuid = require('uuid');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();


async function generateV4ReadSignedUrl(bucket, filename, expiration) {
  // These options will allow temporary read access to the file
  const options = {
      version: 'v4',
      action: 'read',
      expires: expiration ? expiration : Date.now() + 15 * 60 * 1000, // 15 minutes
  };

  if (!filename || filename.length<8) {
    return '';
  }
  // Get a v4 signed URL for reading the file
  const ff = bucket.file(filename);
  const [url] = await ff.getSignedUrl(options);
  return url;
}


let serviceAccount;
if (process.env.APIKEYJSONBASE64) {

  let buff = new Buffer.from(process.env.APIKEYJSONBASE64, 'base64');
  serviceAccount = JSON.parse(buff.toString('ascii'));

} else if (process.env.APIKEYJSON) {

  serviceAccount = require(process.env.APIKEYJSON);
}


//GCS
const { Storage } = require('@google-cloud/storage');
const { mainModule } = require('process');
const storage = new Storage({  
  credentials: {
    projectId:  serviceAccount.project_id,
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key},
});
const bucket = storage.bucket(process.env.BUCKET);

let u = "38b2ecd1-e312-4108-87b8-5af0274275a4" //Folder


//Nombres relativos a la ruta/bucket
const file_name = "dummy.txt";
const gcp_file_name = `${u}/${file_name}`;
const full_gcp_file_name = `${process.env.BUCKET}/${gcp_file_name}`;

console.log(`Test al fichero ${full_gcp_file_name}`)
console.log("\n")



//-------------------------------------------
//Test escritura
async function testEscritura() {
  gcsFile = bucket.file(gcp_file_name);

  try {
    await bucket.upload(file_name, {destination: gcp_file_name});
    console.log(" - Escritura OK " + full_gcp_file_name);

  } catch (err){
      console.log(" !!! No se puede escribir en " + full_gcp_file_name);
      console.log(err);
  }  
}

//------------------------------------------------------
//Test lectura
//Deseable que el fichero esté porque ha funcionado el test de escritura. 
//En caso de que no se quiera dar permisos de escritura, se debe subir manualmente el fichero en la ruta
//  <BUCKET>/<folder>/dummy.txt"
async function testLectura() {

  let url = await generateV4ReadSignedUrl(bucket, gcp_file_name);
  if (url) {
    console.log(" - Lectura OK. Hay permisos de lectura y generación de URLs [ " + url + " ]")
  } else console.log(" !!! Lectura: fallaron los permisos de lectura o el fichero no existe")
}

async function testDownload(){
  try {
    await bucket.file(gcp_file_name).download({ destination: `downloaded_${file_name}` });
    console.log(" - Descarga OK")
  } catch(e) {
    console.log(" !!! Borrado: fallo en los permisos o no existe el fichero")
  }
}

async function testBorrado () {
  //-------------------------------------------
  //Test borrado fichero+carpeta
  const ff = bucket.file(gcp_file_name);
  try {
    ff.delete();
    console.log(" - Borrado OK")
  } catch(e) {
    console.log(" !!! Borrado: fallo en los permisos o no existe el fichero")
  }
}

async function main(){
  await testEscritura();
  await testLectura();
  await testDownload()
  await testBorrado();
}
main();





