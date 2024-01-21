import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

interface E2eStackProps extends StackProps {
    stageName?: string
}

export class E2eStack extends Stack {
    constructor(scope: Construct, id: string, props: E2eStackProps) {
        super(scope, id, props);
    }
}