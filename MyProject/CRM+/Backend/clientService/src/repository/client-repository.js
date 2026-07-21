const Client = require('../models/client'); 

class ClientRepository {
    /**
     * Get a single client by its ID
     * @param {String} clientId
     * @returns {Object} Client document
     */
    async getClientById(clientId) {
        return await Client.findById(clientId);
    }

    /**
     * Get all clients, with optional filtering
     * @param {Object} filter Optional query filter
     * @returns {Array} List of clients
     */
    async getAllClients(filter = {}) {
        return await Client.find(filter);
    }

    /**
     * Create a new client
     * @param {Object} data Client data
     * @returns {Object} Created client document
     */
    async createClient(data) {
        const client = new Client(data);
        return await client.save();
    }

    /**
     * Update a client by its ID
     * @param {String} clientId
     * @param {Object} data Fields to update
     * @returns {Object} Updated client document
     */
    async updateClient(clientId, data) {
        return await Client.findByIdAndUpdate(clientId, data, { new: true });
    }

    /**
     * Delete a client by its ID
     * @param {String} clientId
     * @returns {Object} Deletion result
     */
    async deleteClient(clientId) {
        return await Client.findByIdAndDelete(clientId);
    }
}

module.exports = ClientRepository;
