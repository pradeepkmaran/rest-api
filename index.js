const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const PORT = 8000;


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
app.get("/users", (req, res) => { // for browsers // SSR
    const html = `
    <ul>
        ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    return res.send(html);
});


app.route('/api/users') // for mobile apps or anything // CSR
    .get((req, res) => { 
        res.setHeader('X-CreatedBy', `${req.ip}`); // header // explore in google to check inbuilt headers
        return res.send(users);
    })
    .post((req, res) => {
        const body = req.body;
        const newUser = { id: users.length + 1, ...body};
        users.push(newUser);
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            return res.json({status: "success", id: newUser.id});
        })
    });

app.route('/api/users/:id') // for mobile apps or anything // CSR
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id);
        return res.json(user);
    })
    .patch((req, res) => {
        // Update user with ID = id
        return res.json({status: 'Pending'});
    })
    .delete((req, res) => {
        // Delete user with ID = id
        return res.json({status: 'Pending'});
    });


app.listen(PORT, ()=>console.log(`Listening to port: ${PORT}`));