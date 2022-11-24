const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ertblk.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoriesCollection = client.db('cheapLaptops').collection('categories');
        const sellerProductsCollection = client.db('cheapLaptops').collection('sellerProducts');


        //get categories data and send client side
        app.get('/categories', async (req, res) => {
            const query = {}
            const result = await categoriesCollection.find(query).toArray()
            res.send(result)
        })

        /* get products data from server side */
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { id: id };
            // const query = {}
            const booking = await sellerProductsCollection.find(query).toArray();
            res.send(booking)
        })



    }
    finally {

    }
}
run().catch(err => console.error(err))

app.get('/', async (req, res) => {
    res.send('Laptops server is running')
})

app.listen(port, () => {
    console.log(`Laptops server running on ${port}`);
})