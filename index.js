const express = require("express");
const app = express();
const port = process.env.PORT || 9999;
const cors = require("cors");
const bodyParser = require("body-parser");
// require('dotenv').config();
const ObjectId = require("mongodb").ObjectId;
app.use(cors());
app.use(bodyParser.json());

const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://newsAdmin:newsAdmin88@cluster0.2owca.mongodb.net/dailyNews?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const firstCollection = client.db("dailyNews").collection("currentNews");
  const categoryCollection = client.db("dailyNews").collection("addCategory");
  const postCollection = client.db("dailyNews").collection("post");
  const userCollection = client.db("dailyNews").collection("user");
  // const firstCollection = client.db("dailyNews").collection("currentNews");
  // perform actions on the collection object
  // category get
  // addPost
  app.post("/addPost", (req, res) => {
    const newEvent = req.body;
    console.log("adding new event: ", newEvent);
    postCollection.insertOne(newEvent)
    .then((result) => {
      console.log("inserted count", result);
      res.send(result.insertedId);
    });
  });
  // get posts
  app.get("/posts", (req, res) => {
    postCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  // get posts using params
  app.get('/posts/:id', (req, res) => {
    postCollection.find({_id: ObjectId(req.params.id)})
    .toArray ( (err, documents) =>{
      res.send(documents[0]);
    })
  })
  // post delete
  app.delete('/deletePost/:id', (req, res) => {
    const id = (req.params.id);
    console.log('delete this', id);
    postCollection.deleteOne({_id: ObjectId(id)})
    .then(documents => {
      console.log(documents);
      if(documents.deletedCount>0){
      res.send("Deleted");
      }
    })
  })
  // update post
  
  app.patch('/updatePost/:id', (req, res) => {
    console.log(req.body);
    postCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {title: req.body.title, description: req.body.description, category: req.body.category, imgUrl: req.body.imgUrl}
    })
    .then (result => {
      console.log(result);
      res.send(result)
    })
  })
  // Category
  // get categories
  app.get("/categories", (req, res) => {
    categoryCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  // get categories using params
  app.get('/categories/:id', (req, res) => {
    categoryCollection.find({_id: ObjectId(req.params.id)})
    .toArray ( (err, documents) =>{
      res.send(documents[0]);
    })
  })
  // category post
  app.post("/addCategory", (req, res) => {
    const newEvent = req.body;
    console.log("adding new event: ", newEvent);
    categoryCollection.insertOne(newEvent)
    .then((result) => {
      res.redirect('http://localhost:9999/category');
    });
  });
  // category delete
  app.delete('/deleteCategory/:id', (req, res) => {
    const id = (req.params.id);
    console.log('delete this', id);
    categoryCollection.deleteOne({_id: ObjectId(id)})
    .then(documents => {
      console.log(documents);
      if(documents.deletedCount>0){
      res.send("Deleted");
      }
    })
  })
  // category Update
  app.patch('/updateCategory/:id', (req, res) => {
    console.log(req.body);
    categoryCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {category: req.body.category}
    })
    .then (result => {
      console.log(result);
      res.send(result)
    })
  })

  // Users
  // addUser
  app.post("/addUser", (req, res) => {
    const newEvent = req.body;
    console.log("adding new event: ", newEvent);
    userCollection.insertOne(newEvent)
    .then((result) => {
      console.log("inserted count", result);
      res.send(result.insertedId);
    });
  });
  // get users
  app.get("/users", (req, res) => {
    userCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
    // get user using params
    app.get('/users/:id', (req, res) => {
      userCollection.find({_id: ObjectId(req.params.id)})
      .toArray ( (err, documents) =>{
        res.send(documents[0]);
      })
    })
  // delete user
  app.delete('/deleteUser/:id', (req, res) => {
    const id = (req.params.id);
    console.log('delete this', id);
    userCollection.deleteOne({_id: ObjectId(id)})
    .then(documents => {
      console.log(documents);
      if(documents.deletedCount>0){
      res.send("Deleted");
      }
    })
  })
  // update users
   // user Update
   app.patch('/updateUser/:id', (req, res) => {
    console.log(req.body);
    userCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {fName: req.body.fName, lName: req.body.lName, username: req.body.username, role: req.body.role}
    })
    .then (result => {
      console.log(result);
      res.send(result)
    })
  })
});

app.get("/", (req, res) => {
  res.send("Allahor name suru!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
