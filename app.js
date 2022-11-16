const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const morgan = require("morgan");
const cors = require("cors");

require("dotenv").config();

const path = __dirname + "/views/";

const app = express();

app.use(express.static(path));
app.use(morgan("tiny"));
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
  port: process.env.DB_PORT,
});

connection.connect();

app.get("/", (req, res) => {
  res.sendFile(path + "index.html");
});

app.get("/fetch", (req, res) => {
  let units;
  let lga;
  let wards;
  let parties;
  connection.query(
    "SELECT polling_unit_number , uniqueid ,polling_unit_name FROM polling_unit WHERE polling_unit_number != ''",
    function (error, results, fields) {
      if (error) throw error;
      units = results;
    }
  );
  connection.query(
    "SELECT lga_id ,lga_name FROM lga",
    function (error, results, fields) {
      if (error) throw error;
      lga = results;
    }
  );
  connection.query(
    "SELECT ward_id ,ward_name FROM ward",
    function (error, results, fields) {
      if (error) throw error;
      wards = results;
    }
  );
  connection.query(
    "SELECT partyid FROM party",
    function (error, results, fields) {
      if (error) throw error;
      parties = results;
      return res.json({
        error: false,
        units: units,
        lgas: lga,
        wards: wards,
        parties: parties,
      });
    }
  );
});

app.get("/units/:id", (req, res) => {
  id = req.params.id;
  connection.query(
    {
      sql: "SELECT party_abbreviation, party_score FROM announced_pu_results WHERE polling_unit_uniqueid = ?",
      values: [id],
    },
    function (error, results, fields) {
      if (error) throw error;
      return res.json({
        error: false,
        results: results,
      });
    }
  );
});

app.get("/lgas/:id", (req, res) => {
  id = req.params.id;
  connection.query(
    {
      sql: "SELECT party_abbreviation, party_score FROM announced_pu_results WHERE polling_unit_uniqueid IN ( SELECT uniqueid FROM polling_unit WHERE lga_id = ?) ",
      values: [id],
    },
    function (error, results, fields) {
      if (error) throw error;
      return res.json({
        error: false,
        results: results,
      });
    }
  );
});

app.post("/unit", (req, res) => {
  let data = req.body;
  let uniqueid;
  connection.query(
    {
      sql: "INSERT INTO `polling_unit` (`polling_unit_id`, `ward_id`, `lga_id`, `uniquewardid`, `polling_unit_number`, `polling_unit_name`, `polling_unit_description`, `lat`, `long`, `entered_by_user`, `date_entered`, `user_ip_address`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      values: [
        0,
        data.ward_id,
        data.lga_id,
        0,
        data.polling_unit_number,
        data.polling_unit_name,
        "",
        data.lat,
        data.long,
        null,
        null,
        null,
      ],
    },
    function (error, results, fields) {
      if (error) throw error;
      uniqueid = results.insertId;
      data.parties.forEach((party) => {
        connection.query(
          {
            sql: "INSERT INTO `announced_pu_results` (`polling_unit_uniqueid`, `party_abbreviation`, `party_score`, `entered_by_user`, `date_entered`, `user_ip_address`) VALUES (?, ?, ?, ?, STR_TO_DATE(?, '%m-%d-%Y'), ?)",
            values: [uniqueid, party.name, party.count, "", "10-17-2021", ""],
          },
          function (error, results, fields) {
            if (error) throw error;
          }
        );
      });
      return res.json({
        error: false,
      });
    }
  );
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
