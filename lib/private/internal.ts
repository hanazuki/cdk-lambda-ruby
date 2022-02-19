import { IConstruct } from 'constructs';
import { App } from 'aws-cdk-lib';

export function appOf(construct: IConstruct): App {
  const root = construct.node.root;

  if (!App.isApp(root)) {
    throw new Error(`Construct does not belong to an App: ${construct.node.path}`);
  }

  return root;
}
