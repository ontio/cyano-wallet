FROM ubuntu:18.04
MAINTAINER toktor <ak.toktor@gmail.com>

RUN apt-get update ; apt-get install -y curl && apt install -y nodejs npm && \
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
apt update && apt install -y yarn && \
apt install -y git

RUN git clone https://github.com/OnyxPay/OnyxChain-wallet.git && \
cd OnyxChain-wallet; yarn install; npm run build

RUN npm install forever -g ; npm install http-server -g
