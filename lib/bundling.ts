import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { createHash } from 'crypto';

import * as cdk from 'aws-cdk-lib';

import { emptyDirSync } from './private/fs'

export interface BundlerConfig {
  without?: string;
  build?: { [gem: string]: string };
}

export interface RubyBundlingProps {
  readonly sourceDirectory: string;
  readonly image: cdk.DockerImage;
  readonly bundlerConfig: BundlerConfig;
  readonly cacheDirectory: string;
}

export class RubyBundling implements cdk.BundlingOptions, cdk.ILocalBundling {
  public readonly image: cdk.DockerImage;
  public readonly command: string[];
  public readonly volumes: cdk.DockerVolume[];
  public readonly environment: { [key: string]: string };

  private static readonly BUNDLING_CACHE_DIR = '/asset-cache';
  private static readonly BUNDLING_SCRIPT = fs.readFileSync(path.join(__dirname, 'bundling.sh'), {encoding: 'utf-8'});
  private static readonly EXCLUDE_FILES = ['/vendor/bundle', '/.bundle/config']

  private readonly fingerprintExtra: string;
  private readonly sourceDirectory: string;
  private readonly buildCacheDirectory: string;

  public constructor(props: RubyBundlingProps) {
    this.fingerprintExtra = JSON.stringify({...props, sourceDirectory: null, buildCacheDirectory: null});

    this.sourceDirectory = props.sourceDirectory;

    const buildCacheKey = createHash('sha256').update(JSON.stringify(props)).digest('hex');
    this.buildCacheDirectory = path.join(props.cacheDirectory, 'build', buildCacheKey);

    this.image = props.image;

    this.volumes = [
      {
        hostPath: props.cacheDirectory,
        containerPath: RubyBundling.BUNDLING_CACHE_DIR,
        consistency: cdk.DockerVolumeConsistency.DELEGATED,
      }
    ];

    const buildoptEnvvars = Object.entries(props.bundlerConfig.build ?? {}).reduce((h, [k, v]) => {
      h[`BUNDLE_BUILD__${k.toUpperCase()}`] = v;
      return h;
    }, {} as {[k: string]: string});

    this.environment = {
      BUNDLING_OUTPUT_DIR: cdk.AssetStaging.BUNDLING_OUTPUT_DIR,
      BUNDLING_CACHE_DIR: RubyBundling.BUNDLING_CACHE_DIR,
      BUNDLE_WITHOUT: props.bundlerConfig.without ?? '',
      ...buildoptEnvvars,
    }

    this.command = ['/bin/sh', '-euc', RubyBundling.BUNDLING_SCRIPT];
  }

  public fingerprint(): string {
    return cdk.FileSystem.fingerprint(this.sourceDirectory, {
      exclude: RubyBundling.EXCLUDE_FILES,
      ignoreMode: cdk.IgnoreMode.GIT,
      extraHash: this.fingerprintExtra,
    })
  }

  public get local(): cdk.ILocalBundling {
    return this;
  }

  public tryBundle(outputDir: string): boolean {
    fs.mkdirSync(this.buildCacheDirectory, {recursive: true});

    cdk.FileSystem.copyDirectory(this.sourceDirectory, outputDir, {
      exclude: RubyBundling.EXCLUDE_FILES,
      ignoreMode: cdk.IgnoreMode.GIT,
    });

    if(!cdk.FileSystem.isEmpty(this.buildCacheDirectory)) {
      process.stderr.write(`Restoring cache from ${this.buildCacheDirectory}...\n`);

      cdk.FileSystem.copyDirectory(this.buildCacheDirectory, outputDir, {
        exclude: ["/*", "!/vendor", "!/vendor/bundle"],
        ignoreMode: cdk.IgnoreMode.GIT,
      });
    }

    const userInfo = os.userInfo();
    const user = userInfo.uid !== -1 ? `${userInfo.uid}:${userInfo.gid}` : '1000:1000';

    this.image.run({
      command: this.command,
      user,
      volumes: [
        {
          hostPath: outputDir,
          containerPath: cdk.AssetStaging.BUNDLING_OUTPUT_DIR,
        },
        ...this.volumes,
      ],
      environment: this.environment,
      workingDirectory: cdk.AssetStaging.BUNDLING_OUTPUT_DIR,
    });

    emptyDirSync(this.buildCacheDirectory);

    cdk.FileSystem.copyDirectory(outputDir, this.buildCacheDirectory, {
      exclude: ["/*", "!/vendor", "!/vendor/bundle"],
      ignoreMode: cdk.IgnoreMode.GIT,
    });

    return true;
  }
}
