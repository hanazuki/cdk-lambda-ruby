#!/usr/bin/env ts-node
import * as cdk from '@aws-cdk/core';

import { ExampleStack } from '..';

const app = new cdk.App();
new ExampleStack(app, `LambdaRubyExample`);
