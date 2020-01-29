const router = require('express').Router();

const bcrypt = requre('bcryptjs');

const Database = require('./user-model');

const protected = require('./middleware.js');

router.get('/users', protected, (req, res) => {
    Database.find()
        .then(session => {
            res.json(session)
        })
        .catch(error => {
            console.error(error)
            res.sendStatus(500)
        })
})

router.post('/register', (req, res) => {
    let register = req.body
    const hash = bcrypt.hashSync(register.password, 12)

    register.password = hash

    Database.add(register)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(error => {
            res.status(500).json(error)
        })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body
    
    Database.findBy({ username })
        .then(user => {
            if (user && bcrypt.compareSync(password, user.password)) {

                req.session.loggedIn = true
                res.status(200).json({ message: 'Login Success!' })

            } else {

                res.status(401).json({ message: 'Username or Password invalid.' })
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500);
        })
})

router.delete('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy()    
        res.status(204)
    }
})

module.exports = router