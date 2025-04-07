# FilmesFlix

<img src="cliente/public/favicon.ico" alt="FilmesFlix Logo" width="100" height="100" />

## 📝 Descrição

FilmesFlix é uma aplicação web para gestão de filmes e seus géneros. A plataforma permite aos utilizadores criar, visualizar, editar e excluir filmes, bem como gerir os géneros disponíveis. A aplicação inclui sistema de autenticação, suporte a múltiplos perfis de utilizador e upload de imagens.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web para Node.js
- **Sequelize** - ORM para bases de dados SQL
- **PostgreSQL** - Sistema de gestão de base de dados
- **JWT** - Autenticação baseada em tokens
- **Bcrypt** - Hash de passwords
- **Multer** - Upload de ficheiros

### Frontend
- **React** - Biblioteca JavaScript para interfaces de utilizador
- **React Router** - Gestão de rotas no frontend
- **React Bootstrap** - Componentes de UI responsivos
- **Axios** - Cliente HTTP para requisições à API
- **Bootstrap Icons** - Ícones para a interface
- **SweetAlert2** - Alertas e modais interativos

## 🛠️ Instalação e Configuração

### Pré-requisitos
- Node.js (versão 14.x ou superior)
- PostgreSQL (versão 12.x ou superior)
- npm ou yarn

### Configuração da Base de Dados
1. Crie uma base de dados PostgreSQL com o nome `ai2`
2. Configure as credenciais no ficheiro `.env` do servidor

### Instalação do Backend
```bash
# Aceder à pasta do servidor
cd servidor

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Copie o arquivo .env.example para .env e ajuste as configurações
cp .env.example .env

# Iniciar o servidor de desenvolvimento
npm run dev

# Para iniciar em produção
npm start
```

### Configuração do Ambiente (.env)

> ⚠️ **IMPORTANTE**: O arquivo `.env` não é versionado pelo Git por razões de segurança. Ao clonar o repositório, será necessário criar este arquivo manualmente.

1. Crie um arquivo `.env` na pasta `servidor/` utilizando o modelo `.env.example` fornecido:
```bash
cp servidor/.env.example servidor/.env
```

2. Edite o arquivo `.env` com as seguintes configurações:
```
# JWT (usado para autenticação)
JWT_SECRET=sua_chave_secreta_aqui   # Substitua por uma string aleatória e segura

# Configurações do Banco de Dados
DB_NAME=ai2                # Nome da base de dados PostgreSQL
DB_USER=seu_usuario_db     # Usuário do PostgreSQL
DB_PASSWORD=sua_senha_db   # Senha do PostgreSQL
DB_HOST=localhost          # Host do banco de dados
DB_PORT=5432               # Porta padrão do PostgreSQL
DB_DIALECT=postgres        # Dialeto do banco de dados
DB_LOGGING=true            # Define se as queries SQL serão exibidas no console

# Outras configurações
PORT=3000                  # Porta em que o servidor irá rodar
```

3. Este arquivo é **essencial** para que a aplicação funcione corretamente!

### Instalação do Frontend
```bash
# Aceder à pasta do cliente
cd cliente

# Instalar dependências
npm install

# Iniciar a aplicação
npm start
```

## 🏗️ Estrutura do Projeto

### Backend (pasta `servidor`)
- `src/`
  - `app.js` - Ponto de entrada da aplicação
  - `controllers/` - Controladores da aplicação
  - `models/` - Modelos Sequelize
  - `routes/` - Rotas da API
  - `middleware/` - Middlewares (autenticação, etc.)
  - `config/` - Configurações (base de dados, multer, etc.)
  - `seed.js` - Dados iniciais para a aplicação (géneros)
- `uploads/` - Armazenamento para ficheiros enviados (posters de filmes)

### Frontend (pasta `cliente`)
- `src/`
  - `components/` - Componentes React reutilizáveis
  - `services/` - Serviços para comunicação com a API
  - `view/` - Páginas da aplicação
  - `App.js` - Componente principal e configuração de rotas

## 🔄 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login de utilizador
- `POST /api/auth/register` - Registo de novo utilizador

### Filmes
- `GET /api/filmes` - Listar todos os filmes
- `GET /api/filmes/:id` - Obter detalhes de um filme
- `POST /api/filmes` - Criar novo filme (autenticado)
- `PUT /api/filmes/:id` - Atualizar filme existente (autenticado)
- `DELETE /api/filmes/:id` - Excluir filme (autenticado)

### Géneros
- `GET /api/generos` - Listar todos os géneros (autenticado)
- `GET /api/generos/:id` - Obter detalhes de um género (autenticado)
- `POST /api/generos/create` - Criar novo género (autenticado)
- `PUT /api/generos/update/:id` - Atualizar género existente (autenticado)
- `DELETE /api/generos/delete/:id` - Excluir género (autenticado)

## 🔐 Autenticação

A aplicação utiliza autenticação baseada em tokens JWT. Após o login bem-sucedido, o token é armazenado no localStorage do navegador e é enviado em todas as requisições autenticadas como um header `Authorization: Bearer <token>`.

## 👥 Perfis de Utilizador

A aplicação suporta múltiplos perfis de utilizador, permitindo que diferentes pessoas utilizem a mesma conta. Cada perfil pode ter seu próprio avatar e preferências.

## 📷 Funcionalidades

- ✅ Autenticação de utilizadores (login/registo)
- ✅ Gestão de perfis de utilizador
- ✅ CRUD completo de filmes
- ✅ CRUD completo de géneros
- ✅ Upload de imagens para os filmes
- ✅ Interface responsiva para desktops e dispositivos móveis

## 📊 Base de Dados

O projeto utiliza o PostgreSQL como base de dados, com o Sequelize como ORM para definir os modelos e relacionamentos:

- **Utilizadores** - Armazena informações de utilizadores registados
- **Perfis** - Perfis associados a cada utilizador
- **Filmes** - Informações sobre os filmes (título, descrição, imagem, etc.)
- **Géneros** - Categorias de filmes (Ação, Comédia, Drama, etc.)

## 🧪 Inicialização de Dados

O projeto inclui um script de seed que popula a base de dados com géneros iniciais quando o servidor é iniciado pela primeira vez. Os géneros padrão incluem: Ação, Aventura, Comédia, Drama, Ficção Científica, Terror, Romance, Animação, Documentário e Suspense.

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do projeto
2. Crie uma branch para a sua feature (`git checkout -b feature/nova-feature`)
3. Comit as suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request


## 👨‍💻 Autor

- **Pedro Soares**

