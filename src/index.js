const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');
const app = express();

//convert data into json format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//use ejs as the view engine
app.set('view engine', 'ejs');

//static file
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

//Register user
app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };


    try{

    //check existing user
    const existinguser = await collection.findOne({ name: data.name });
    if (existinguser)
    {
       return res.send("User already exists. Try another name");   
    }
    //else {
        //hashing password
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password,saltRounds);

        data.password = hashedPassword;

        //insert new user to the database
        const userdata = await collection.insertMany([data]);
        console.log(userdata);

        //send success message
        res.send("Registration Successful");
       }
        catch(error){
            console.error(error);
            res.status(500).send("Registration Failed. Contact the admin");
        }
    
    

});

//login user
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await collection.findOne({ name: username });
        if (!user) {
            return res.send("User doesn't exist");
        }

        // Compare password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.send("Invalid credentials. Try again");
        }

        // If login is successful
        res.send("Login Successful");
    } catch (error) {
        console.error(error);
        res.status(500).send("Login Failed. Contact the admin");
    }
});

const port = 5000;

app.listen(port, () => {
    console.log("Server running on port: ${port}");
})