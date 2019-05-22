FROM yarnpkg/dev 
MAINTAINER toktor <ak.toktor@gmail.com>

VOLUME [/OnyxChain-wallet]
WORKDIR /OnyxChain-wallet
COPY . .
RUN yarn install; npm run build

