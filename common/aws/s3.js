import AWS from './aws';

class S3Client {
    constructor() {
        this.s3 = new AWS.S3();
    }

    async getItem(bucket, key) {
        const {Body} = await this.s3.getObject({
            Bucket: bucket,
            Key: key,
        }).promise();

        return Body;
    }

    async getJsonItem(bucket, key) {
        const item = await this.getItem(bucket, key);

        return JSON.parse(item.toString());
    }
}

export default new S3Client();
