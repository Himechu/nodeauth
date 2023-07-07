import express from "express"
import mongoose from "mongoose"
import User from "./model/User.js"
import bcrypt from "bcrypt";

let app = express()

mongoose.connect(`mongodb+srv://andrea_chalat:AtlasAndrea95^^@cluster0.ogvhdgx.mongodb.net/`, 
{ useNewUrlParser: true, useUnifiedTopology: true }) 
.then (()=> console.log("connexion a la base de donnée etablis"))
.catch(()=> console.log("connexion a la base de donnée echouee"))
app.use(express.json());
app.use(express.urlencoded({extended:true}))


app.post("/signup", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            let user = await User.create(req.body);
		    res.status(200).json({message: "User créé"});
        } else {
            res.status(400).json({ message: "Email deja existant" });
        }

        
    } catch (err) {
        res.status(400).json({ message: "Erreur pendant inscription" });
    }
});
 
// app.post("/login", async (req, res) => {
//     try {
//         let user = await User.findOne({ email: req.body.email });
//         if (user) {
//             if (req.body.password === user.password) {
//                 res.status(200).json(user);
//             } else {
//                 res.status(400).json({ message: "Mot de pass invalid" });
//             }
//         } else res.status(400).json({ message: "User n'éxiste pas" });
//     } catch (err) {
//         res.status(400).json({ message: "Erreur pendant connexion" });
//     }
// });

app.post("/login", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        let isMatch = await bcrypt.compare(req.body.password, user.password);
 
        if (user) {
            if (isMatch) {
                res.status(200).json(user);
            } else {
                res.status(400).json({ message: "Invalid mot de pass" });
            }
        } else res.status(400).json({ message: "Invalid email" });
    } catch (err) {
        res.status(400).json({ message: "Erreur pendant inscription" });
    }
});


// app.post("/login", async (req, res) => {
//     try {
//         let user = await User.findOne({ email: req.body.email });
//         if (user) {
//             let isMatch = await bcrypt.compare(
//                 req.body.password,
//                 user.password
//             );

//             if (isMatch) {
//                 let token = jwt.sign({ id: user.id }, secret_key);
//                 res.status(200).json({ token, email: user.email });
//             } else {
//                 res.status(400).json({ message: "Invalid mot de pass" });
//             }
//         } else res.status(400).json({ message: "User n'éxiste pas" });
//     } catch (err) {
//         res.status(400).json({ message: "Erreur pendant inscription" });
//     }
// });

// app.get("/secret", (req, res) => {
//     res.send("Route spécial pour les user authentifié");
// });

let port=1200
app.listen(port, ()=>console.log(`le serveur tourne bien sur le port ${port}`))