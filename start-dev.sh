#!/bin/bash

# Script para iniciar o ambiente de desenvolvimento completo
# Backend Laravel + Frontend React

echo "🚀 Iniciando ambiente de desenvolvimento Top 5 Tião Carreiro..."
echo "=================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependências
echo -e "${BLUE}📋 Verificando dependências...${NC}"

if ! command_exists php; then
    echo -e "${RED}❌ PHP não encontrado. Instale o PHP 8.1+ primeiro.${NC}"
    exit 1
fi

if ! command_exists composer; then
    echo -e "${RED}❌ Composer não encontrado. Instale o Composer primeiro.${NC}"
    exit 1
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js não encontrado. Instale o Node.js 18+ primeiro.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ NPM não encontrado. Instale o NPM primeiro.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Todas as dependências encontradas!${NC}"

# Função para limpar processos ao sair
cleanup() {
    echo -e "\n${YELLOW}🛑 Parando servidores...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ Servidores parados.${NC}"
    exit 0
}

# Capturar Ctrl+C para limpar processos
trap cleanup SIGINT

# Iniciar Backend Laravel
echo -e "\n${BLUE}🔧 Iniciando Backend Laravel...${NC}"
cd api

# Verificar se .env existe
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado. Copiando .env.example...${NC}"
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Configure as variáveis de ambiente no arquivo .env${NC}"
fi

# Instalar dependências do backend se necessário
if [ ! -d vendor ]; then
    echo -e "${YELLOW}📦 Instalando dependências do backend...${NC}"
    composer install --no-interaction
fi

# Executar migrações se necessário
echo -e "${YELLOW}🗄️  Executando migrações...${NC}"
php artisan migrate --force

# Iniciar servidor Laravel em background
php artisan serve --host=0.0.0.0 --port=8000 &
BACKEND_PID=$!

echo -e "${GREEN}✅ Backend Laravel iniciado em http://localhost:8000 (PID: $BACKEND_PID)${NC}"

# Voltar para o diretório raiz
cd ..

# Iniciar Frontend React
echo -e "\n${BLUE}⚛️  Iniciando Frontend React...${NC}"
cd web

# Verificar se node_modules existe
if [ ! -d node_modules ]; then
    echo -e "${YELLOW}📦 Instalando dependências do frontend...${NC}"
    npm install
fi

# Criar arquivo .env.local se não existir
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}📝 Criando arquivo .env.local...${NC}"
    echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env.local
fi

# Iniciar servidor React em background
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}✅ Frontend React iniciado em http://localhost:3000 (PID: $FRONTEND_PID)${NC}"

# Voltar para o diretório raiz
cd ..

echo -e "\n${GREEN}🎉 Ambiente de desenvolvimento iniciado com sucesso!${NC}"
echo -e "${BLUE}==================================================${NC}"
echo -e "${GREEN}🌐 Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}🔧 Backend:  http://localhost:8000${NC}"
echo -e "${GREEN}📚 API Docs: http://localhost:8000/api${NC}"
echo -e "${BLUE}==================================================${NC}"
echo -e "${YELLOW}💡 Pressione Ctrl+C para parar os servidores${NC}"

# Aguardar indefinidamente
wait
