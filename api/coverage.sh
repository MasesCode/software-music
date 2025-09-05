#!/bin/bash

# Script para executar testes com coverage
# Uso: ./coverage.sh [html|text|clover|all]

TYPE=${1:-html}

echo "🧪 Executando testes com coverage..."

case $TYPE in
    "html")
        echo "📊 Gerando relatório HTML..."
        XDEBUG_MODE=coverage ./vendor/bin/phpunit --coverage-html coverage-html
        echo "✅ Relatório HTML gerado em: coverage-html/index.html"
        ;;
    "text")
        echo "📋 Gerando relatório de texto..."
        XDEBUG_MODE=coverage ./vendor/bin/phpunit --coverage-text
        ;;
    "clover")
        echo "🍀 Gerando relatório Clover XML..."
        XDEBUG_MODE=coverage ./vendor/bin/phpunit --coverage-clover coverage-clover.xml
        echo "✅ Relatório Clover gerado em: coverage-clover.xml"
        ;;
    "all")
        echo "📊 Gerando todos os tipos de relatório..."
        XDEBUG_MODE=coverage ./vendor/bin/phpunit --coverage-html coverage-html --coverage-clover coverage-clover.xml --coverage-text
        echo "✅ Relatórios gerados:"
        echo "   - HTML: coverage-html/index.html"
        echo "   - Clover: coverage-clover.xml"
        echo "   - Texto: exibido acima"
        ;;
    *)
        echo "❌ Tipo inválido. Use: html, text, clover ou all"
        exit 1
        ;;
esac

echo "🎉 Coverage concluído!"
