module.exports = (app, svc, jwt) => {

    app.post('/useraccount/authenticate', async (req, res) => {
        const {login, password} = req.body
        if ((login === undefined) || (password === undefined)) {
            return res.status(400).end()
        }
        svc.validatePassword(login, password)
            .then(authenticated => {
                if (!authenticated) {
                    res.status(401).end()
                    return
                }
                console.log(`${login} authenticated`)
                return res.json({'token': jwt.generateJWT(login)})
            })
            .catch(e => {
                console.log(e)
                return res.status(500).end()
            })
    })

    app.post('/useraccount', async (req, res) => {
        const {displayname, login, password} = req.body
        if ((displayname === undefined) || (login === undefined) || (password === undefined)) {
            return res.status(400).end()
        }
        const user = await svc.get(login)
        if (user != null) {
            return res.status(400).end()
        }
        svc.insert(displayname, login, password)
            .then(res.status(200).end())
            .catch(e => {
                console.log(e)
                return res.status(500).end()
            })
    })

    app.get("/useraccount/refreshtoken", jwt.validateJWT, (req, res) => {
        res.json({'token': jwt.generateJWT(req.user.login)})
    })
}