const axios = require('axios');
const login = async (email, password) => {
    let data = JSON.stringify({
        "username": email,
        "password": password
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:4000/auth/login',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        data : data
    };

    const response = await axios.request(config)
        .then((response) => {
            return (JSON.stringify(response.data.token));
        })
        .catch((error) => {
            console.log(error);
        });
    return response;
}

export default login;
