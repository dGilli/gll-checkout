# About dgilli/gll-checkout

A self checkout application with a simple React-based cashier frontend and Craft CMS on the backend for product management.

## Usage

Run `make help` to get a list of all available dev commands and operations.

If you have to run the client app as production locally:

```shell
cd client
docker run --rm -itdp 8000:80 \
    -e MAILGUN_AUTH=$(echo -n 'api:API_KEY | base64) \
    $(docker build -q .)
```

### Deployment

There is a `make production/deploy` target to make things easy. The app is deployed to [Fly.io](https://fly.io).

Setup the required environment secrets:

| App      | Variable                   | Description                      |
| -------- | -------------------------- | -------------------------------- |
| Client   | `MAILGUN_AUTH`             | Mailgun API credentials (base64) |
| Client   | `PRODUCTS_ENDPOINT`        | Tigris S3 products endpoint      |
| Craft    | `CRAFT_DB_PASSWORD`        | Postgres DB password             |
| Craft    | `CRAFT_SECURITY_KEY`       | Craft CMS secret key             |
| Craft    | `TIGRIS_BUCKET`            | Tigris S3 bucket name            |
| Craft    | `TIGRIS_ACCESS_KEY_ID`     | Tigris S3 access key id          |
| Craft    | `TIGRIS_SECRET_ACCESS_KEY` | Tigris S3 secret key id          |
| Postgres | `POSTGRES_PASSWORD`        | Postgres DB password             |

To test the connection from the craft app to postgres on Fly.io, ssh into the machine and run:

```shell
pg_isready -h gll-checkout-postgres.flycast -p 5432
```

## Roadmap

- [x] Simple Cashier UI
- [x] Installable PWA
- [x] Inventory management
- [ ] Offline ready
- [ ] Monitoring system
- [x] Transaction emails and logging
- [x] Twint integration
