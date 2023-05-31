const fs = require('fs');

const manageFile = (path)=>{

const fs = require('fs').promises;

const filePath = `imgBerita/${path}`;

fs.unlink(filePath)
  .then(() => {
    console.log('File berhasil dihapus');
  })
  .catch((err) => {
    console.error(err);
  });

}

module.exports = manageFile
