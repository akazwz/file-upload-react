const axios = require('axios');
const baseUrl = 'http://localhost:8888';

// 上传文件区块
export const UploadChunk = (formData) => {
    return axios.post(baseUrl + '/chunk-file', formData);
};
