ARG tag
FROM wallet_src:${tag} as wallet
FROM nginx:latest
MAINTAINER toktor <ak.toktor@gmail.com>

COPY --from=wallet /OnyxChain-wallet/build /var/www
COPY ./default.conf /etc/nginx/conf.d
ARG tag=unknown
RUN if [ "${tag}" = "preprod" ] ; then SUFFIX=preprod- ; fi ; sed -i 's/SERVERNAME/'"$SUFFIX"'wallet.onyxpay.co/g' /etc/nginx/conf.d/default.conf

