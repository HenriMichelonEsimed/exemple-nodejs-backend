const Car = require('./car')

module.exports = (userAccountService, carService) => {
    return new Promise(async (resolve, reject) => {
        try {
            await userAccountService.dao.db.query("CREATE TABLE useraccount(id SERIAL PRIMARY KEY, displayname TEXT NOT NULL, login TEXT NOT NULL, challenge TEXT NOT NULL)")
            await carService.dao.db.query(`CREATE TABLE car (id SERIAL PRIMARY KEY, make TEXT, model TEXT, 
                                        isrunning BOOLEAN, price NUMERIC, builddate DATE,
                                        useraccount_id INTEGER REFERENCES useraccount(id))`)
        }catch(e)  {
            if (e.code === "42P07") { // TABLE ALREADY EXISTS https://www.postgresql.org/docs/8.2/errcodes-appendix.html
                resolve()
            } else {
                reject(e)
            }
            return
        }
        userAccountService.insert("User1", "user1@example.com", "azerty")
            .then(_ => userAccountService.dao.getByLogin("user1@example.com"))
            .then(async user1 => {
                    for (let i = 0; i < 5; i++) {
                        await carService.dao.insert(new Car("Make" + i, "Model" + i, true,
                            Math.floor(Math.random() * 30000),
                            new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)),
                            user1.id
                        ))
                    }
            })
        userAccountService.insert("User2", "user2@example.com", "azerty")
            .then(_ => userAccountService.dao.getByLogin("user2@example.com"))
            .then(async user2 => {
                    for (let i = 0; i < 5; i++) {
                        await carService.dao.insert(new Car("Marque" + i, "Modèle" + i, true,
                            Math.floor(Math.random() * 30000),
                            new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)),
                            user2.id
                        ))
                    }
                    resolve()
            })
    })
}