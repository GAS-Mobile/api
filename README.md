# GAS Mobile - API

API RESTful desenvolvida em Node.js/Express para gerenciamento de postos de combustível, análises e solicitações de análise.

## 🚀 Tecnologias

- **Node.js** 18+
- **Express.js** 4.21.2 (framework web)
- **MongoDB** + **Mongoose** 9.1.4 (banco de dados)
- **JWT** (autenticação)
- **bcrypt** 5.1.1 (hash de senhas)
- **Swagger** (documentação automática)
- **dotenv** 16.4.7 (variáveis de ambiente)

## 📁 Estrutura do Projeto

```
api/
├── src/
│   ├── server.js                 # Ponto de entrada da aplicação
│   ├── controllers/              # Lógica de negócio
│   │   ├── adminController.js    # Operações de administrador
│   │   ├── analystController.js  # Operações de analista
│   │   ├── customerController.js # Operações de consumidor
│   │   ├── authController.js     # Autenticação
│   │   ├── companyController.js  # Empresas
│   │   ├── analysisController.js # Análises
│   │   └── analysisRequestController.js # Solicitações
│   ├── models/                   # Schemas do Mongoose
│   │   ├── User.js              # Schema base (discriminator)
│   │   ├── Admin.js             # Administrador
│   │   ├── Analyst.js           # Analista
│   │   ├── Customer.js          # Consumidor
│   │   ├── Company.js           # Empresa/posto
│   │   ├── Analysis.js          # Análise de posto
│   │   ├── AnalysisRequest.js   # Solicitação de análise
│   │   └── ActiveRefreshToken.js # Tokens ativos
│   ├── routes/                   # Definição de rotas
│   │   ├── router.js            # Agregador de rotas
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── analystRoutes.js
│   │   ├── companyRoutes.js
│   │   ├── analysisRoutes.js
│   │   └── analysisRequestRoutes.js
│   ├── utils/                    # Utilitários
│   │   ├── auth.js              # Middlewares de autenticação
│   │   ├── databaseConnection.js # Conexão MongoDB
│   │   ├── formatters.js        # Formatadores
│   │   └── generateSwaggerDocumentation.js
│   └── documentation/
│       └── swagger-output.json   # Documentação Swagger
├── test/                         # Scripts de teste
│   ├── populate_database.py     # Popular banco com dados
│   ├── create_first_admin.py    # Criar admin inicial
│   └── test_api.py              # Testes básicos
├── .env                          # Variáveis de ambiente (não commitado)
├── .env.example                  # Template de variáveis
└── package.json
```

## 🗄️ Modelagem de Dados

