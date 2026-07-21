const axios = require('axios');

const credentials = {
    client_id: 'M2385SCD6K40A_2602241717',
    client_secret: 'YjdlYmRjOGMtNmQyMC00OWQ3LTk2OGEtM2YzYWYwNGNiZTJi',
    client_version: 1,
    grant_type: 'client_credentials'
};

async function testOAuth() {
    const endpoints = [
        'https://api.phonepe.com/apis/identity-manager/v1/oauth/token',
        'https://identity-manager.phonepe.com/v1/oauth/token',
        'https://api-preprod.phonepe.com/apis/identity-manager/v1/oauth/token'
    ];

    for (const url of endpoints) {
        console.log(`Testing: ${url}`);
        try {
            const response = await axios.post(url, credentials, {
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                }
            });
            console.log(`SUCCESS on ${url}:`, response.data);
            return;
        } catch (error) {
            console.error(`FAILED on ${url}:`, error.response?.status, error.response?.data || error.message);
        }
    }
}

testOAuth();
