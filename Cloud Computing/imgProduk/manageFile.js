const fs = require('fs');

const manageFile = (path)=>{

const fs = require('fs').promises;

const filePath = `imgProduk/${path}`;

fs.unlink(filePath)
  .then(() => {
    console.log('File berhasil dihapus');
  })
  .catch((err) => {
    console.error(err);
  });

}

module.exports = manageFile
