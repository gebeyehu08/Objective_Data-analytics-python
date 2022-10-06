FROM node:16

ARG PORT=8083

ARG SERVICES=/services
RUN mkdir $SERVICES

WORKDIR $SERVICES/validator
# copy sourcecode into image
COPY validator $SERVICES/validator

RUN cd  $SERVICES/validator && \
    rm -rf node_modules docs/node_modules && \
    rm -rf build docs/build && \
    yarn install


CMD yarn serve