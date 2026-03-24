const axios = require('axios');

async function testLogin() {
  try {
    const res = await axios.post('http://127.0.0.1:3001/api/auth/login', {
      email: 'admin@dashads.com',
      password: 'admin123'
    });
    console.log('LOGIN EXITOSO:', res.data.data.user.name);
  } catch (err) {
    console.error('FALLO LOGIN:', err.response?.data || err.message);
  }
}

testLogin();
