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

        /* send created user to database */
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result)
        });

        /* post client appointment booking to database */
        app.post('/buyerBookingProducts', async (req, res) => {
            const buyerBookingProduct = req.body;
            const result = await buyerBookingProductsCollection.insertOne(buyerBookingProduct)
            res.send(result)

        });

        /* get client bookings and show client side */
        app.get('/products', async (req, res) => {
            const email = req.query.email;
            console.log('pro',email);
            // const query = { email: email };
            // const bookings = await bookingsCollection.find(query).toArray();
            // res.send(bookings)
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