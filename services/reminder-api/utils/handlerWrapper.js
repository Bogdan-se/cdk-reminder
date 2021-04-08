export default (func) => async (event, context, callback) => {
    try {
        const result = await func(event,context);
        callback(null, {
            statusCode: 200,
            body: JSON.stringify(result)
        });
    } catch (error) {
        console.log(error);
        callback(null, {
            statusCode: error.statusCode || 501,
        });
    }
};
