import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { E2eStack } from "./e2e-stack";

export class PipelineStage extends Stage {
    constructor(scope: Construct, id: string, props: StageProps ) {
        super(scope, id, props)

        new E2eStack(this, 'E2eStack', {
            stackName: props.stageName
        })
    }
}