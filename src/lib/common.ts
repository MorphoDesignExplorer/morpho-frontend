export function BuildServerURL() {
    if (process.env.ENVIRONMENT && process.env.ENVIRONMENT == 'prod') {
        console.log('prod')
        return "http://backend:8000";
    } else {
        return "http://localhost:8000";
    }
}

