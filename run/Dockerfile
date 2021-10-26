# -- Base --
FROM node:12-slim as build
COPY package.json .
RUN yarn  install --silent
COPY scripts/build.js scripts/build.js
COPY config config
COPY public public
COPY src src
COPY .babelrc .
COPY .eslintrc .
RUN yarn build

RUN ls build
FROM nginx:1.19.7
RUN rm /etc/nginx/conf.d/default.conf
COPY run/fe-nginx.conf /etc/nginx/nginx.conf
COPY --from=build build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
