# 🚀 Quick Start - Top 5 Tião Carreiro

## Scripts de Inicialização Rápida

Criei scripts para iniciar tanto o backend Laravel quanto o frontend React simultaneamente!

## 🐧 Linux/macOS

### Opção 1: Script Shell (Recomendado)
```bash
./start-dev.sh
```

### Opção 2: NPM Scripts
```bash
# Instalar dependências globalmente
npm install -g concurrently

# Instalar dependências do projeto
npm run install:all

# Configurar ambiente
npm run setup

# Iniciar ambos os servidores
npm run dev
```

## 🪟 Windows

### Opção 1: Script Batch
```cmd
start-dev.bat
```

### Opção 2: NPM Scripts
```cmd
# Instalar dependências globalmente
npm install -g concurrently

# Instalar dependências do projeto
npm run install:all

# Configurar ambiente
npm run setup

# Iniciar ambos os servidores
npm run dev
```

## 📋 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia backend + frontend simultaneamente |
| `npm run dev:backend` | Apenas backend Laravel (porta 8000) |
| `npm run dev:frontend` | Apenas frontend React (porta 3000) |
| `npm run install:all` | Instala dependências de ambos |
| `npm run setup` | Configuração completa inicial |
| `npm run build` | Build do frontend para produção |
| `npm run test` | Executa testes de ambos |
| `npm run stop` | Para todos os servidores |

## 🌐 URLs de Acesso

Após iniciar os scripts:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Backend Web**: http://localhost:8000

## 🔧 Configuração Automática

Os scripts fazem automaticamente:

1. ✅ Verificam dependências (PHP, Composer, Node.js, NPM)
2. ✅ Instalam dependências se necessário
3. ✅ Copiam arquivos de configuração (.env)
4. ✅ Executam migrações do banco
5. ✅ Iniciam ambos os servidores
6. ✅ Mostram URLs de acesso

## 🛑 Como Parar

- **Linux/macOS**: Pressione `Ctrl+C` no terminal
- **Windows**: Feche as janelas dos servidores ou use `npm run stop`

## 🐛 Solução de Problemas

### Erro de Permissão (Linux/macOS)
```bash
chmod +x start-dev.sh
```

### Porta já em uso
```bash
# Verificar processos usando as portas
lsof -i :3000
lsof -i :8000

# Matar processos
kill -9 <PID>
```

### Dependências não encontradas
```bash
# Instalar PHP 8.1+
sudo apt install php8.1-cli php8.1-mysql php8.1-xml php8.1-mbstring

# Instalar Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## 🎯 Próximos Passos

1. Execute o script de inicialização
2. Acesse http://localhost:3000
3. Registre-se ou faça login
4. Explore as funcionalidades!

---

**Dica**: Use `./start-dev.sh` no Linux/macOS ou `start-dev.bat` no Windows para a forma mais rápida de iniciar tudo! 🚀
