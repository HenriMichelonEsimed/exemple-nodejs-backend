module.exports = (app, svc, jwt) => {
    app.post('/useraccount/authenticate', async (req, res) => {
        const {login, password} = req.body
        if ((login === undefined) || (password === undefined)) {
            res.status(400).end()
            return
        }
        svc.validatePassword(login, password)
            .then(authenticated => {
                if (!authenticated) {
                    res.status(401).end()
                    return
                }
                res.json({'token': jwt.generateJWT(login)})
            })
            .catch(e => {
                console.log(e)
                res.status(500).end()
            })
    })

    app.get("/useraccount/refreshtoken", jwt.validateJWT, (req, res) => {
        res.json({'token': jwt.generateJWT(req.user.login)})
    })
}