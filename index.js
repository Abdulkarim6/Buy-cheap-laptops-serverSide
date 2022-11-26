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
        const usersCollection = client.db('cheapLaptops').collection('users');
        const buyerBookingProductsCollection = client.db('cheapLaptops').collection('buyerBookingProducts');
        const advertisedProductsCollection = client.db('cheapLaptops').collection('advertisedProducts');


        /* get categories data and send client side */
        app.get('/categories', async (req, res) => {
            const query = {}
            const result = await categoriesCollection.find(query).toArray()
            res.send(result)
        });

        /* get products (id : lenovo, asus, samsung) data from server side */
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { id: id };
            // const query = {}
            const booking = await sellerProductsCollection.find(query).toArray();
            res.send(booking)
        });

        /* send client side created users to database */
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        });

        /* Load Buyer booking product from client side and send database[bookingModal] */
        app.post('/buyerBookingProducts', async (req, res) => {
            const buyerBookingProduct = req.body;
            const result = await buyerBookingProductsCollection.insertOne(buyerBookingProduct)
            res.send(result)

        });

        /* get every seller products collection from database and send client side[MyProducts] */
        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const bookings = await sellerProductsCollection.find(query).toArray();
            res.send(bookings)
        });

        /* get only product category name */
        app.get('/productCategorys', async (req, res) => {
            const query = {}
            const result = await categoriesCollection.find(query).project({ id: 1 }).toArray()
            res.send(result)
        });

        /* added Product to databese from client side */
        app.post('/addedProduct', async (req, res) => {
            const addedProduct = req.body;
            console.log(addedProduct);
            const result = await sellerProductsCollection.insertOne(addedProduct);
            res.send(result)
        });

        /*create this api for deleted Product operation from client side */
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await sellerProductsCollection.deleteOne(query)
            res.send(result)
        });

        /* Advertised Product load from client side and send database */
        app.post('/advertiseProduct', async (req, res) => {
            const product = req.body;
            // console.log(product);
            const result = await advertisedProductsCollection.insertOne(product);
            res.send(result)
        });

        /* get Advertised products from database and send client side */
        app.get('/advertiseProducts', async (req, res) => {
            const query = {};
            const advertiseProducts = await advertisedProductsCollection.find(query).toArray();
            res.send(advertiseProducts)
        });


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