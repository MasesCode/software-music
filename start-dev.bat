@echo off
REM Script para iniciar o ambiente de desenvolvimento completo
REM Backend Laravel + Frontend React (Windows)

echo 🚀 Iniciando ambiente de desenvolvimento Top 5 Tião Carreiro...
echo ==================================================

REM Verificar se PHP está instalado
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PHP não encontrado. Instale o PHP 8.1+ primeiro.
    pause
    exit /b 1
)

REM Verificar se Composer está instalado
composer --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Composer não encontrado. Instale o Composer primeiro.
    pause
    exit /b 1
)

REM Verificar se Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Instale o Node.js 18+ primeiro.
    pause
    exit /b 1
)

REM Verificar se NPM está instalado
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ NPM não encontrado. Instale o NPM primeiro.
    pause
    exit /b 1
)

echo ✅ Todas as dependências encontradas!

REM Iniciar Backend Laravel
echo.
echo 🔧 Iniciando Backend Laravel...
cd api

REM Verificar se .env existe
if not exist .env (
    echo ⚠️  Arquivo .env não encontrado. Copiando .env.example...
    copy .env.example .env
    echo ⚠️  Configure as variáveis de ambiente no arquivo .env
)

REM Instalar dependências do backend se necessário
if not exist vendor (
    echo 📦 Instalando dependências do backend...
    composer install --no-interaction
)

REM Executar migrações se necessário
echo 🗄️  Executando migrações...
php artisan migrate --force

REM Iniciar servidor Laravel em nova janela
start "Backend Laravel" cmd /k "php artisan serve --host=0.0.0.0 --port=8000"

echo ✅ Backend Laravel iniciado em http://localhost:8000

REM Voltar para o diretório raiz
cd ..

REM Iniciar Frontend React
echo.
echo ⚛️  Iniciando Frontend React...
cd web

REM Verificar se node_modules existe
if not exist node_modules (
    echo 📦 Instalando dependências do frontend...
    npm install
)

REM Criar arquivo .env.local se não existir
if not exist .env.local (
    echo 📝 Criando arquivo .env.local...
    echo VITE_API_BASE_URL=http://localhost:8000/api > .env.local
)

REM Iniciar servidor React em nova janela
start "Frontend React" cmd /k "npm run dev"

echo ✅ Frontend React iniciado em http://localhost:3000

REM Voltar para o diretório raiz
cd ..

echo.
echo 🎉 Ambiente de desenvolvimento iniciado com sucesso!
echo ==================================================
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:8000
echo 📚 API Docs: http://localhost:8000/api
echo ==================================================
echo 💡 Feche as janelas dos servidores para parar
echo.
pause
