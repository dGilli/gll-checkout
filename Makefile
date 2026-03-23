APP_NAME = simple-checkout-system
PRODUCTION_URL = https://$(APP_NAME).fly.dev
REPO_URL = https://github.com/dGilli/$(APP_NAME)
DEV_PORT = 3000
DEV_URL = http://localhost:$(DEV_PORT)
DEV_BROWSER = cr
OPEN_URL = @command -v xdg-open >/dev/null && xdg-open $1 || open $1

load_env = $(shell grep -v '^\s*\#' $(1) | sed '/^\s*$$/d')

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

.PHONY: confirm
confirm:
	@echo -n 'Are you sure? [y/N] ' && read ans && [ $${ans:-N} = y ]

.PHONY: no-dirty
no-dirty:
	@test -z "$(shell git status --porcelain)"


# ==================================================================================== #
# QUALITY CONTROL
# ==================================================================================== #

# ...

# ==================================================================================== #
# DEVELOPMENT
# ==================================================================================== #

# ...

# ==================================================================================== #
# OPERATIONS
# ==================================================================================== #

.PHONY: production/deploy
production/deploy: #confirm audit no-dirty
	#fly deploy client
	fly deploy postgres
	fly deploy craft

