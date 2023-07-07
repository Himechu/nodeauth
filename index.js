import express from "express"
import mongoose from "mongoose"
import User from "./model/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import payload from "payload"
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


// let token = jwt.sign(payload, secret_key);
app.post("/login", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) { 
       
            let isMatch = await bcrypt.compare(
                req.body.password,
                user.password
               
            );
            if (isMatch) {
              // console.log(user)
              let token = jwt.sign({ id: user.id }, 'secret_key',{expiresIn:'1h'});
              res.status(200).json({ token, email: user.email });
          } else {
              res.status(400).json({ message: "Invalid mot de pass" });
          }
      } else res.status(400).json({ message: "User n'éxiste pas" });
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
//                 let token = jwt.sign({ id: user.id }, 'chocolat', {expiresIn: ''});
//                 res.status(200).json({token, email: user.email });
//             } else {
//                 res.status(400).json({ message: "Invalid mot de pass" });
//             }
//         } else res.status(400).json({ message: "User n'éxiste pas" });
//     } catch (err) {
//         res.status(400).json({ message: "Erreur pendant inscription" });
//     }
// });

app.get("/secret", (req, res) => {
    let token = req.headers.authorization.replace("Bearer ", "");
    jwt.verify(token, secret_key, function (err, payload) {
        if (err) {
            res.status(401).json({ message: "Unauthorized" });
        } else res.send("On est validé, on a access a cette Route :D");
    });
})

let port=1200
app.listen(port, ()=>console.log(`le serveur tourne bien sur le port ${port}`))