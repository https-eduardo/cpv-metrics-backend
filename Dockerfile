FROM node:18-alpine AS base

WORKDIR /home/node

EXPOSE 1337

COPY . .

FROM base AS dev

RUN yarn --immutable --prefer-offline

CMD [ "yarn", "develop" ]

FROM base AS cloud

ENV NODE_ENV 'production'

RUN rm config/sync/core-store.plugin_users-permissions_advanced.json
RUN rm config/sync/core-store.plugin_users-permissions_email.json

RUN yarn --immutable --prefer-offline --production

ENTRYPOINT [ "/home/node/entrypoint.sh" ]

CMD [ "sh", "-c", "yarn cs:import -y && yarn start" ]
