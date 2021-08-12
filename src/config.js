module.exports = {
    gitlab: {
        enabled: process.env.gitlab_enabled || false,
        api: process.env.gitlab_api || 'https://gitlab.com/api/v4',
        url: process.env.gitlab_url ||'https://gitlab.com/',
        accessToken: process.env.gitlab_access_token || '',
        projectId: process.env.gitlab_project_id ||''
    }
}