const ClientService = require('../service/client-service')
const clientService = new ClientService();
const {StatusCodes} = require('http-status-codes');
const createClient = async(req, res)=>{
  try {
    const clientData = req.body;
    console.log(clientData)
    const client = await clientService.createClient(clientData);
    res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Client created successfully',
        data: client
    
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to create client',
        error: error.message});
  }
}

module.exports = {
    createClient,
}