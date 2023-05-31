const express = require('express');
const router = express.Router();
const multer  = require('multer');
const verifikasiUser = require('./verifikasi/verivikasi')
const db = require('./../databaseDanConfignya/connection')
const numbers = require('nanoid-generate/numbers');
const manageUserPicture = require('./../userProfile/manageFile');


//config multer untuk upload image user
let imgName = '' //variable global untuk menangkap timeStamp nama gambar
 const upload = multer({ 
  storage: multer.diskStorage({
    destination: 'userProfile/',
    filename: function(req, file, cb) {
      // Mengubah nama file menjadi timestamp + ekstensi asli file
      const timestamp = Date.now();
      imgName = 'user'+'-'+timestamp + '-' + file.originalname;
      cb(null, imgName);
    }
  })
});

router.post("/register",upload.single('img'),(req,res)=>{
  /*
  id:123
    nama:hudzaa
    role:admin
    img: file image
    nomorHP:324
    username:hudzaa
    password:123
    */
  
    const users = {
      id : numbers(3),
      name : req.body.nama,
      img : imgName,
      role : req.body.role,
      nomorHP : req.body.nomorHP,
      username : req.body.username,
      password : req.body.password,
    }

    let query = `SELECT * FROM user WHERE username = '${users.username}'`;
    db.query(query,(err,result)=>{
      if(err){
        res.status(500).send("error ambil data");
      }else{

        if(result.length > 0){

          const filePath = imgName;
          manageUserPicture(filePath)


          res.status(500).send("username telah digunakan");

        }else{
          
          //console.log(result)
          query = `INSERT INTO user (id, nama, img, role, timestamp, nomer_hp, username, password) VALUES ('${users.id}', '${users.name}', '${users.img}', '${users.role}', '', '${users.nomorHP}', '${users.username}', '${users.password}')`;

          db.query(query,(err,results)=>{
            if(err){
              res.status(500).send("error input data " + err);
            }else{
              const response = {
                message : "data berita berhasil di input",
                results : results
              }
              res.status(201).json(response)
            }

          })

        }

      }

    })
  
   
  

});

router.get("/",(req,res)=>{
  const query = "SELECT  * FROM user"

  db.query(query, (err,result)=>{
    if(err){
      res.status(500).send("Gagal mengambil data " + err)
      return
    }
    res.status(200).json(result);
  })
})



router.put("/ubah/", upload.single('img'),(req,res) => {
  //pr harus cek username tersedia apa kaga
  /*
  
  id:107
  nama:hudzaa
  role:admin
  nomorHP:324
  username:hudzaa
  password:123
  img: file
  
  */

  const user = {
    id : req.body.id,
    name : req.body.namq,
    img : "",
    role : req.body.role,
    nomorHP : req.body.nomorHP,
    username : req.body.username,
    password : req.body.password,
  }

  console.log(user.id)


  //cek user
  let query = `SELECT * FROM user WHERE id = '${user.id}'`;
  db.query(query , (err, results) => {
    if(err){
      return res.status(500).send("kesalahan dalam mengambil data user", err)
    }
    else if(results.length <1){
      const response = {
        message : "id user tidak di temukan bang",
      }

      const filePath = imgName;
      manageUserPicture(filePath)

      return res.status(404).json(response)
    }
    else{
      //hapus gamabr lama

      const filePath = results[0].img;
      manageUserPicture(filePath)


      console.log(results)



      console.log('id di temukan, melakukan perubahan data  pada id ' + user.id)
      query = `UPDATE user SET nama = '${user.name}' , img = '${imgName}', role = '${user.role}', 
      username = '${user.username}', password = ${user.password} WHERE user.id = '${user.id}'`
      
      db.query(query, (err,results)=>{
        if(err){
          return res.status(500).send("kesalahan saat merubah data berita ke database" + err)
        }
        const response = {
          message : `data user dengan id : ${user.id} berhasil di update`,
          results : results
        }
        return res.status(200).json(response);
      })
    }
  })
})


router.delete("/delete",verifikasiUser, (req,res)=>{
  /*
  
  {
    pake petik ya bang
    "userId" : ["035","482","881"]
  }
  
  */

  const id = req.body.userId;

  //ambil data img
  
  
  const listId = []
    for(let i=0;i<id.length;i++){
      
      let query2 =`SELECT * FROM user WHERE user.id = ${id[i]}`;
      db.query(query2, async(err,resultUser)=>{
        if(err){
          res.statusCode(500).send("gagal mengambil data user")
        }else{
          if(resultUser.length>0){
            const gambarLama = resultUser[0].img
            const filePath = gambarLama;
            manageUserPicture(filePath)
            //hapus gambar lama
          }

        }
      });


      let message = ""
      const query = `DELETE FROM user WHERE user.id = ${id[i]}`;
      db.query(query, (err,results)=>{
        if(err){
          res.status(200).send("gagal delete data " + err);
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
  


})

router.get("/userDetail/:id",  (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT * FROM user WHERE id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error retrieving user detail:", error);
        res.status(500).send({ status: "Failed", msg: error });
      } else if (results.length === 0) {
        res.status(404).send({ status: "Failed", msg: "User not found" });
      } else {
        const userDetail = results[0];
        res.status(200).send({ status: "Success", data: userDetail });
      }
    }
  );
});

//get user by nama
router.get("/search/nama/:nama", (req,res)=> {
const nama = `%${req.params.nama}%`
const query = `SELECT * FROM user WHERE nama LIKE '${nama}'`
console.log(query)
db.query( query, (err, results)=>{
  if(err){
    res.status(500).send('Terjadi kesalahan saat mengambil data nama user');
  }else{
    res.status(200).json(results)
  }
});
})



router.post("/login",  (req,res)=>{

  const user = {
    id  : "",
    username : req.body.username,
    password : req.body.password,
  }

  const query = `SELECT * FROM user WHERE username = '${user.username}' AND password = ${user.password}`;
    
    db.query(query , (err, results) => {
      if(err){
        return res.status(500).send("gagal melakukan login" + err)
      }
      if(results.length != 0){
        const responUser = {
          id : results[0].id,
          username : user.username,
        }
        jawt.sign(responUser,"himitsu", {expiresIn:'3d'}, (err, token)=>{
            if(err){
              console.log(err)
              res.status(500).send(`err membuat token ${err}`)
              return
            }else{
              const Token = token;
              res.json({
                user:responUser,
                token:Token
              })
              return
            }
          })

      }else{
        return res.status(201).json("username dan password tidak di temukan");
      }
      
    })

})

module.exports = router;
