import fs from 'fs'

const storeFS = ( stream, filename ) => {
  const uploadDir = './uploads';
  const path = `${uploadDir}/${filename}`;
  console.log('storing FS')
  return new Promise((resolve, reject) =>
      stream
      .on('error', error => {
        if (stream.truncated)
          // delete the truncated file
          fs.unlinkSync(path);
        reject(error);
      })
      .pipe(fs.createWriteStream(path))
      .on('error', error => reject(error))
      .on('finish', () => resolve({ path }))
  );

}

export default storeFS