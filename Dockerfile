FROM alpine/git:latest AS source_fetch
ARG GIT_REPO
ARG GIT_TAG
RUN git clone ${GIT_REPO} /app && cd /app && git checkout ${GIT_TAG}

# Dev environment
FROM node:20-alpine AS dev
WORKDIR /app
COPY --from=source_fetch /app ./
RUN npm install

CMD ["npm", "run", "dev", "--", "--host"]
# --------------------------------------------
# Production environment
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=source_fetch /app ./
RUN npm install && npm run build

FROM nginx:1.25-alpine AS prod
ARG PROD_PORT
COPY --from=build /app/dist /usr/share/nginx/html
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE ${PROD_PORT}
