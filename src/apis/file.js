const axios = require('axios');
const baseUrl = 'http://localhost:8888';
export const UploadChunk = (formData) => {
    return axios.post(baseUrl + '/chunk-file', formData);
};

export const ChunksState = (md5) => {
    return axios.get(baseUrl + 'chunks-state',
        {
            params: {
                md5: md5,
            },
        });
};

export const MergeChunks = (md5) => {
    return axios.post(baseUrl + '/merge-chunks', {'file-md5': md5});
};
