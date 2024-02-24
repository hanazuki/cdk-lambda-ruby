import * as path from 'path';

import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaRuby from 'cdk-lambda-ruby';
import { Construct } from 'constructs';

export interface ExampleStackProps extends cdk.StackProps {
}

export class ExampleStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props?: ExampleStackProps) {
    super(scope, id, props);

    new lambdaRuby.RubyFunction(this, 'RubyFunction3_2', {
      runtime: lambda.Runtime.RUBY_3_2,
      sourceDirectory: path.join(__dirname, '../app'),
      handler: 'main.handler',
    });
  }
}
