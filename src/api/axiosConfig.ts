import axios from "axios";

const baseURL = 'https://8w6php9t28.execute-api.us-east-1.amazonaws.com'
// const baseURL = 'http://127.0.0.1:3000'
// const baseURL = AWS_URL || 'http://127.0.0.1:3000'

const axiosConfig = axios.create({
    baseURL: baseURL,
})

export default axiosConfig
