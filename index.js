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
    res.send(html);
});

app.get('/api/users', (req, res) => { // for mobile apps or anything // CSR
    res.send(users);
});

app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    res.json(user);
});

app.listen(PORT, ()=>console.log(`Listening to port: ${PORT}`));