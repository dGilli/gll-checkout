FROM node AS dev

WORKDIR /usr/src/app

COPY . .

CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0 --port 3000"]

FROM dev AS build

RUN --mount=type=secret,id=PRODUCTS_ENDPOINT \
    eval "$(base64 -d /run/secrets/PRODUCTS_ENDPOINT)" && \
    npm install && npm run build

FROM openresty/openresty:alpine-fat

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/templates/default.conf.template
COPY nginx/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY nginx/lua /usr/local/share/lua

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

CMD ["/usr/local/openresty/bin/openresty", "-g", "daemon off;"]
