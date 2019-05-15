FROM yarnpkg/dev 
MAINTAINER toktor <ak.toktor@gmail.com>

#RUN apt-get update ; apt-get install -y curl && apt install -y nodejs npm && \
#curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
#echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
#apt update && apt install -y yarn && \
#apt install -y git

VOLUME [/OnyxChain-wallet]
WORKDIR /OnyxChain-wallet
COPY . .
RUN npm install; npm run build