### User (Schema Base)
Utiliza **discriminator pattern** do Mongoose para herança.

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  userType: String (enum: ['admin', 'analyst', 'customer']),
  createdAt: Date,
  updatedAt: Date
}
```

#### Customer (extends User)
```javascript
{
  // Herda campos de User
  requestsCount: Number
}
```

#### Analyst (extends User)
```javascript
{
  analysisCount: Number
}
```

#### Admin (extends User)
```javascript
{
  isSuperAdmin: Boolean
}
```

### Company (Posto de Combustível)
```javascript
{
  name: String (required),
  cnpj: String (unique, required),
  address: String,
  city: String,
  state: String,
  phone: String,
  email: String,
  averageRating: Number (0-5),
  analysisCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Analysis (Análise de Posto)
```javascript
{
  company: ObjectId (ref: Company),
  analyst: ObjectId (ref: Analyst),
  gasQuality: Number (0-5),
  serviceQuality: Number (0-5),
  priceRating: Number (0-5),
  facilityRating: Number (0-5),
  overallRating: Number (calculado),
  comments: String,
  analysisDate: Date,
  createdAt: Date
}
```

### AnalysisRequest (Solicitação de Análise)
```javascript
{
  customer: ObjectId (ref: Customer, required),
  company: ObjectId (ref: Company, required),
  status: String (enum: ['Pending', 'In analysis', 'Approved', 'Rejected']),
  motive: String (required),
  analyst: ObjectId (ref: Analyst),
  createdAt: Date,
  updatedAt: Date
}
```

### ActiveRefreshToken
```javascript
{
  user: ObjectId (ref: User, required),
  token: String (required, unique),
  createdAt: Date (expires após 7 dias)
}
```

## 🔐 Autenticação e Autorização

### JWT Tokens
- **Access Token**: Expira em 15 minutos
- **Refresh Token**: Expira em 7 dias, armazenado no banco

### Middlewares de Autorização

```javascript
authenticateToken      // Verifica access token válido
authorizeCustomer      // Requer userType: 'customer'
authorizeAnalyst       // Requer userType: 'analyst'
authorizeAdmin         // Requer userType: 'admin'
```

### Fluxo de Autenticação

1. **Cadastro**: `POST /auth/signup` → cria Customer
2. **Login**: `POST /auth/signin` → retorna accessToken + refreshToken
3. **Requisições**: Header `Authorization: Bearer {accessToken}`
4. **Renovação**: `POST /auth/refresh-token` com refreshToken
5. **Logout**: `POST /auth/signout` → invalida refreshToken

## 📡 Principais Endpoints

### Autenticação
```
POST   /api/v1/auth/signup          # Cadastro
POST   /api/v1/auth/signin          # Login
POST   /api/v1/auth/refresh-token   # Renovar token
POST   /api/v1/auth/signout         # Logout
```

### Empresas (Público/Customer)
```
GET    /api/v1/companies            # Listar (paginação, busca, filtros)
GET    /api/v1/companies/:id        # Detalhes
POST   /api/v1/companies            # Criar (Admin)
PATCH  /api/v1/companies/:id        # Atualizar (Admin)
DELETE /api/v1/companies/:id        # Deletar (Admin)
```

### Solicitações de Análise (Customer)
```
GET    /api/v1/requests             # Listar solicitações do usuário
GET    /api/v1/requests/:id         # Detalhes da solicitação
POST   /api/v1/requests             # Criar solicitação
PUT    /api/v1/requests/:id         # Editar motivo (customer)
DELETE /api/v1/requests/:id         # Excluir solicitação
PATCH  /api/v1/requests/:id         # Atualizar status (analyst)
```

### Análises (Analyst)
```
GET    /api/v1/analysis             # Listar análises
GET    /api/v1/analysis/:id         # Detalhes
POST   /api/v1/analysis             # Criar análise
GET    /api/v1/analysis/company/:id # Análises de uma empresa
```

### Administração (Admin)
```
GET    /api/v1/admin/users          # Listar usuários
GET    /api/v1/admin/analysts       # Listar analistas
PATCH  /api/v1/admin/users/:id/role # Alterar tipo de usuário
DELETE /api/v1/admin/users/:id      # Deletar usuário
```

## 🔧 Configuração e Execução

### Pré-requisitos
- Node.js 18+
- MongoDB instalado e rodando
- npm ou yarn

### Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações
```

### Variáveis de Ambiente (.env)

```env
# Servidor
PORT=8000

# MongoDB
MONGO_URI=mongodb://localhost:27017/gas_mobile

# JWT
JWT_SECRET=sua_chave_secreta_super_segura
JWT_REFRESH_SECRET=sua_chave_refresh_super_segura
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Ambiente
NODE_ENV=development
```

### Executar

```bash
# Desenvolvimento
npm start

# Produção
npm run prod
```

### Popular Banco de Dados

```bash
cd test

# Instalar dependências Python
pip install -r requirements.txt

# Criar primeiro admin
python create_first_admin.py

# Popular com dados de teste
python populate_database.py
```

## 🧪 Testes

```bash
# Executar testes da API
cd test
python test_api.py
```

## 📊 Recursos Implementados

### Paginação
```javascript
GET /companies?page=1&limit=10
```

### Busca
```javascript
GET /companies?search=posto+xyz
// Busca por nome ou CNPJ
```

### Filtros
```javascript
GET /companies?filter=bestCompanies
// Opções: bestCompanies, worstCompanies
```

### Ordenação
```javascript
GET /companies?sortBy=averageRating&order=desc
```

## 🎯 Decisões Técnicas

### Mongoose Discriminators
Permite herança de schemas (User → Customer/Analyst/Admin) mantendo tudo em uma collection, facilitando autenticação e queries.

### Separação Customer/Analyst nas Rotas
Diferentes endpoints para edição de solicitações:
- **PUT /requests/:id** (Customer): edita apenas `motive`
- **PATCH /requests/:id** (Analyst): edita apenas `status` e `analyst`

Evita conflitos e aumenta segurança.

### Refresh Tokens no Banco
Armazenar refresh tokens permite invalidação em logout e controle de sessões ativas.

### Cálculo Automático de Ratings
Ratings médios calculados automaticamente via aggregations, mantendo dados consistentes.

### Validações no Schema
Mongoose validators garantem integridade antes de chegar aos controllers.

## 🔒 Segurança

- ✅ Senhas hasheadas com bcrypt (salt rounds: 10)
- ✅ JWT com expiração curta
- ✅ Refresh tokens invalidados no logout
- ✅ Validação de tipos de usuário em middlewares
- ✅ Sanitização de inputs
- ✅ CORS configurado
- ✅ Rate limiting (recomendado para produção)

## 📝 Convenções de Código

- **Controllers**: funções async/await com try-catch
- **Models**: schemas Mongoose com validações
- **Rotas**: agrupadas por recurso
- **Respostas**: JSON padronizado
```javascript
// Sucesso
{ data: {...}, message: "Operação realizada" }

// Erro
{ error: "Mensagem de erro" }
```

## 🚧 Melhorias Futuras

- [ ] Implementar rate limiting
- [ ] Logging estruturado (Winston/Pino)
- [ ] Testes unitários e integração (Jest)
- [ ] Upload de imagens de análises
- [ ] Webhooks para notificações
- [ ] Cache com Redis
- [ ] Documentação OpenAPI completa
- [ ] Versionamento de API
- [ ] CI/CD pipeline

## 📚 Documentação Swagger

Acesse a documentação interativa em:
```
http://localhost:8000/api-docs
```

Gerada automaticamente via swagger-autogen.

## 🐛 Debug

### Logs
O servidor exibe logs detalhados de todas as requisições:
```
[GET] /api/v1/companies - 200 OK
[POST] /api/v1/requests - 201 Created
```

### Ferramentas Recomendadas
- **Postman/Insomnia**: Testar endpoints
- **MongoDB Compass**: Visualizar banco de dados
- **Nodemon**: Auto-restart em desenvolvimento

## 📄 Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo LICENSE.md para detalhes.

---

**Desenvolvido como backend para demonstração de habilidades em Node.js, Express, MongoDB e arquitetura RESTful.**