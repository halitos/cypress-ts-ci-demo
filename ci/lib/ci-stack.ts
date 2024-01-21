import { Stack, StackProps } from 'aws-cdk-lib';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './pipeline-stage';

export class CiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const baseDirectory = 'ci';

    const pipeline = new CodePipeline(this, 'cypress-ts-pipeline', {
      pipelineName: "cypress-ts-pipeline",
      selfMutation: true,
      synth: new ShellStep('Syhtn', {
        input: CodePipelineSource.gitHub('halitos/cypress-ts-ci-demo', 'main'),
        commands: [`cd ${baseDirectory}`, 'npm ci', 'npx cdk synth --quiet'],
        primaryOutputDirectory: `${baseDirectory}/cdk.out`,
      })
    })


    const e2eStage = pipeline.addStage(new PipelineStage(this, 'E2eStage', {
      stageName: 'E2eTest',
    }))

    e2eStage.addPre(new CodeBuildStep('e2e-test' , {
      commands: [
        'npm ci',
        'npm run cypress:run'
      ]
    }))
  }
}
