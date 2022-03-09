const saltRounds = 10;

const handleRegister = (req, res, knex, bcrypt) => {
    const { email, name, password} = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('invalid form registration');
    }
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    knex.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email            
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: email,
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })  
    .catch(err => res.status(400).json('Unable to register'));
}

module.exports = {
    handleRegister: handleRegister
};