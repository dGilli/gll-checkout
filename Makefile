open_url = @command -v xdg-open >/dev/null && xdg-open $1 || open $1
load_env = $(shell grep -v '^\s*\#' $(1) | sed '/^\s*$$/d')

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@printf 'Time saving project command line interface.\n\n'
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | awk '/^$$/{print "~"; next} /:./{print "  " $$0; next} {sub(/^ /,""); print "~"; print}' | column -t -s ':' | sed 's/^~.*//'

.PHONY: confirm
confirm:
	@echo -n 'Are you sure? [y/N] ' && read ans && [ $${ans:-N} = y ]

.PHONY: no-dirty
no-dirty:
	@test -z "$(shell git status --porcelain)"

# ==================================================================================== #
## QUALITY CONTROL
# ==================================================================================== #

## audit: run quality control checks
.PHONY: audit
audit: test
	prettier * --check --cache --ignore-unknown || true

## test: run all tests (unimplemented!)
.PHONY: test
test:
	echo "unimplemented!"

## test/cover: run all tests and display coverage (unimplemented!)
.PHONY: test/cover
test/cover:
	echo "unimplemented!"

## upgradeable: list direct dependencies that have upgrades available
.PHONY: upgradeable
upgradeable:
	docker compose run -it client npm outdated || true
	docker run --rm -itv ./craft:/app composer:2 outdated --ignore-platform-reqs

# ==================================================================================== #
## DEVELOPMENT
# ==================================================================================== #

## tidy: lint and format all files
.PHONY: tidy
tidy: confirm
	prettier * --write --cache --ignore-unknown
	docker compose run -it client npm -- run lint --fix

## clean: clean installed dependencies and build artifacts
.PHONY: clean
clean: confirm
	docker compose down --rmi --remove-orphans
	rm -r client/node_modules client/dist
	rm -r craft/vendor craft/web/cpresources craft/storage

## build: build all services
.PHONY: build
build:
	docker compose build

## build/<service>: build a single service
.PHONY: build/%
build/%:
	docker compose build $*

## run: run all services
.PHONY: run
run: build
	docker compose up --no-build

## run/<service>: run a single service
.PHONY: run/%
run/%: build
	docker compose up $* --no-build

# ==================================================================================== #
## OPERATIONS
# ==================================================================================== #

## push: push changes to the remote Git repository
.PHONY: push
push: confirm audit no-dirty
	git push

## production/deploy: deploy all services to production
.PHONY: production/deploy
production/deploy: confirm audit no-dirty
	(fly deploy postgres &)
	(fly deploy craft &)
	(cd client && flyctl console --dockerfile Dockerfile.builder -C "/srv/deploy.sh" --env=FLY_API_TOKEN=$(fly auth token) &)
	wait

## production/deploy/<service>: deploy a single service to production
.PHONY: production/deploy/%
production/deploy/%: confirm audit no-dirty
	if [ "$*" != "client" ]; then \
		fly deploy $*; \
	else \
		cd client && flyctl console --dockerfile Dockerfile.builder -C "/srv/deploy.sh" --env=FLY_API_TOKEN=$(fly auth token); \
	fi

