class NotFound extends Error {
    constructor(message) {
        super(message);
        this.name = 'Not found';
        this.message = message || '';
        this.statusCode = 404;
    }
}

export default NotFound;
