const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");
const app = express();
const PORT = 8000;


// Middleware
app.use(express.urlencoded({extended: false}));

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