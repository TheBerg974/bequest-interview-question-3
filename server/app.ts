import express from "express";
import cors from "cors";
var rs = require('reedsolomon');

function RS(messageLength:number, errorCorrectionLength: number) {
	var dataLength = messageLength - errorCorrectionLength;
	var encoder = new rs.ReedSolomonEncoder(rs.GenericGF.AZTEC_DATA_8());
	var decoder = new rs.ReedSolomonDecoder(rs.GenericGF.AZTEC_DATA_8());
	return {
		dataLength: dataLength,
		messageLength: messageLength,
		errorCorrectionLength: errorCorrectionLength,

		encode : function (message:any) {
			encoder.encode(message, errorCorrectionLength);
		},

		decode: function (message:any) {
			decoder.decode(message, errorCorrectionLength);
		}
	};
}

const PORT = 8080;
const app = express();
const database = { data: new Int32Array()};

app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {

  let ec = RS(database.data.length, 12);

  const decoding = database.data

  ec.decode(decoding);

  console.log('rs decoded');
  console.log(Array.prototype.join.call(decoding));

  const result = {
    data: String.fromCodePoint(...decoding.subarray(0, database.data.length - 12))
  }

  res.json(result);
});

app.post("/", (req, res) => {

  console.log(req.body)
  let encoding =  stringToU32IntArray(req.body.data, 12);

  var ec = RS(req.body.data.length + 12, 12);
  ec.encode(encoding);

  console.log('rs coded');
  console.log(Array.prototype.join.call(encoding));

  database.data = encoding
  res.sendStatus(200);
});


app.post("/corrupt", (req, res) => {
  console.log('corrupted');
  for (var i = 0; i < 4; i++) database.data[ Math.floor(Math.random() * (database.data.length-12)) ] = 0xff;
  console.log(Array.prototype.join.call(database.data));

  const result = {
    data: String.fromCodePoint(...database.data.subarray(0, database.data.length - 12))
  }
  res.json(result);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

function stringToU32IntArray(str: string, paddingSize:number) {

  const totalSize = str.length + paddingSize;
  const result = new Int32Array(totalSize);

  for(let i = 0; i < str.length; i++) {
    result[i] = str.codePointAt(i) || 0;
  }

  return result;
}
