import { Stack, StackProps } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


    // const baseDirectory = 'ci';

    new CodePipeline(this, 'cypress-ts-pipeline', {
      pipelineName: "cypress-ts-pipeline",
      synth: new ShellStep('Syhtn', {
        input: CodePipelineSource.gitHub('halitos/cypress-ts-ci-demo', 'main'),
        commands: ['npm ci', 'npm run cdk synth --quiet'],
        primaryOutputDirectory: `/cdk.out`,
      })
    })

  }
}
