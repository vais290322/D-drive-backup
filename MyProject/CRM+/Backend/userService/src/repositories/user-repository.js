const CrudRepository = require('./curd-repository');
const {User} = require('../models')
class UserRepository extends CrudRepository {

    constructor() {
        super(User);
    }
}

module.exports = UserRepository;