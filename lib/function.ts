import * as path from 'path';

import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

import { BundlerConfig, RubyBundling } from './bundling';
import { appOf } from './private/internal';

export interface RubyFunctionProps extends lambda.FunctionOptions {
  readonly sourceDirectory: string;
  readonly handler: string;
  readonly runtime: lambda.Runtime;

  readonly bundlerConfig?: BundlerConfig;
}

export class RubyFunction extends lambda.Function {
  public static readonly DEFAULT_BUNDLER_CONFIG: BundlerConfig = {
    without: 'development:test',
  };

  public constructor(scope: cdk.Construct, id: string, props: RubyFunctionProps) {
    const cacheDirectory = path.join(process.cwd(), appOf(scope).outdir, '.cache', 'lambda-ruby');

    const bundling = new RubyBundling({
      sourceDirectory: props.sourceDirectory,
      image: props.runtime.bundlingDockerImage,
      bundlerConfig: {...RubyFunction.DEFAULT_BUNDLER_CONFIG, ...props.bundlerConfig},
      cacheDirectory,
    });

    super(scope, id, {
      ...props,
      code: lambda.Code.fromAsset(props.sourceDirectory, {
        bundling,
        assetHash: bundling.fingerprint(),
      }),
    });
  }
};
