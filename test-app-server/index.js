const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const events = require('./events');



const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SomeVeryStrongPass1',
  database: 'brands_rating'
});
connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
});

const port = process.env.PORT || 8000;

var app = express()

app.use(cors())
 /* .use(cors({origin: 'http://localhost:4200'}))
  .use(events(connection));*/

  


app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

app.use(express.json())


  app.route('/api/brand').post((req, res) => {
    connection.query(
      'INSERT INTO Brands (BrandName, BrandDesc) VALUES (?,?)',
      [req.body.BrandName, req.body.BrandDesc],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  })

  app.route('/api/brand').put((req, res) => {
    connection.query(
      'UPDATE Brands SET BrandName = ?, BrandDesc = ? WHERE ID = ?',
      [req.body.BrandName, req.body.BrandDesc, req.body.ID],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  })

  app.route('/api/brand').get((req, res) => {
    connection.query(
      'SELECT * FROM Brands',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  })

  app.route('/api/brand/:ID').delete((req, res) => {
    connection.query(
      'DELETE FROM Brands WHERE ID = ?',
      [req.params.ID],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  })

  /*---------------------------------------------------------------------*/

  

  app.route('/api/brandRating').get((req, res) => {
    connection.query(
      'SELECT BR.ID, BR.BrandID, B.BrandName, BR.Country, BR.Rating FROM BrandsRating BR LEFT JOIN Brands B ON B.ID = BR.BrandID Group BY Country, ID ORDER BY Rating DESC',
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {          
          res.status(200).json(results);
        }
      }
    );
  })

  app.route('/api/brandRating').post((req, res) => {
    connection.query(
      'INSERT INTO BrandsRating (BrandID, Country, Rating) VALUES (?,?, ?)',
      [req.body.BrandID, req.body.Country, req.body.Rating],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  })

  app.route('/api/brandRating').put((req, res) => {
    connection.query(
      'UPDATE BrandsRating SET Country = ?, Rating = ? WHERE ID = ?',
      [req.body.Country, req.body.Rating, req.body.ID],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  })

  app.route('/api/brandRating/:ID').delete((req, res) => {
    connection.query(
      'DELETE FROM BrandsRating WHERE ID = ?',
      [req.params.ID],
      (error, results) => {
        if (error) {
          console.log(error);
          res.status(500).json({status: 'error'});
        } else {
          res.status(200).json(results);
        }
      }
    );
  })