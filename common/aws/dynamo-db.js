import AWS from './aws';

const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

class DynamoDbClient {
    scan (params) {
       return dynamoDbClient.scan(params).promise();
    }
    get (params) {
        return dynamoDbClient.get(params).promise();
    }

    create (params) {
        return dynamoDbClient.put(params).promise();
    }

    update (params) {
        return dynamoDbClient.update(params).promise();
    }

    delete (params) {
        return dynamoDbClient.delete(params).promise();
    }

    batchWrite (params) {
        return dynamoDbClient.batchWrite(params).promise();
    }
}

export default new DynamoDbClient();

