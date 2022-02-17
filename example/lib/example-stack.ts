import * as path from 'path';

import { Construct } from 'constructs';
import { Stack, StackProps, aws_lambda as lambda } from 'aws-cdk-lib';
import * as lambdaRuby from 'cdk-lambda-ruby';

export interface ExampleStackProps extends StackProps {
}

export class ExampleStack extends Stack {
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
