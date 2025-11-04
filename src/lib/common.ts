export function BuildServerURL() {
    if (process.env.ENVIRONMENT && process.env.ENVIRONMENT == 'prod') {
        return "http://backend:8000";
    } else {
        return "http://localhost:8000";
    }
}

