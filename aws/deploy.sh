#!/bin/bash

TAG=$1
pip install --user awscli
export PATH=$PATH:$HOME/.local/bin
eval $(aws ecr get-login --region us-east-2 --no-include-email)
docker build -t onyxchain_wallet:$TAG .
docker tag onyxchain_wallet:$TAG 866680356172.dkr.ecr.us-east-2.amazonaws.com/onyxchain_wallet:$TAG
docker push 866680356172.dkr.ecr.us-east-2.amazonaws.com/onyxchain_wallet:$TAG

