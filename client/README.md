# About dgilli/simple-checkout-system

A glorified calculator for quick self-checkout, built as a simple React-based cashier application that allows rapid product selection, real-time total calculation, and easy management of selected items.

## Usage

Run `make help` to get a list of all available dev commands and operations.

If you have to run producation locally:

```shell
docker run --rm -itdp 8000:80 \
    -e MAILGUN_AUTH=$(echo -n 'api:API_KEY | base64) \
    $(docker build -q .)
```

### Deployment

There is a `make production/deploy` target to make things easy. The app is deployed to [Fly.io](https://fly.io).

Setup the required environment variables:

- `MAILGUN_AUTH`

## Roadmap

- [x] Simple Cashier UI
- [x] Installable PWA
- [ ] Inventory management
- [ ] Offline ready
- [x] Transaction logging
- [x] Twint integration
