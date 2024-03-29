import { Stack, StackProps } from 'aws-cdk-lib';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './pipeline-stage';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CodeBuildAction } from 'aws-cdk-lib/aws-codepipeline-actions';

export class CiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const artifactBucket = new Bucket(this, 'ArtifactBucket');

    const baseDirectory = 'ci';

    const pipeline = new CodePipeline(this, 'cypress-ts-pipeline', {
      pipelineName: "cypress-ts-pipeline",
      selfMutation: true,
      artifactBucket: artifactBucket,
      synth: new ShellStep('Syhtn', {
        input: CodePipelineSource.gitHub('halitos/cypress-ts-ci-demo', 'main'),
        commands: [`cd ${baseDirectory}`, 'npm ci', 'npx cdk synth --quiet'],
        primaryOutputDirectory: `${baseDirectory}/cdk.out`,
      }),
    })

    const e2eStage = pipeline.addStage(new PipelineStage(this, 'E2eStage', {
      stageName: 'E2eTest',
    }))

    e2eStage.addPre(new ShellStep('e2e-test', {
      commands: [
        // Install Linux dependencies for Cypress
        'apt-get update && apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libnss3 libxss1 libasound2 libxtst6 xauth xvfb',

        // Cache the ~/.cache folder after running npm ci
        'npm ci && mkdir -p ~/.cache && mv ~/.npm/_cacache ~/.cache/Cypress/npm',

        // Cache the ~/.npm directory
        'mkdir -p ~/.npm && [ -d ~/.npm/_cacache ] && mv ~/.npm/_cacache ~/.npm/Cypress || true',

        'npm run cypress:run',
      ]
    }))

    // e2eStage.addPre(new CodeBuildStep('StoreTestResults', {
    //   commands: [
    //     ...
    //   ],
    // }));
  }
}
