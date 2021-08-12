const axios = require('axios').default;
const qs = require('qs');
const config = require('../config');

function createIssue(title, description, file, startLine, endLine, help) {
    return new Promise((resolve, reject) => {
        const data = {
            id: config.gitlab.projectId.replace("/","%2F"),
            title,
            description: ''
        };

        data.description = `**Description:** ${description}\n\n`;
        data.description+= `**File:** ${file}@${startLine}:${endLine}\n\n`;
        data.description+= help ? `**Reference:** ${help}`:'';

        const headers = {
            'Content-Length': data.length,
            'PRIVATE-TOKEN': config.gitlab.accessToken,
            'authorization': config.gitlab.accessToken
        }
    
        axios.post(`${config.gitlab.api}/projects/${data.id}/issues`, qs.stringify(data), { headers })
            .then(response => {
                if(response.data && response.data.id) {
                    resolve(response.data.web_url); 
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports = { createIssue }