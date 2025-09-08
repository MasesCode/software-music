# 🎵 Tiao Carreiro Music - Sistema de Sugestões Musicais

Um sistema completo para gerenciar sugestões de músicas do Tião Carreiro e Pardinho, permitindo que usuários contribuam com suas músicas favoritas e votem nas sugestões da comunidade.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Configuração Inicial](#configuração-inicial)
- [Instalação com Docker](#instalação-com-docker)
- [Instalação Manual](#instalação-manual)
- [Configuração da API do YouTube](#configuração-da-api-do-youtube)
- [Chaves Necessárias](#chaves-necessárias)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Comandos Úteis](#comandos-úteis)
- [Troubleshooting](#troubleshooting)
- [Contribuição](#contribuição)

## 🎯 Sobre o Projeto

O **Tiao Carreiro Music** é uma aplicação web que permite:

- **Sugerir músicas**: Usuários podem sugerir suas músicas favoritas do Tião Carreiro e Pardinho
- **Sistema de votação**: A comunidade pode votar nas sugestões (precisa de 5 votos para aprovação)
- **Integração com YouTube**: Busca automática de informações das músicas via API do YouTube
- **Interface moderna**: Design responsivo e intuitivo
- **Sistema de usuários**: Cadastro, login e controle de permissões
- **Notificações**: Sistema de notificações em tempo real

### 🎵 Funcionalidades Principais

- ✅ **Sugestão de Músicas**: Adicione links do YouTube com suas músicas favoritas
- ✅ **Sistema de Aprovação**: Músicas precisam de 5 votos da comunidade para serem aprovadas
- ✅ **Top 5**: Lista das músicas mais votadas e aprovadas
- ✅ **Integração YouTube**: Busca automática de título, visualizações e thumbnail
- ✅ **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- ✅ **Sistema de Usuários**: Cadastro, login e controle de permissões
- ✅ **Notificações**: Avisos em tempo real sobre aprovações e votos
- ✅ **Multi-idioma**: Suporte a português e inglês

## 🛠️ Tecnologias Utilizadas

### Backend (API)
- **Laravel 11** - Framework PHP
- **PHP 8.2** - Linguagem de programação
- **SQLite** - Banco de dados
- **JWT Auth** - Autenticação
- **Laravel Activity Log** - Log de atividades
- **YouTube Data API v3** - Integração com YouTube

### Frontend (Web)
- **React 18** - Biblioteca JavaScript
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **Radix UI** - Componentes acessíveis
- **React Router** - Roteamento
- **Zustand** - Gerenciamento de estado
- **React Query** - Cache e sincronização de dados

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração de containers
- **Nginx** - Servidor web (frontend)
- **Apache** - Servidor web (backend)

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Docker** e **Docker Compose** (recomendado)
- OU **PHP 8.2+**, **Node.js 18+**, **Composer** e **SQLite** (instalação manual)

### Verificando se tem Docker instalado:
```bash
docker --version
docker-compose --version
```

## ⚙️ Configuração Inicial

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd software-music
```

### 2. Configure as variáveis de ambiente
```bash
# Copie o arquivo de exemplo
cp docker.env.example .env

# Edite o arquivo .env com suas configurações
nano .env
```

### 3. Configure a chave da API do YouTube
No arquivo `.env`, adicione sua chave da API do YouTube:
```env
YOUTUBE_API_KEY=sua_chave_da_api_do_youtube_aqui
```

## 🐳 Instalação com Docker (Recomendado)

### Início Rápido
```bash
# 1. Configure o ambiente
cp docker.env.example .env

# 2. Edite o arquivo .env e adicione sua chave do YouTube
nano .env

# 3. Inicie o projeto
./docker-start.sh

# 4. Gere as chaves necessárias
make keys
```

### Modo de Desenvolvimento
```bash
# Para desenvolvimento com hot reload
./docker-dev.sh

# Gere as chaves necessárias
make keys
```

### Comandos Docker Úteis

```bash
# Ver status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Rebuild completo
docker-compose down && docker-compose up --build -d

# Acessar shell do backend
docker-compose exec backend bash

# Executar comandos Laravel
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed
```

## 🔧 Instalação Manual

Se preferir não usar Docker, siga estes passos:

### Backend (Laravel)

```bash
# 1. Entre na pasta do backend
cd api

# 2. Instale as dependências PHP
composer install

# 3. Configure o ambiente
cp .env.example .env

# 4. Gere a chave da aplicação
php artisan key:generate

# 5. Gere a chave JWT (necessária para autenticação)
php artisan jwt:secret

# 6. Configure o banco SQLite
touch database/database.sqlite

# 7. Execute as migrações
php artisan migrate

# 8. Execute os seeders (opcional)
php artisan db:seed

# 9. Inicie o servidor
php artisan serve
```

### Frontend (React)

```bash
# 1. Entre na pasta do frontend
cd web

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env.local

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

## 🔑 Configuração da API do YouTube

### Por que precisa da API do YouTube?

O sistema usa a **YouTube Data API v3** para:
- Buscar informações das músicas (título, visualizações, thumbnail)
- Validar se o link do YouTube é válido
- Extrair o ID do vídeo automaticamente

### Como obter a chave da API:

1. **Acesse o Google Cloud Console**: https://console.cloud.google.com/
2. **Crie um novo projeto** ou selecione um existente
3. **Ative a YouTube Data API v3**:
   - Vá em "APIs & Services" > "Library"
   - Busque por "YouTube Data API v3"
   - Clique em "Enable"
4. **Crie credenciais**:
   - Vá em "APIs & Services" > "Credentials"
   - Clique em "Create Credentials" > "API Key"
   - Copie a chave gerada
5. **Configure no projeto**:
   - Adicione a chave no arquivo `.env`:
   ```env
   YOUTUBE_API_KEY=sua_chave_aqui
   ```

### ⚠️ Importante sobre a API do YouTube:
- A API tem **cotas gratuitas limitadas** (10.000 unidades/dia)
- Para produção, considere implementar cache
- A chave será fornecida pelo administrador do projeto

## 🚀 Como Usar

### Acessando a Aplicação

Após a instalação, acesse:

- **Frontend**: http://localhost:3000 (produção) ou http://localhost:5173 (desenvolvimento)
- **Backend API**: http://localhost:8000

### Primeiro Acesso

1. **Registre-se** na aplicação
2. **Faça login** com suas credenciais
3. **Comece sugerindo músicas** do Tião Carreiro e Pardinho

### Como Sugerir uma Música

1. Clique em **"Adicionar Sugestão"**
2. Cole o **link do YouTube** da música
3. Adicione um **motivo** (opcional)
4. Clique em **"Enviar"**

### Como Votar em Sugestões

1. Navegue até a página **"Sugestões"**
2. Encontre músicas que ainda não foram aprovadas
3. Clique em **"Contribuir"** para votar
4. Músicas precisam de **5 votos** para serem aprovadas

### Visualizar Top 5

1. Acesse a página **"Top 5"**
2. Veja as músicas mais votadas e aprovadas
3. Clique para assistir no YouTube

## 📁 Estrutura do Projeto

```
software-music/
├── api/                          # Backend Laravel
│   ├── app/
│   │   ├── Http/Controllers/     # Controllers da API
│   │   ├── Models/              # Modelos Eloquent
│   │   ├── Services/            # Serviços (YouTube, etc.)
│   │   └── ...
│   ├── database/
│   │   ├── migrations/          # Migrações do banco
│   │   └── seeders/            # Seeders
│   ├── routes/
│   │   └── api.php             # Rotas da API
│   ├── Dockerfile              # Container do backend
│   └── .dockerignore
├── web/                         # Frontend React
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── pages/             # Páginas da aplicação
│   │   ├── hooks/             # Custom hooks
│   │   ├── lib/               # Utilitários e configurações
│   │   └── store/             # Gerenciamento de estado
│   ├── Dockerfile              # Container do frontend
│   ├── Dockerfile.dev          # Container de desenvolvimento
│   └── .dockerignore
├── docker-compose.yml          # Orquestração (produção)
├── docker-compose.dev.yml      # Orquestração (desenvolvimento)
├── docker-start.sh             # Script de inicialização
├── docker-dev.sh               # Script de desenvolvimento
├── Makefile                    # Comandos facilitados
└── README.md                   # Este arquivo
```

## 🛠️ Comandos Úteis

### Usando Makefile (Recomendado)

```bash
# Ver todos os comandos disponíveis
make help

# Iniciar em produção
make up

# Iniciar em desenvolvimento
make dev

# Ver logs
make logs

# Parar containers
make down

# Executar migrações
make migrate

# Executar seeders
make seed

# Acessar shell do backend
make shell-backend

# Executar testes
make test

# Gerar chaves necessárias (Docker)
make keys

# Gerar chaves necessárias (instalação manual)
make keys-local
```

### Comandos Docker Diretos

```bash
# Produção
docker-compose up -d
docker-compose down

# Desenvolvimento
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down

# Logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild
docker-compose build --no-cache
docker-compose up --build -d
```

### Comandos Laravel (dentro do container)

```bash
# Acessar o container
docker-compose exec backend bash

# Executar migrações
php artisan migrate

# Executar seeders
php artisan db:seed

# Limpar cache
php artisan cache:clear
php artisan config:clear

# Gerar chave da aplicação
php artisan key:generate

# Gerar chave JWT
php artisan jwt:secret

# Executar testes
php artisan test
```

## 🔐 Chaves Necessárias

### Chaves Obrigatórias

O sistema requer duas chaves essenciais para funcionar corretamente:

#### 1. APP_KEY (Chave da Aplicação Laravel)
```bash
# Gere a chave da aplicação
php artisan key:generate
```
- **O que é**: Chave de criptografia do Laravel
- **Onde fica**: `APP_KEY=` no arquivo `.env`
- **Formato**: `base64:chave_de_32_caracteres`

#### 2. JWT_SECRET (Chave de Autenticação JWT)
```bash
# Gere a chave JWT
php artisan jwt:secret --force
```
- **O que é**: Chave para assinar tokens de autenticação
- **Onde fica**: `JWT_SECRET=` no arquivo `.env`
- **Formato**: String de pelo menos 32 caracteres
- **Importante**: Deve ter pelo menos 256 bits (32 caracteres)

#### 3. YOUTUBE_API_KEY (Chave da API do YouTube)
```bash
# Configure no arquivo .env
YOUTUBE_API_KEY=sua_chave_da_api_do_youtube
```
- **O que é**: Chave para acessar a YouTube Data API v3
- **Onde fica**: `YOUTUBE_API_KEY=` no arquivo `.env`
- **Como obter**: Veja a seção [Configuração da API do YouTube](#🔑-configuração-da-api-do-youtube)

### ⚠️ Problemas Comuns com Chaves

#### Erro: "Key provided is shorter than 256 bits"
- **Causa**: JWT_SECRET muito curta
- **Solução**: Execute `php artisan jwt:secret --force`

#### Erro: "No application encryption key has been specified"
- **Causa**: APP_KEY vazia
- **Solução**: Execute `php artisan key:generate`

#### Erro: "YouTube API quota exceeded"
- **Causa**: Excedeu a cota da API do YouTube
- **Solução**: Aguarde 24h ou configure uma nova chave

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. Container não inicia
```bash
# Verificar logs
docker-compose logs backend
docker-compose logs frontend

# Verificar se as portas estão livres
netstat -tulpn | grep :3000
netstat -tulpn | grep :8000
```

#### 2. Erro de permissões no storage
```bash
# Ajustar permissões
docker-compose exec backend chown -R www-data:www-data storage
docker-compose exec backend chmod -R 755 storage
```

#### 3. Erro de banco de dados
```bash
# Recriar banco
docker-compose exec backend php artisan migrate:fresh
docker-compose exec backend php artisan db:seed
```

#### 4. Erro de chave JWT muito curta (Key provided is shorter than 256 bits)
```bash
# Gere uma nova chave JWT
php artisan jwt:secret --force

# Ou configure manualmente no .env
JWT_SECRET=sua_chave_jwt_aqui_de_pelo_menos_32_caracteres
```

#### 5. Erro de APP_KEY vazia
```bash
# Gere a chave da aplicação
php artisan key:generate
```

#### 6. API do YouTube não funciona
- Verifique se a chave está correta no arquivo `.env`
- Verifique se a API está ativada no Google Cloud Console
- Verifique se não excedeu a cota diária

#### 7. Frontend não carrega
```bash
# Rebuild do frontend
docker-compose build --no-cache frontend
docker-compose up frontend -d
```

### Logs e Debug

```bash
# Ver todos os logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Ver logs em tempo real
docker-compose logs -f --tail=100
```

### Limpeza Completa

```bash
# Parar e remover tudo
docker-compose down -v
docker system prune -f

# Rebuild completo
docker-compose up --build -d
```

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o projeto
2. **Crie uma branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra um Pull Request**

### Padrões de Código

- **Backend**: Siga os padrões do Laravel e PSR-12
- **Frontend**: Use TypeScript, ESLint e Prettier
- **Commits**: Use mensagens descritivas em português
- **Testes**: Mantenha a cobertura de testes

### Reportando Bugs

Ao reportar bugs, inclua:
- Descrição detalhada do problema
- Passos para reproduzir
- Screenshots (se aplicável)
- Informações do ambiente (OS, Docker, etc.)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:
- Abra uma **Issue** no GitHub
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ para os fãs do Tião Carreiro e Pardinho!** 🎵🤠
