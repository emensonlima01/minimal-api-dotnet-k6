export const environments = {
    dev: {
        baseUrl: 'http://localhost:5000',
        name: 'Development',
    },
    staging: {
        baseUrl: 'http://staging-api.example.com',
        name: 'Staging',
    },
    prod: {
        baseUrl: 'http://api.example.com',
        name: 'Production',
    },
};

export function getEnvironment() {
    const env = __ENV.ENVIRONMENT || 'dev';
    return environments[env] || environments.dev;
}

export const BASE_URL = __ENV.API_URL || getEnvironment().baseUrl;
