const express = require('express');
const router = express.Router();
const multer  = require('multer');
const verifikasiUser = require('./verifikasi/verivikasi')
const db = require('./../databaseDanConfignya/connection')
const numbers = require('nanoid-generate/numbers');
const manageBeritaPicture = require('./../imgBerita/manageFile')

//AMBIL DATA all by judul dan by isi
//get semua berita 
router.get("/",(req, res) =>{
    db.query('SELECT * FROM berita', (err, results) => {
      if (err) {
        console.error('Kesalahan saat melakukan query: ', err);
        res.status(500).send('Terjadi kesalahan saat mengambil data');
      } else {
        res.status(200).json(results);
      }
    }); 
  });
  
  //get berita by judul
  router.get("/search/judul/:judul", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/judul/judul bang
    const judul = `%${req.params.judul}%`
    const query = `SELECT * FROM berita WHERE judul_berita LIKE '${judul}'`
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(500).send('Terjadi kesalahan saat mengambil data judul berita');
      }else{
        res.status(200).json(results)
      }
    });
  })
  
  //get berita by penulis
  router.get("/search/penulis/:penulis", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/penulis/nama penulis bang
    const penulis = `%${req.params.penulis}%`
    const query = `SELECT * FROM berita WHERE penulis LIKE '${penulis}'`
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(500).send('Terjadi kesalahan saat mengambil data penulis berita');
      }else{
        res.status(200).json(results)
      }
    });
  })
  
  // get berita by isi
  router.get("/search/isi/:isi", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/isi/isi berita bang
    const isi = `%${req.params.isi}%`
    const query = `SELECT * FROM berita WHERE isi_berita LIKE '${isi}'`
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(500).send('Terjadi kesalahan saat mengambil data isi berita');
      }else{
        res.status(200).json(results)
      }
    });
  })
  
  //get berita by imagename
  router.get("/search/image/:image", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/image/string image bang
    const image = `%${req.params.image}%`
    const query = `SELECT * FROM berita WHERE img_berita LIKE '${image}'`
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(500).send('Terjadi kesalahan saat mengambil data image berita');
      }else{
        res.status(200).json(results)
      }
    });
  })
  
  //get berita by timeStamp
  router.get("/search/timeStamp/:timeStamp", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/timeStamp/2023
    const timeStamp = `%${req.params.timeStamp}%`
    const query = `SELECT * FROM berita WHERE timeStamp LIKE '${timeStamp}'`
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(500).send('Terjadi kesalahan saat mengambil data timeStamp berita');
      }else{
        res.status(200).json(results)
      }
    });
  })
  
  
  //get Berita by ID
  router.get("/search/id/:id", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/id/123
    const id = `${req.params.id}`
    const query = `SELECT * FROM berita WHERE id = '${id}'`
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(500).send('Terjadi kesalahan saat mengambil data id berita');
      }else{
        res.status(200).json(results)
      }
    });
  })
  
  /////////////////POST////////////////////////////////////
  
  //config multer untuk upload image berita
  let mulerImgBerita = '' //variable global untuk menangkap timeStamp nama gambar
  const uploadImgBerita = multer({ 
   storage: multer.diskStorage({
     destination: 'imgBerita/',
     filename: function(req, file, cb) {
       // Mengubah nama file menjadi timestamp + ekstensi asli file
       const timestamp = Date.now();
       mulerImgBerita = 'berita'+'-'+timestamp + '-' + file.originalname;
       cb(null, mulerImgBerita);
     }
   })
  });
  
  
  
  
  //insert Berita
  router.post("/input", uploadImgBerita.single('img') ,verifikasiUser, (req, res) => {
    /*
    json body req bang
  
    {
      "judul": "berita saya2",
      "penulis": "penulis2",
      "isi": "ini adalah isi berita bang2",
      "img": file
  }
    */
  
  
  
  
    console.log(req.body)
    const berita = {
      id: numbers(3),
      judul_berita: req.body.judul,
      penulis : req.body.data.id,
      isi_berita : req.body.isi,
      img_berita : mulerImgBerita,
    };
     const query = "INSERT INTO berita SET ?";
     //const query = `INSERT INTO berita (id, judul_berita, penulis, isi_berita, img_berita, timestamp) VALUES ('${berita.id}', '${berita.judul}', '${berita.penulis}', '${berita.isi}', '${berita.image}', '${berita.timeStamp}');`
  
    db.query( query,berita,(err, results) => {
      if (err) {
        console.error('Kesalahan saat melakukan query: ', err);
        res.status(500).send('Terjadi kesalahan saat menginput data');
        const filePath = mulerImgBerita;
        manageBeritaPicture(filePath)
  
      } else {
        const response = {
          message : "data berita berhasil di input",
          results : results
        }
        res.status(201).json(response)
      }
    });
  
    //return res.status(200).send("Hai there");
  
  });
  
  router.put("/ubah/",uploadImgBerita.single('img'),verifikasiUser, (req,res) => {
    const berita = {
      id: req.body.id,
      judul_berita: req.body.judul,
      penulis : req.body.data.id,
      isi_berita : req.body.isi,
      img_berita : mulerImgBerita,
    };
  
   
    //cek berita
    let query = `SELECT * FROM berita WHERE id = ${berita.id}`;
    db.query(query , (err, results) => {
      if(err){
        
        const filePath = mulerImgBerita;
        manageBeritaPicture(filePath)
  
        return res.status(500).send("kesalahan dalam mengambil data berita", err)
      }
      else if(results.length <1){
        
        const response = {
          message : "id berita tidak di temukan bang",
          
        }
        res.status(404).json(response)
  
        const filePath = mulerImgBerita;
        manageBeritaPicture(filePath)
  
        return
  
      }
      else{
  
        const filePath = results[0].img_berita;
        manageBeritaPicture(filePath)
  
        console.log('id berita di temukan, melakukan perubahan data berita pada id ' + berita.id)
        query = `UPDATE berita SET judul_berita = '${berita.judul_berita}' , penulis = '${berita.penulis}', isi_berita = '${berita.isi_berita}', 
        img_berita = '${berita.img_berita}' WHERE berita.id = '${berita.id}'`
        
        db.query(query, (err,results)=>{
          if(err){
            return res.status(500).send("kesalahan saat merubah data berita ke database" + err)
          }
          const response = {
            message : `data berita dengan id : ${berita.id} berhasil di update`,
            results : results
          }
          return res.status(200).json(response);
        })
      }
    })
  })
  
  
  /////////////// DELETE //////////////////////////
  router.delete("/delete", verifikasiUser, async (req,res) =>{
    const id = req.body.id
    
  
      
      //multiple delete
      const listId = []
      for(let i=0;i<id.length;i++){

        let query2 =`SELECT * FROM berita WHERE berita.id = ${id[i]}`;
        db.query(query2, async(err,resultUser)=>{
            if(err){
            res.statusCode(500).send("gagal mengambil data user")
            }else{
            if(resultUser.length>0){
                const gambarLama = resultUser[0].img_berita
                const filePath = gambarLama;
                manageBeritaPicture(filePath)
                //hapus gambar lama
            }

            }
        });
        

        let message = ""
        const query = `DELETE FROM berita WHERE berita.id = ${id[i]}`;
        db.query(query, (err,results)=>{
          if(err){
            res.status(200).send("gagal delete data");
          }else if (results.affectedRows == 0){
            message = {
              hapus : false,
              id : id[i],
              message : `id ${id[i]} tidak di temukan `,
              result : results
            }
          }else{
            message = {
              hapus : true,
              id : id[i],
              message : `${id[i]} berhasil di hapus `,
              result : results
            }
  
  
          }
          listId.push(message)
          //console.log(message)
  
          if(i == id.length-1){
            res.status(200).json(listId)
          }
  
        })
       
      }
  
      //res.status(200).send("gagal delete data");
    
  
  });
  
  module.exports = router;