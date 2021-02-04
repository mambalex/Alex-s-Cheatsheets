---
title: Terraform
slug: "/terraform"
order: 7
description: Terraform cheatsheet
---

## Basic

```bash
terraform init
terraform plan
terraform apply
terraform apply -auto-approve
```

## Switching Version

```bash
brew install warrensbox/tap/tfswitch
tfswitch
terraform --version
```

## Var files

```bash
cat config/dev.tfvars

name = "dev-stack"
s3_terraform_bucket = "dev-stack-terraform"
tag_team_name = "hello-world"

terraform plan -var-file=config/dev.tfvars
```

## S3 backend

```terraform
terraform {
  backend "s3" {
    encrypt = true
  }
```

```bash
cat config/backend-dev.conf

bucket  = "<account_id>-terraform-states"
key     = "development/service-name.tfstate"
encrypt = true
region  = "ap-southeast-2"
dynamodb_table = "terraform-lock"
```

```bash
env=dev
terraform get -update=true
terraform init -backend-config=config/backend-${env}.conf
terraform plan -var-file=config/${env}.tfvars
terraform apply -var-file=config/${env}.tfvars
```

## Minimum AWS permissions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowSpecifics",
      "Action": [
        "lambda:*",
        "apigateway:*",
        "ec2:*",
        "rds:*",
        "s3:*",
        "sns:*",
        "states:*",
        "ssm:*",
        "sqs:*",
        "iam:*",
        "elasticloadbalancing:*",
        "autoscaling:*",
        "cloudwatch:*",
        "cloudfront:*",
        "route53:*",
        "ecr:*",
        "logs:*",
        "ecs:*",
        "application-autoscaling:*",
        "logs:*",
        "events:*",
        "elasticache:*",
        "es:*",
        "kms:*",
        "dynamodb:*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    },
    {
      "Sid": "DenySpecifics",
      "Action": [
        "iam:*User*",
        "iam:*Login*",
        "iam:*Group*",
        "iam:*Provider*",
        "aws-portal:*",
        "budgets:*",
        "config:*",
        "directconnect:*",
        "aws-marketplace:*",
        "aws-marketplace-management:*",
        "ec2:*ReservedInstances*"
      ],
      "Effect": "Deny",
      "Resource": "*"
    }
  ]
}
```
