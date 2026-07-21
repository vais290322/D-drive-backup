const AppError = require('../utils/app-error');
const ClientRepository = require('../repository/client-repository');


class ClientService {
    constructor() {
        this.clientRepository = new ClientRepository();
    }

// Fetch all clients
async getAllClients() {
    try {
        const clients = await this.clientRepository.getAllClients();
        if (!clients || clients.length === 0) {
            throw new AppError('NotFoundError', 'No clients found', 'The client collection is empty.', 404);
        }
        return clients;
    } catch (error) {
        throw new Error('Error fetching all clients: ' + error.message);
    }
}
 // Fetch a client by ID
 async getClientById(clientId) {
    try {
        const client = await this.clientRepository.getClientById(clientId);
        if (!client) {
            throw new AppError('NotFoundError', 'Client not found', `Client with ID ${clientId} does not exist`, 404);
        }
        return client;
    } catch (error) {
        throw new Error('Error fetching client by ID: ' + error.message);
    }
}

// Create a new client
 async createClient(clientData) {
    try {
        const newClient = await this.clientRepository.createClient(clientData);
        return newClient;
    } catch (error) {
        throw new Error('Error creating new client: ' + error.message);
    }
}
}

module.exports = ClientService;