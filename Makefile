# Makefile para facilitar o uso do Docker

.PHONY: help build up down dev logs clean restart

# Comandos padrão
help: ## Mostra esta ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Constrói as imagens Docker
	docker-compose build

up: ## Inicia os containers em produção
	docker-compose up -d

down: ## Para os containers
	docker-compose down

dev: ## Inicia em modo de desenvolvimento
	docker-compose -f docker-compose.dev.yml up -d

dev-down: ## Para os containers de desenvolvimento
	docker-compose -f docker-compose.dev.yml down

logs: ## Mostra os logs
	docker-compose logs -f

logs-backend: ## Mostra logs do backend
	docker-compose logs -f backend

logs-frontend: ## Mostra logs do frontend
	docker-compose logs -f frontend

clean: ## Limpa containers e volumes
	docker-compose down -v
	docker system prune -f

restart: ## Reinicia os containers
	docker-compose restart

shell-backend: ## Acessa o shell do backend
	docker-compose exec backend bash

shell-frontend: ## Acessa o shell do frontend
	docker-compose exec frontend sh

migrate: ## Executa as migrações
	docker-compose exec backend php artisan migrate

seed: ## Executa os seeders
	docker-compose exec backend php artisan db:seed

fresh: ## Reseta o banco e executa migrações
	docker-compose exec backend php artisan migrate:fresh --seed

test: ## Executa todos os testes
	@echo "Executando testes do backend..."
	docker-compose exec backend php artisan test
	@echo "Executando testes do frontend..."
	docker-compose exec frontend npm run test:run

test-backend: ## Executa apenas os testes do backend
	docker-compose exec backend php artisan test

test-frontend: ## Executa apenas os testes do frontend
	docker-compose exec frontend npm run test:run

test-coverage: ## Executa testes com cobertura
	@echo "Executando testes com cobertura do backend..."
	docker-compose exec backend php artisan test --coverage
	@echo "Executando testes com cobertura do frontend..."
	docker-compose exec frontend npm run test:coverage

install: ## Instala dependências
	@echo "Instalando dependências do backend..."
	cd api && composer install
	@echo "Instalando dependências do frontend..."
	cd web && npm install

setup: ## Configuração inicial do projeto
	@echo "Configurando projeto..."
	cp docker.env.example .env
	@echo "Arquivo .env criado. Configure as variáveis antes de continuar."
	@echo "Execute 'make dev' para iniciar em modo desenvolvimento."

keys: ## Gera as chaves necessárias (APP_KEY e JWT_SECRET)
	@echo "Gerando chaves necessárias..."
	docker-compose exec backend php artisan key:generate
	docker-compose exec backend php artisan jwt:secret --force
	@echo "Chaves geradas com sucesso!"

keys-local: ## Gera as chaves localmente (para instalação manual)
	@echo "Gerando chaves localmente..."
	cd api && php artisan key:generate
	cd api && php artisan jwt:secret --force
	@echo "Chaves geradas com sucesso!"
