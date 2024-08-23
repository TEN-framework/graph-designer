PROJECT_NAME := astra
PROJECT_VERSION ?= "0.1."$(shell date -u +'%Y%m%d%H')
REGISTRY ?= agoraio/

.PHONY: docker-build

docker-build:
	@echo ">> docker build"
	docker build -t $(REGISTRY)$(PROJECT_NAME)_graph_designer:$(PROJECT_VERSION) --platform linux/amd64 -f Dockerfile .
	@echo ">> done"
