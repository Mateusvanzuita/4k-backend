# 4K Team Backend

Backend para sistema de gerenciamento de equipes 4K desenvolvido com Express.js, Prisma e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Multer** - Upload de arquivos
- **Nodemailer** - Envio de emails

## 📁 Estrutura do Projeto

\`\`\`
src/
├── config/          # Configurações (database, etc.)
├── controllers/     # Controladores das rotas
├── middlewares/     # Middlewares (auth, validation, etc.)
├── repositories/    # Camada de acesso aos dados
├── routes/          # Definição das rotas
├── services/        # Lógica de negócio
├── utils/           # Utilitários
└── server.js        # Arquivo principal
\`\`\`

## 🛠️ Instalação

1. Clone o repositório
2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure as variáveis de ambiente:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Configure o banco de dados no arquivo `.env`

5. Execute a configuração completa:
\`\`\`bash
npm run setup
\`\`\`

## ⚠️ Migrações

### Migração de Alunos
Se você receber o erro `Unknown argument 'nomeAluno'`, execute a migração dos campos de alunos:

\`\`\`bash
npm run migrate:students
\`\`\`

### Migração de Alimentos
Para adicionar a funcionalidade de alimentos, execute:

\`\`\`bash
npm run migrate:alimentos
\`\`\`

Ou execute a migração completa do Prisma:
\`\`\`bash
npx prisma migrate dev --name add_student_fields
npx prisma generate
\`\`\`

Consulte o **[MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)** para mais detalhes.

## 🚀 Execução

### Desenvolvimento
\`\`\`bash
npm run dev
\`\`\`

### Produção
\`\`\`bash
npm start
\`\`\`

## 📚 Documentação da API

A documentação da API está disponível em: `http://localhost:3000/api-docs`

## 🔐 Autenticação

O sistema utiliza JWT para autenticação. Inclua o token no header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## 👥 Usuários Iniciais

O sistema cria automaticamente dois coaches ADMIN:
- **Gabriel**: gabriel@4kteam.com (senha: 123456)
- **Ingrid**: ingrid@4kteam.com (senha: 123456)

## 🔒 Permissões

- **ADMIN**: Acesso completo ao sistema
- **USER**: Acesso limitado
- **COACH**: Pode cadastrar alunos
- **STUDENT**: Usuário final

## 📝 Funcionalidades

### ✅ Etapa 1 - Implementada
- [x] Estrutura de pastas
- [x] Cadastro de usuários (alunos e coaches)
- [x] Sistema de papéis (ADMIN/USER)
- [x] Coaches ADMIN iniciais (Gabriel e Ingrid)
- [x] Upload de fotos
- [x] Notificações básicas
- [x] Autenticação JWT
- [x] Documentação Swagger

### ✅ Etapa 2 - CRUD de Alunos - Implementada
- [x] Modelo completo de aluno com todos os campos
- [x] Criação de alunos (apenas coaches)
- [x] Listagem com filtros e paginação
- [x] Busca por ID
- [x] Atualização de dados
- [x] Exclusão de alunos
- [x] Filtros por: tipo de plano, sexo, duração, busca por nome/email
- [x] Relacionamento coach-aluno (coaches só veem seus alunos)
- [x] Validações completas
- [x] Cálculo automático de idade
- [x] Documentação Swagger atualizada

### ✅ Etapa 3 - Dashboard e Alimentos - Implementada
- [x] Dashboard do coach com indicadores
- [x] Total de alunos no protocolo
- [x] Protocolos ativos
- [x] Alunos recentes
- [x] Novos cadastros do período
- [x] CRUD completo de alimentos
- [x] Categorias: proteína, carboidrato, gordura, fruta, vegetal, laticínio, outro
- [x] Unidades: gramas, mililitros, unidade, colher, xícara, porção
- [x] Informações nutricionais completas
- [x] Filtros e ordenações
- [x] Validação nutricional automática

## 🎯 Endpoints da API

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro

### Dashboard (requer autenticação de coach)
- `GET /api/dashboard` - Dashboard completo do coach
- `GET /api/dashboard/students/stats` - Estatísticas de alunos por período
- `GET /api/dashboard/students/recent` - Alunos recentes

### Alunos (requer autenticação de coach)
- `POST /api/students` - Criar aluno
- `GET /api/students` - Listar alunos (com filtros)
- `GET /api/students/:id` - Buscar aluno por ID
- `PUT /api/students/:id` - Atualizar aluno
- `DELETE /api/students/:id` - Deletar aluno

### Alimentos (requer autenticação de coach)
- `POST /api/alimentos` - Criar alimento
- `GET /api/alimentos` - Listar alimentos (com filtros)
- `GET /api/alimentos/:id` - Buscar alimento por ID
- `PUT /api/alimentos/:id` - Atualizar alimento
- `DELETE /api/alimentos/:id` - Deletar alimento
- `GET /api/alimentos/categoria/:categoria` - Alimentos por categoria

### Filtros Disponíveis para Alunos
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)
- `search` - Busca por nome ou email
- `tipoPlano` - DIETA, TREINO, FULL
- `sexo` - MASCULINO, FEMININO
- `duracaoPlano` - MENSAL, TRIMESTRAL

### Filtros Disponíveis para Alimentos
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10)
- `categoria` - PROTEINA, CARBOIDRATO, GORDURA, FRUTA, VEGETAL, LATICINIO, OUTRO
- `nomeAlimento` - Busca por nome do alimento
- `orderBy` - nomeAlimento, categoria, calorias, createdAt
- `order` - asc, desc

## 🛡️ Segurança

- Rate limiting
- Helmet para headers de segurança
- Validação de dados
- Hash de senhas com bcrypt
- Proteção de rotas com JWT

## 📧 Notificações

O sistema suporta:
- Notificações internas
- Envio de emails (configurar SMTP)
- Notificações de boas-vindas automáticas

## 📖 Documentação Adicional

- **[SETUP.md](./SETUP.md)** - Guia detalhado de configuração
- **[MIGRATION-GUIDE.md](./MIGRATION-GUIDE.md)** - Guia de migração de alunos
- **[docs/api-examples.js](./docs/api-examples.js)** - Exemplos práticos de uso da API
- **[docs/api-dashboard-examples.md](./docs/api-dashboard-examples.md)** - Exemplos de dashboard e alimentos
- **Swagger UI** - Documentação interativa em `/api-docs`

## 🔧 Scripts Úteis

\`\`\`bash
# Configuração completa
npm run setup

# Migração específica de alunos
npm run migrate:students

# Migração específica de alimentos
npm run migrate:alimentos

# Reset completo do banco
npm run reset:db

# Interface visual do banco
npm run prisma:studio
