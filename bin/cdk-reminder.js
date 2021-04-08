#!/usr/bin/env node

const cdk = require('@aws-cdk/core');
const { CdkReminderStack } = require('../lib/cdk-reminder-stack');

const app = new cdk.App();
new CdkReminderStack(app, 'CdkReminderStack');
