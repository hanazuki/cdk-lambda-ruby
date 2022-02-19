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

    new lambdaRuby.RubyFunction(this, 'RubyFunction2_5', {
      runtime: lambda.Runtime.RUBY_2_5,
      sourceDirectory: path.join(__dirname, '../app'),
      handler: 'main.handler',
    });

    new lambdaRuby.RubyFunction(this, 'RubyFunction2_7', {
      runtime: lambda.Runtime.RUBY_2_7,
      sourceDirectory: path.join(__dirname, '../app'),
      handler: 'main.handler',
    });
  }
}
