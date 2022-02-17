#!/usr/bin/env ts-node
import { App } from 'aws-cdk-lib';
import { ExampleStack } from '..';

const app = new App();
new ExampleStack(app, `LambdaRubyExample`);
