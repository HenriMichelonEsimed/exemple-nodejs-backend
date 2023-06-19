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
        }
    })
}