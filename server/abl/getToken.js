function getToken(req, res) {
    try {
        const bearer = req.headers.authorization
        const result =  bearer.split(' ')[1]
        if (result)
            return result
        else
            res.status(401).send({error: 'wrong authorization headers'})
    } catch(e) {
        res.status(401).send({error: 'wrong authorization headers'})
    }
}

module.exports = getToken