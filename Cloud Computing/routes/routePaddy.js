const express = require('express');
const numbers = require('nanoid-generate/numbers');
const verifikasiUser = require('./verifikasi/verivikasi')
const db = require('./../databaseDanConfignya/connection')
const router = express.Router();





// create
router.post("/create", (req, res) => {
    const paddy = {
      id: numbers(10),
      user_id: req.body.user_id,
      img_padi: req.body.img_padi,
      catatan: req.body.catatan,
      deskripsi: req.body.deskripsi,
    };
  
    db.query("INSERT INTO paddy SET ?", paddy, (error, results) => {
      if (error) {
        console.error("Error inserting user details:", error);
        res.status(500).send({ status: "Failed", msg: error });
      } else {
        console.log("User details inserted:", results);
        res.status(200).send({ status: "Success", msg: "Data Saved" });
      }
    });
  });

    // read all user details
    router.get("/paddyDetails", (req, res) => {
        db.query("SELECT id, user_id, img_padi, catatan, deskripsi FROM paddy", (error, results) => {
          if (error) {
            console.error("Error retrieving user details:", error);
            res.status(500).send({ status: "Failed", msg: error });
          } else {
            res.status(200).send({ status: "Success", data: results });
          }
        });
      });

    // read specific user detail
    router.get("/paddyDetail/:id", (req, res) => {
        const paddyId = req.params.id;
      
        db.query(
          "SELECT * FROM paddy WHERE id = ?",
          [paddyId],
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



// update

//router.put("/paddy/update/:id",  verifikasiUser, (req, res) => {
router.put("/update/:id",  (req, res) => {
    const paddyId = req.params.id;
    const updatedPaddy = {
      user_id: req.body.user_id,
      img_padi: req.body.img_padi,
      catatan: req.body.catatan,
      deskripsi: req.body.deskripsi,
    };
  
    db.query(
      "UPDATE paddy SET ? WHERE id = ?",
      [updatedPaddy, paddyId],
      (error, results) => {
        if (error) {
          console.error("Error updating paddy details:", error);
          res.status(500).send({ status: "Failed", msg: error });
        } else {
          console.log("User details updated:", results);
          res.status(200).send({ status: "Success", msg: "Data Updated" });
        }
      }
    );
  });

  // delete
  
 // router.delete("/paddy/delete/:id",  verifikasiUser, (req, res)=> {
  router.delete("/delete/:id",  (req, res)=> {
    const paddyId = req.params.id;
    
    db.query("DELETE FROM paddy WHERE id = ?", [paddyId], (error, results) => {
        if (error) {
            console.error("Error deleting user details:", error);
             res.status(500).send({ status: "Failed", msg: error });
        } else {
            console.log("User details deleted:", results);
            res.status(200).send({ status: "Success", msg: "Data Removed" });
        }
    });
});

module.exports=router;
