import axios from 'axios';

const pruebaApi = axios.create({
    baseURL: 'http://localhost:3000/',
});

export default pruebaApi;