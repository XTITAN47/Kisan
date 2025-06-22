// Simple test script to check API connectivity

const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testApiConnection() {
    try {
        console.log('Testing API connection to:', API_URL);

        const response = await axios.get(`${API_URL}`);
        console.log('API Response:', response.data);
        console.log('Connection successful!');
    } catch (error) {
        console.error('API Connection Error:', error.message);
        console.error('Full error:', error);
    }
}

testApiConnection();
