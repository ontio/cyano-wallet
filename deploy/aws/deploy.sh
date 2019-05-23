#!/bin/bash

TAG=$1
pip install --user awscli
export PATH=$PATH:$HOME/.local/bin
eval $(aws ecr get-login --region us-east-2 --no-include-email)
docker push 866680356172.dkr.ecr.us-east-2.amazonaws.com/wallet:$TAG
CLUSTER=OnyxChain-wallet
SERVICE=wallet
if [[ $TAG = "prod" ]]
then 
	CLUSTER=OnyxChain-wallet-prod
fi

aws ecs update-service --cluster $CLUSTER --region us-east-2 --force-new-deployment  --service $SERVICE

