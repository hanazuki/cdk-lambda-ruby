import * as cdk from '@aws-cdk/core';

export function appOf(construct: cdk.IConstruct): cdk.App {
  const root = construct.node.root;

  if (!cdk.App.isApp(root)) {
    throw new Error(`Construct does not belong to an App: ${construct.node.path}`);
  }

  return root;
}
