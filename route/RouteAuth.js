app.post("/signup", async (req, res) => {
    try {
        let user = await User.create(req.body);
		
        res.status(200).json({message: "User créé"});
    } catch (err) {
        res.status(400).json({ message: "Erreur pendant inscription" });
    }
});
 
app.post("/login", async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            if (req.body.password === user.password) {
                res.status(200).json(user);
            } else {
                res.status(400).json({ message: "Mot de pass invalid" });
            }
        } else res.status(400).json({ message: "User n'éxiste pas" });
    } catch (err) {
        res.status(400).json({ message: "Erreur pendant connexion" });
    }
});