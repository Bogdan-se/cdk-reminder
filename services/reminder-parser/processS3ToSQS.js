import s3Client from '../../common/aws/s3';
import sqsClient from '../../common/aws/sqs';

import {DYNAMODB_BATCH_SIZE} from '../../common/const';

import {chunk, preProcess} from './utils';

export const handler = async ({Records}) => {
    console.log(`Received records ${JSON.stringify(Records)}`);

    await Promise.all(Records.map(async record => {
        try {
            const items = await s3Client.getJsonItem(record.s3.bucket.name, record.s3.object.key);
            console.log(`Got items ${JSON.stringify(items)}`);

            const chunks = chunk(items, DYNAMODB_BATCH_SIZE);

            await Promise.all(chunks.map(async chunk => {
                const message = preProcess(chunk);
                await sqsClient.sendJsonMessage(message);
                console.log(`Message sent ${JSON.stringify(message)}`);
            }));
        } catch (error) {
            console.error(error);
        }
    }));
}
