const express = require("express");
const app = express();
const PORT = 8000;
const users = require("./MOCK_DATA.json");


// HYBRID SERVER 

app.get("/users", (req, res) => { // for browsers // SSR
    const html = `
    <ul>
        ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    return res.send(html);
});


app.route('/api/users')
    .get((req, res) => { // for mobile apps or anything // CSR
        return res.send(users);
    })
    .post((req, res) => {
        // Create new user
        return res.json({status: 'Pending'});
    });

app.route('/api/users/:id')
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