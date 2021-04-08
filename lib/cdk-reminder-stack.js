const {Stack} = require('@aws-cdk/core');
const api = require('@aws-cdk/aws-apigateway');
const dynamodb = require('@aws-cdk/aws-dynamodb');
const lambda = require('@aws-cdk/aws-lambda-nodejs');
const { SqsEventSource, S3EventSource } = require('@aws-cdk/aws-lambda-event-sources');
const s3 = require('@aws-cdk/aws-s3');
const sqs = require('@aws-cdk/aws-sqs');

const API_NAME = 'reminder-api'
const TABLE_NAME = 'Reminder';
const QUEUE_NAME = 's3SyncQueue';
const BUCKET_NAME = 'reminder-dev-sync-queue';
const API_PATH = 'services/reminder-api/api';
const S3_SYNC_PATH = 'services/reminder-parser';
const SQS_PROCESSOR_PATH = 'services/reminder-parsed-processor';

class CdkReminderStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    this.createResources();
    this.createReminderApi();
    this.createS3Processor();
    this.createSQSProcessor();
  };

  createResources() {
    this.reminderTable = new dynamodb.Table(this, TABLE_NAME, {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
    });

    this.s3SyncQueue = new sqs.Queue(this, QUEUE_NAME);

    this.bucket = new s3.Bucket(this, BUCKET_NAME);

    this.apiGateway = new api.RestApi(this, API_NAME);
  }

  createReminderApi() {
    const remindersApi = this.apiGateway.root.addResource('reminder');
    const reminderApi = remindersApi.addResource('{id}');

    const listReminderLambda = this.createLambdaWithTableAccess('list', API_PATH);
    remindersApi.addMethod('GET', new api.LambdaIntegration(listReminderLambda));

    const getReminderLambda = this.createLambdaWithTableAccess('getById', API_PATH);
    reminderApi.addMethod('GET', new api.LambdaIntegration(getReminderLambda));

    const createReminderLambda = this.createLambdaWithTableAccess('create', API_PATH);
    remindersApi.addMethod('POST', new api.LambdaIntegration(createReminderLambda));

    const updateReminderLambda = this.createLambdaWithTableAccess('update', API_PATH);
    reminderApi.addMethod('PUT', new api.LambdaIntegration(updateReminderLambda));

    const deleteReminderLambda = this.createLambdaWithTableAccess('delete', API_PATH);
    reminderApi.addMethod('DELETE', new api.LambdaIntegration(deleteReminderLambda));
  }

  createS3Processor() {
    const s3ProcessorLambda = this.createLambdaWithQueueAndS3Access('processS3ToSQS', S3_SYNC_PATH);
    s3ProcessorLambda.addEventSource(new S3EventSource(this.bucket, {
      events: [s3.EventType.OBJECT_CREATED]
    }));
  }

  createSQSProcessor() {
    const sqsProcessorLambda = this.createLambdaWithTableAndQueueAccess('processSqs', SQS_PROCESSOR_PATH);
    sqsProcessorLambda.addEventSource(new SqsEventSource(this.s3SyncQueue));
  }

  createLambdaWithTableAndQueueAccess(name, src) {
    const lambda = this.createLambda(name, src);
    this.addTableAccess(lambda);
    this.addQueueAccess(lambda);

    return lambda;
  }

  createLambdaWithTableAccess(name, src) {
    const lambda = this.createLambda(name, src);
    this.addTableAccess(lambda);

    return lambda;
  }

  createLambdaWithQueueAndS3Access(name, src) {
    const lambda = this.createLambda(name, src);
    this.addQueueAccess(lambda);
    this.addS3Access(lambda);

    return lambda;
  }

  createLambda(name, src) {
    return new lambda.NodejsFunction(this, name, {
      entry: `${src}/${name}.js`,
      handler: 'handler',
      environment: {
        NODE_ENV: 'production',
        REMINDER_TABLE: this.reminderTable.tableName,
        QUEUE_URL: this.s3SyncQueue.queueUrl,
      },
    });
  }

  addQueueAccess(lambda) {
    this.s3SyncQueue.grantSendMessages(lambda);
  }

  addTableAccess(lambda) {
    this.reminderTable.grantReadWriteData(lambda);
  }

  addS3Access(lambda) {
    this.bucket.grantReadWrite(lambda);
  }
}

module.exports = { CdkReminderStack }
