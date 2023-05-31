const express = require('express');
const numbers = require('nanoid-generate/numbers');
const db = require('./../databaseDanConfignya/connection')
const verifikasiUser = require('./verifikasi/verivikasi');
const router = express.Router();
const multer  = require('multer');
const manageProdukPicture = require('./../imgProduk/manageFile');

//config multer untuk upload image product
let multerImgProduk = '' //variable global untuk menangkap timeStamp nama gambar
const uploadImgProduk = multer({ 
 storage: multer.diskStorage({
   destination: 'imgProduk/',
   filename: function(req, file, cb) {
     // Mengubah nama file menjadi timestamp + ekstensi asli file
     const timestamp = Date.now();
     multerImgProduk = 'produk'+'-'+timestamp + '-' + file.originalname;
     cb(null, multerImgProduk);
   }
 })
});

// Endpoint untuk mendapatkan semua barang
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM produk';
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.send(result);
  });
});

  // read specific user detail
  router.get("/produkDetail/:id", (req, res) => {
    const produkId = req.params.id;
  
    db.query(
      "SELECT * FROM produk WHERE id = ?",
      [produkId],
      (error, results) => {
        if (error) {
          console.error("Error retrieving user detail:", error);
          res.status(500).send({ status: "Failed", msg: error });
        } else if (results.length === 0) {
          res.status(404).send({ status: "Failed", msg: "produk not found" });
        } else {
          const userDetail = results[0];
          res.status(200).send({ status: "Success", data: userDetail });
        }
      }
    );
  });

// get produk by nama produk
router.get("/search/nama_produk/:nama_produk", (req, res)=> {
  const namaProduk = `%${req.params.nama_produk}%`
  const query = `SELECT * FROM produk WHERE nama_produk LIKE '${namaProduk}'`
  console.log(query)
  db.query(query, (err, results)=>{
    if(err){
      res.status(500).send('Terjadi kesalahan saat mengambil data')
    }else{
      res.status(200).json(results)
    }
  });
})

// create
router.post("/insert-produk",uploadImgProduk.single('img'),verifikasiUser,(req, res) => {
    const produk = {
      id: numbers(3),
      user_id: req.body.user_id,
      id_produk: req.body.id_produk,
      img_produk: multerImgProduk,
      harga_produk: req.body.harga_produk,
      detail_produk: req.body.detail_produk,
      stok_produk: req.body.stok_produk,
    };

    // console.log(req.body)

    // res.send("tes")
    // return

    let query = `INSERT INTO produk (id, user_id, id_produk, img_produk, harga_produk, timestamp, detail_produk, stok_produk) VALUES ('${produk.id}', '${produk.user_id}', '${produk.id_produk}', '${produk.img_produk}', '${produk.harga_produk}', '', '${produk.detail_produk}', '${produk.stok_produk}')`;
  
    db.query( query, (error, results) => {
      if (error) {
        console.error("Error inserting user details:", error);
        res.status(500).send({ status: "Failed", msg: error });

        const filePath = multerImgProduk;
        manageProdukPicture(filePath);


      } else {
        console.log("User details inserted:", results);
        res.status(200).send({ status: "Success", msg: "Data Saved" });
      }
    });
  });

    // update
    
//router.put("/produk/update/:id", verifikasiUser, (req, res) => {
    router.put("/update/:id",uploadImgProduk.single('img'), verifikasiUser ,(req, res) => {
      const produkId = req.params.id;
      const updatedProduk = {
        user_id: req.body.user_id,
        id_produk: req.body.id_produk,
        img_produk: multerImgProduk,
        harga_produk: req.body.harga_produk,
        detail_produk: req.body.detail_produk,
        stok_produk: req.body.stok_produk,
      };

      //cek produk lama
      let query = `SELECT * FROM produk WHERE id = ${produkId}`;
      db.query(query , (err, results) => {
        if(err){
          
          const filePath = multerImgProduk;
          manageProdukPicture(filePath)
    
          return res.status(500).send("kesalahan dalam mengambil data produk", err)
        }
        else if(results.length <1){
          
          const response = {
            message : "id produk tidak di temukan bang "+produkId,
            
          }
          res.status(404).json(response)
    
          const filePath = multerImgProduk;
          manageProdukPicture(filePath)

    
          return
    
        }
        else{
    
          const filePath = results[0].img_produk;
          manageProdukPicture(filePath)
        
          console.log('id produk di temukan, melakukan perubahan data berita pada id ' + produkId)
          query = `UPDATE produk SET user_id = '${updatedProduk.user_id}', id_produk = '${updatedProduk.id_produk}', img_produk = '${updatedProduk.img_produk}', harga_produk = '${updatedProduk.harga_produk}', detail_produk = '${updatedProduk.detail_produk}', stok_produk = '${updatedProduk.stok_produk}' WHERE produk.id = '${produkId}'`
          
          db.query(query, (err,results)=>{
            if(err){
              return res.status(500).send("kesalahan saat merubah data berita ke database" + err)
            }
            const response = {
              message : `data berita dengan id : ${produkId} berhasil di update`,
              results : results
            }
            return res.status(200).json(response);
          })
        }
      })
    })
    
    
  // delete
 // router.delete("/produk/delete/:id", verifikasiUser,  (req, res)=> {
  router.delete("/delete", (req, res)=> {
    const produkId = req.body.id;

    const respon =[]

    for(let i=0;i<produkId.length;i++){


        let query2 =`SELECT * FROM produk WHERE id = ${produkId[i]}`;
        db.query(query2, async(err,resultProduk)=>{
            if(err){
            res.statusCode(500).send("gagal mengambil data produk")
            }else{
            if(resultProduk.length>0){
                const gambarLama = resultProduk[0].img_produk
                const filePath = gambarLama;
                manageProdukPicture(filePath);
                //hapus gambar lama
            }

            }
        });

        

        db.query("DELETE FROM produk WHERE id = ?", [produkId[i]], (error, results) => {
            if (error) {
                console.error("Error deleting user details:", error);
                res.status(500).send("gagal delete bang")
            } else {
                if(results.affectedRows == 0){
                    const message = {
                        hapus : false,
                        id : produkId[i],
                        result : results
                    }
                    respon.push(message)
                }else{
                    const message = {
                        hapus : true,
                        id : produkId[i],
                        result : results
                    }
                    respon.push(message)
                }

                if(i == produkId.length-1){
                    return res.status(200).json(respon)
                  }
               
            }
          });
    }
    
    });

   
    
   

module.exports=router;