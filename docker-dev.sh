#!/bin/bash

# Script para iniciar o projeto em modo de desenvolvimento com Docker

echo "🚀 Iniciando Tiao Carreiro Music em modo de desenvolvimento..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Verificar se existe arquivo .env
if [ ! -f "docker.env.example" ]; then
    echo "❌ Arquivo docker.env.example não encontrado!"
    exit 1
fi

# Copiar arquivo de ambiente se não existir
if [ ! -f ".env" ]; then
    echo "📋 Copiando arquivo de configuração..."
    cp docker.env.example .env
    echo "⚠️  Lembre-se de configurar as variáveis no arquivo .env antes de continuar!"
fi

# Parar containers existentes
echo "🛑 Parando containers existentes..."
docker-compose -f docker-compose.dev.yml down

# Construir e iniciar containers em modo desenvolvimento
echo "🔨 Construindo e iniciando containers em modo desenvolvimento..."
docker-compose -f docker-compose.dev.yml up --build -d

# Aguardar containers iniciarem
echo "⏳ Aguardando containers iniciarem..."
sleep 10

# Verificar status dos containers
echo "📊 Status dos containers:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "✅ Projeto iniciado em modo de desenvolvimento!"
echo ""
echo "🌐 Acesse:"
echo "   Frontend (com hot reload): http://localhost:5173"
echo "   Backend API: http://localhost:8000"
echo ""
echo "📝 Para ver logs:"
echo "   docker-compose -f docker-compose.dev.yml logs -f"
echo ""
echo "🛑 Para parar:"
echo "   docker-compose -f docker-compose.dev.yml down"
