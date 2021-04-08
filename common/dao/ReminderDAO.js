import dynamoDbClient from '../aws/dynamo-db';
import {v4}  from 'uuid';

const REMINDER_TABLE = process.env.REMINDER_TABLE;

class ReminderDAO {
    async list () {
        const params = {
            TableName: REMINDER_TABLE,
        };

        const { Items } = await dynamoDbClient.scan(params);

        return Items;
    }

    async getById (id) {
        const params = {
            TableName: REMINDER_TABLE,
            Key: {
                id,
            },
        };

        const { Item } = await dynamoDbClient.get(params);

        return Item;
    }

    async create (item) {
        const params = {
            TableName: REMINDER_TABLE,
            Item: {
                id: v4(),
                ...item,
            },
        };

        await dynamoDbClient.create(params);

        return params.Item;
    }

    async update (id, {label}) {
        const params = {
            TableName: REMINDER_TABLE,
            Key: {
                id,
            },
            ExpressionAttributeValues: {
                ':label': label,
            },
            UpdateExpression: 'SET label = :label',
            ReturnValues: 'ALL_NEW',
        };

        const {Attributes} = await dynamoDbClient.update(params);
        return Attributes;
    }

    async delete (id) {
        const params = {
            TableName: REMINDER_TABLE,
            Key: {
                id,
            },
        };
        return dynamoDbClient.delete(params);
    }

    async bulkCreate (items) {
        const params = {
            RequestItems: {
                [REMINDER_TABLE]: items.map(item => ({
                    PutRequest: {
                        Item: item
                    }
                }))
            }
        };

        return dynamoDbClient.batchWrite(params);
    }
}

export default new ReminderDAO();
