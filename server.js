import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;

env.config();

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function randomBackground(){
    $("body").css("background", "/photos/gradient-background2.jpg")
}

app.get("/", (req, res) => {
    res.render("index.ejs");
})


app.get("/register", (req, res) => {
    res.render("register.ejs");
})

app.get("/login", (req, res) => {
    res.render("login.ejs");
})

app.post("/login", async (req, res) => {

        const password = req.body.password.trim();
        const email = req.body.email;

        try{
            const result = await db.query(
                "SELECT * from users where (email, passwords) = ($1, $2)",
                [email, password]
            );

            if(result.rows.lenght > 0)
        {
            const user = result.rows[0];
            res.redirect("/Home", {user: user});
        }

        }catch(err){
            res.send("Incorrect Password");
        }
});

app.post("/register", async (req, res) => {

    const email = req.body.email;
    const password = (req.body.password).trim();
    const confirm_password = req.body.confirm_password.trim();

    const result = await db.query("select email from users where email = ($1)",
    [email]);

    if(result.rows.length > 0){
        res.redirect("/register");
    }

    else{
        if(password === confirm_password){
            db.query("insert into users (email, password) values ($1, $2)",
            [email, password]);
            res.redirect("/login");
        }
        
        else{
            res.redirect("/register");
        }
    }
})

app.listen(port, () => {
    console.log(`Running on port: ${port}`);
})