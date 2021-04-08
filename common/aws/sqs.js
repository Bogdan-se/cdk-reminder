import AWS from './aws';

class SQSClient {
    constructor() {
        this.sqs = new AWS.SQS();
    }

    async sendJsonMessage(message) {
        const result = await this.sqs.sendMessage({
            MessageBody: JSON.stringify(message),
            QueueUrl: process.env.QUEUE_URL
        }).promise();
        console.log(message);
        console.log(result);

        return result;
    }
}

export default new SQSClient();
