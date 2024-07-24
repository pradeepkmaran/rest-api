const express = require("express");
const app = express();
const PORT = 8000;
const users = require("./MOCK_DATA.json");


app.get("/users", (req, res) => {
    const html = `
    <ul>
        ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
});

app.listen(PORT, ()=>console.log(`Listening to port: ${PORT}`));