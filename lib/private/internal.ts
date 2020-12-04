import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';

export function appOf(construct: constructs.IConstruct): cdk.App {
  const node = constructs.Node.of(construct)
  const root = node.root;

  if (!cdk.App.isApp(root)) {
    throw new Error(`Construct does not belong to an App: ${node.path}`);
  }

  return root;
}
