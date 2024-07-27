const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");

const { type } = require("express/lib/response");
const { timeStamp } = require("console");

const app = express();
const PORT = 8000;

// Connection
mongoose.connect("mongodb://127.0.0.1:27017/myDatabase")
.then(() => console.log("Connection started"))
.catch((err) => console.log("Mongo error: ", err));

// Schema
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
    },
    gender: {
        type: String,
    }
}, {
    timestamps: true
});

const User = mongoose.model("user", userSchema);

// Middleware 1
app.use(express.urlencoded({extended: false}));

// Middleware 2
app.use((req, res, next) => {
    fs.appendFile(
        'log.txt', 
        `MidWare1 : ${Date.now()} : ${req.ip}, ${req.path}\n`,
        (err) => {
            next();
        }
    );
        
});

// Middleware 3
app.use((req, res, next) => {
    var change = 1; // change this to 1 if api call has to be made. 0 to abort.
    fs.appendFile(
        'log.txt', 
        (change == 1 ? `MidWare2 : ${Date.now()} : ${req.ip}, ${req.path}\n` : `MidWare2 : Abort Call\n`),
        (err) => {
            if(change) {
                next();
            } else {
                return res.end("Abort Call"); 
            }
        } 
    );  
});


// HYBRID SERVER 
app.get("/users", async (req, res) => { // for browsers // SSR
    const allUsers = await User.find({});
    const html = `
    <ul>
        ${allUsers.map((user)=>`<li>${user.firstName} - ${user.email}</li>`).join("")}
    </ul>
    `;
    return res.send(html);
});


app.route('/api/users') // for mobile apps or anything // CSR
    .get(async (req, res) => { 
        const allUsers = await User.find({});
        res.setHeader('X-CreatedBy', `${req.ip}`); // header // explore in google to check inbuilt headers
        return res.json(allUsers);
    })
    .post(async (req, res) => {
        const body = req.body;
        if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {
            return res.status(400).json({msg : "All fields are required!"});
        }
        const result = await User.create({
            firstName: body.first_name,
            lastName: body.last_name,
            email: body.email,
            gender: body.gender,
            jobTitle: body.job_title,
        });
        console.log("user: ", result);
        return res.status(201).json({msg: "success"});
    });

app.route('/api/users/:id') // for mobile apps or anything // CSR
    .get(async (req, res) => {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({msg: "User not found."});
        return res.json(user);
    })
    .patch(async (req, res) => {
        await User.findByIdAndUpdate(req.params.id, {lastName: req.body.last_name});
        return res.json({status: 'Updated'});
    })
    .delete(async (req, res) => {
        await User.findByIdAndDelete(req.params.id);
        return res.json({status: 'Deleted'});
    });


app.listen(PORT, ()=>console.log(`Listening to port: ${PORT}`));