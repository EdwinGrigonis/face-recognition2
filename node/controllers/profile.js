const handlerProfileGET = (req, res, knex) => {
    const { id } = req.params;
    knex.select('*').from('users').where({ id })
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(404).json('Not found');
            }
    })
    .catch(err => res.status(400).json('Unable to get user'));
}

module.exports = {
    handlerProfileGET: handlerProfileGET
};