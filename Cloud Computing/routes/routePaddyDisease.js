const express = require('express');
const numbers = require('nanoid-generate/numbers');
const router = express.Router();
const db = require('./../databaseDanConfignya/connection')


    // read all user details
    router.get("/diseaseDetails", (req, res) => {
        db.query("SELECT * FROM paddy_disease", (error, results) => {
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
        const diseaseId = req.params.id;
      
        db.query(
          "SELECT * FROM paddy_disease WHERE id = ?",
          [diseaseId],
          (error, results) => {
            if (error) {
              console.error("Error retrieving user detail:", error);
              res.status(500).send({ status: "Failed", msg: error });
            } else if (results.length === 0) {
              res.status(404).send({ status: "Failed", msg: "User not found" });
            } else {
              const diseaseDetail = results[0];
              res.status(200).send({ status: "Success", data: diseaseDetail });
            }
          }
        );
      });

// create
    router.post("/create", (req, res) => {
    const disease = {
      id: numbers(10),
      user_id: req.body.user_id,
      nama_penyakit: req.body.nama_penyakit,
      tentang_penyakit: req.body.tentang_penyakit,
      product_recomendation: req.body.product_recomendation,
      timestamp: req.body.timestamp,
    };
  
    db.query("INSERT INTO paddy_disease SET ?", disease, (error, results) => {
      if (error) {
        console.error("Error inserting user details:", error);
        res.status(500).send({ status: "Failed", msg: error });
      } else {
        console.log("User details inserted:", results);
        res.status(200).send({ status: "Success", msg: "Data Saved" });
      }
    });
  });

  module.exports=router;