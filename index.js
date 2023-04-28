require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jbus5hz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const db = client.db("moontech");
    const productCollection = db.collection("product");

    // get all products
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const product = await cursor.toArray();

      res.send({ status: true, data: product });
    });

    // get single product
    app.get("/product/:_id", async (req, res) => {
      const productId = req.params._id;
      const product = await productCollection.findOne({ _id: ObjectId(productId) });
      res.send({ status: true, data: product });
    });

    // post single product
    app.post("/product", async (req, res) => {
      const product = req.body;

      const result = await productCollection.insertOne(product);

      res.send(result);
    });

    // delete single product
    app.delete("/product/:id", async (req, res) => {
      const id = req.params.id;

      const result = await productCollection.deleteOne({
        _id: ObjectId(id)
      });
      res.send(result);
    });

    // update single product
    // update single product
    app.put("/product/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;

      const result = await productCollection.replaceOne(
        { _id: ObjectId(id) },
        product
      );

      res.send(result);
    });

  } finally {
  }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})