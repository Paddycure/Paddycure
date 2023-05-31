const express = require('express');
const router = express.Router();
const verifikasiUser = require('./verifikasi/verivikasi')
const db = require('./../databaseDanConfignya/connection')
const numbers = require('nanoid-generate/numbers');



router.get("/",verifikasiUser,(req,res)=>{
    /* no json body req bang */
    const query = "SELECT * FROM order_table";

    db.query(query, (err,results)=>{
      if(err){
        console.log(`error bang. mengambil data order table`)
        res.status(500).send(`error bang, mengabil data table ${err}`)
      }
      console.log(`berhasil seluruh mengambil data order`)
      res.status(200).json(results);
    })

  });

  //untuk histori order
  router.get("/:idUser",verifikasiUser,(req,res)=>{
    /* no json req bang */
    const idUser = req.params.idUser;
    const query = `SELECT * FROM order_table WHERE user_id ='${idUser}'`;

    db.query(query, (err,results)=>{
      if(err){
        console.log(`error bang. mengambil data order table`)
        res.status(500).send(`error bang, mengabil data table ${err}`)
      }
      console.log(`berhasil bang. mengambil data order by id`)
      res.status(200).json(results);
    })

  });


  router.post("/input",verifikasiUser,(req,res)=>{

    /*
    struktur json request bodu
    {
    "user_id" : "123",
    "jumlah_pesanan" : "100",
    "total_harga" : "100000",
   
    "total_harga_pesanan" : "100000000",
    "biaya_transaksi" : "100002",
    "produk_id" : "123"
    }

    */

    const order = {
      id : numbers(3),
      user_id : req.body.user_id,
      jumlah_pesanan : req.body.jumlah_pesanan,
      total_harga : req.body.total_harga,
     
      total_harga_pesanan : req.body.total_harga_pesanan,
      //timestamp : "",
      biaya_transaksi : req.body.biaya_transaksi,
      produk_id : req.body.produk_id
    }

    const query = "INSERT INTO order_table SET ?";

    db.query(query,order,(err,result)=>{
      if(err){
        console.log("gagal menginput order" );
        res.status(500).json(`gagal menginput order ${err}`)
        return
      }
      res.status(200).json({message : `berhasil menginput data order mendapatkan id ${order.id}`, 
                  result : result})
      console.log(`berhasil menginput order ` )
      return
    })
  })

  router.put("/ubah",verifikasiUser, (req,res)=>{
    /*
    {
    "id" : "116", //id kamu 
    "user_id" : "123",
    "jumlah_pesanan" : "100",
    "total_harga" : "100000",
    "total_harga_pesanan" : "125566",
    "biaya_transaksi" : "100002",
    "produk_id" : "123"
    }
    */ 

    const order = {
      id : req.body.id,
      user_id : req.body.user_id,
      jumlah_pesanan : req.body.jumlah_pesanan,
      total_harga : req.body.total_harga,
      total_harga_pesanan : req.body.total_harga_pesanan,
      timestamp : "",
      biaya_transaksi : req.body.biaya_transaksi,
      produk_id : req.body.produk_id
    }

    console.log(order)

  let query = `SELECT * FROM order_table WHERE id = ${order.id}`;
  db.query(query , (err, results) => {
    if(err){
      return res.status(500).send("gagal bang,kesalahan dalam mengambil data ORDER", err)
    }
    else if(results.length <1){
      const response = {
        message : "id order tidak di temukan bang",
      }
      return res.status(404).json(response)
    }
    else{
      console.log('id order di temukan bang, melakukan perubahan data order pada id ' + order.id)
      query = `UPDATE order_table SET jumlah_pesanan = ${order.jumlah_pesanan}, 
      total_harga = '${order.total_harga}' ,total_harga_pesanan = '${order.total_harga_pesanan}', biaya_transaksi = '${order.biaya_transaksi}', 
      produk_id = '${order.produk_id}' WHERE order_table.id = '${order.id}'`;
      
      db.query(query, (err,results)=>{
        if(err){
          console.log(`gagal merubah data order bang`)
          return res.status(500).send("gagal bang,kesalahan saat merubah data order ke database bang" + err)
        }
        const response = {
          message : `bang udah bang data order dengan id : ${order.id} berhasil di update`,
          results : results
        }
        return res.status(200).json(response);
      })
    }
  })


  })


  router.delete("/delete",verifikasiUser, (req,res) =>{

    /* 
    json request single delete
    "id":["039"]

    Json request mutiple delete
    {
    "id":["039","116","221"]
}
    
    */

    const id = req.body.id
    
    if(id.length == 1){
      //hapus 1 id
  
      const query = `DELETE FROM order_table WHERE id = '${id[0]}'`;
      
      db.query(query , (err, results) => {
        if(err){
          return res.status(500).send("gagal menghapus order " + err)
        }
        if(results.affectedRows == 0){
          const response = {
  
             hapus : false,
              id : id[0],
              message : `id ${id[0]} tidak di temukan `,
              result : results
          }
          return res.status(201).json(response);
        }
        const response = {
          hapus : true,
          id : id[0],
          message : `${id[0]} berhasil di hapus `,
          result : results
        }
        return res.status(201).json(response);
  
      })
      //return res.status(201).json(id)
    }
  
    else{
      //multiple delete
      const listId = []
      for(let i=0;i<id.length;i++){
        let message = ""
        const query = `DELETE FROM order_table WHERE id = '${id[i]}'`;
        db.query(query, (err,results)=>{
          if(err){
            res.status(200).send("gagal delete data" + err);
            return 0
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
    }
  
  });


module.exports = router;