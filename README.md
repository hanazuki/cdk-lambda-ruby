# CDK Construct Library for AWS Lambda in Ruby

This library provides [CDK](https://github.com/aws/aws-cdk) constructs for AWS Lambda functions written in [Ruby](https://www.ruby-lang.org/).

## Synopsis

```typescript
import * as lambda from '@aws-cdk/aws-lambda';
import * as lambdaRuby from 'cdk-lambda-ruby';

new lambdaRuby.RubyFunction(this, 'MyFunction', {
  runtime: lambda.Runtime.RUBY_2_7,
  sourceDirectory: 'function',
  handler: 'main.handler',
  bundlerConfig: {  // optional
    without: 'development:test',  // optional, default: 'development:test'
    build: {  // optional
      'some-gem': '--some-build-option',
    },
  },
});
```

## Description

`RubyFunction` deploys the `sourceDirectory` as a Lambda function written in Ruby. `runtime` is expected to be a Ruby-family Lambda Runtime (i.e., RUBY_2_5 or RUBY_2_7 at the moment).

If a file named "Gemfile" exists directly inside `sourceDirectory`, the dependency gems are bundled using [Bundler](https://bundler.io/). Bundling is performed inside a [Docker](https://www.docker.com/) container using the Lambda builder images privided by AWS. The `bundlerConfig` prop may have the `without` field to specify a colon-separated list of gem groups to skip installation.

`RubyFunction` also accepts common [FunctionOptions](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-lambda.FunctionOptions.html).

## Caching

The library caches downloaded gems, compiled extensions, and installation trees under "cdk.out/.cache" to optimize synthesis speed. Try delete these files if something unexpected happens.
