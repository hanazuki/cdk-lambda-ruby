# CDK Construct Library for AWS Lambda in Ruby

This library provides [AWS CDK](https://github.com/aws/aws-cdk) constructs for AWS Lambda functions written in [Ruby](https://www.ruby-lang.org/).

## Synopsis

```typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaRuby from 'cdk-lambda-ruby';
import { Construct } from 'constructs';

export class ExampleStack extends cdk.Stack {
  public constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new lambdaRuby.RubyFunction(this, 'MyFunction', {
      runtime: lambda.Runtime.RUBY_3_2,
      sourceDirectory: 'function',
      handler: 'main.handler',
      bundlerConfig: {  // optional
        without: 'development:test',  // optional, default: 'development:test'
        build: {  // optional
          'some-gem': '--some-build-option',
        },
      },
    });
  }
}
```

## Description

`RubyFunction` deploys the `sourceDirectory` as a Lambda function written in Ruby. `runtime` is expected to be a Ruby-family Lambda Runtime (i.e., RUBY\_3\_2 at the moment).

If a file named "Gemfile" exists directly inside `sourceDirectory`, the dependency gems are bundled using [Bundler](https://bundler.io/). Bundling is performed inside a [Docker](https://www.docker.com/) container using the Lambda builder images privided by AWS. The `bundlerConfig` prop may have the `without` field to specify a colon-separated list of gem groups to skip installation.

`RubyFunction` also accepts common [FunctionOptions](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda.FunctionOptions.html).

## Caching

The library caches downloaded gems, compiled extensions, and installation trees under "cdk.out/.cache" to optimize synthesis speed. Try delete these files if something unexpected happens.
