# Frota — Frontend + Backend (Docker)

Painel web (React + Tailwind CSS) para gestão de **usuários** e **veículos**, integrado ao backend Node.js/Express já desenvolvido na atividade anterior. Toda a aplicação (frontend + backend + bancos de dados) sobe com um único comando de Docker Compose.

## Estrutura esperada do repositório

```
project-root/
├── backend/              # API Node/Express já existente (não incluída nesta entrega)
├── frontend/              # Aplicação React + Tailwind (esta entrega)
├── docker-compose.yml     # Orquestra frontend + backend + Postgres + Mongo
└── .env.example
```

> Se a pasta do backend no seu repositório tiver outro nome, ajuste o campo `context` do serviço `api` em `docker-compose.yml`.

## Como subir o projeto completo

```bash
git clone <url-do-seu-repositorio>
cd project-root

cp .env.example .env
# edite o .env se necessário (JWT_SECRET, FRONTEND_API_URL)

docker compose up --build
```

Depois disso:

| Serviço     | URL                              |
|-------------|-----------------------------------|
| Frontend    | http://localhost:8080             |
| Backend API | http://localhost:3000             |
| Swagger     | http://localhost:3000/api-docs    |
| PostgreSQL  | localhost:5432                    |
| MongoDB     | localhost:27017                   |

Não é necessário rodar `npm install`, `npm run dev` ou qualquer comando manual — o `Dockerfile` do frontend faz o build de produção (Vite) dentro do container e serve os arquivos estáticos via Nginx.

## Como o frontend acessa a API

A URL da API **não é fixada no código nem no build da imagem**. Ela é resolvida em duas camadas:

1. Em desenvolvimento (`npm run dev`, fora do Docker), o Vite lê `VITE_API_URL` do arquivo `frontend/.env` (veja `frontend/.env.example`).
2. Em produção (dentro do container), o script `docker-entrypoint.sh` gera, **quando o container sobe**, o arquivo `public/env-config.js` com o valor da variável de ambiente `API_URL` definida no `docker-compose.yml`. O `index.html` carrega esse arquivo antes do bundle React, expondo `window.APP_CONFIG.API_URL`.

Isso permite trocar a URL da API (ex: ao publicar em outro host) só mudando a variável de ambiente no `docker-compose.yml`/`.env`, sem rebuildar a imagem.

**Importante:** como o React roda inteiramente no navegador do usuário (não há SSR), a `API_URL` precisa ser um endereço alcançável a partir do navegador — por isso o padrão é `http://localhost:3000` (a porta do backend publicada no host), e não `http://api:3000` (que só existe dentro da rede interna do Docker).

## Funcionalidades implementadas

- **Login** (`POST /login`) com token JWT armazenado no `localStorage` e anexado automaticamente (`Authorization: Bearer`) em toda requisição autenticada.
- **Cadastro público** (`POST /register`) — cria contas sempre com papel `user`.
- **Rotas protegidas** no frontend: `/`, `/usuarios` e `/veiculos` redirecionam para `/login` se não houver sessão válida. Se a API responder `401`/`403` em qualquer chamada, a sessão é encerrada automaticamente e o usuário é avisado.
- **CRUD de usuários** (`GET/PUT/DELETE /users`, criação via `/register`).
- **CRUD de veículos** (`GET /vehicles/:type`, `POST/PUT/DELETE /vehicles`), com seleção de tipo (carro/moto), já que a API não tem endpoint para listar todos os veículos de uma vez.
- **Mensagens de sucesso/erro** via toasts para todas as operações, com extração padronizada de mensagens da API (que ora retorna `{ message }`, ora `{ error }`).
- **Layout responsivo**: tabelas viram cards empilhados em telas pequenas, navegação com menu hambúrguer no mobile.

## Decisões e limitações conhecidas (baseadas no código real do backend)

- **Rotas de `/brands` não foram implementadas** no `VehicleController.js` enviado (as rotas existem em `routes/api.js`, mas as funções `createBrand`/`listBrands`/`updateBrand`/`deleteBrand` não existem no controller). Por isso essa tela não foi construída. Se o backend for completado, dá para replicar o padrão da tela de Veículos.
  > ⚠️ **Atenção, isso é independente do frontend:** com o `routes/api.js` exatamente como enviado, o Express vai falhar ao iniciar (`Route.post() requires a callback function but got a [object Undefined]`), porque essas rotas referenciam métodos que não existem no controller. Antes de subir o backend, remova essas 4 linhas de `/brands` em `routes/api.js` ou implemente os métodos correspondentes em `VehicleController.js`.
- **O backend não restringe ações por papel (`role`) no servidor** — o middleware `authenticate` só valida o token, não verifica se o usuário é `admin`. Por decisão deste projeto, o frontend também não restringe: qualquer usuário autenticado pode gerenciar usuários e veículos, espelhando o comportamento real da API.
- **Troca de senha não é suportada** pela rota `PUT /users/:id` (o controller só atualiza `username`, `email` e `role`), por isso o formulário de edição de usuário não tem campo de senha.
- **Veículos usam `_id` (MongoDB)**, enquanto usuários usam `id` (PostgreSQL) — o frontend trata os dois identificadores corretamente em cada recurso.

## Rodando o frontend fora do Docker (opcional, para desenvolvimento)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Isso não é o fluxo principal de entrega — o Docker Compose é a forma suportada de rodar a aplicação completa.

## Stack do frontend

- React 18 + Vite
- React Router 6
- Tailwind CSS
- Axios
- react-toastify

## Estrutura do código do frontend

```
frontend/src/
├── components/   # Navbar, Modal, ConfirmDialog, ProtectedRoute, Spinner, RoleBadge, EmptyState
├── pages/        # LoginPage, RegisterPage, DashboardPage, UsersPage, VehiclesPage, NotFoundPage
├── context/      # AuthContext (token JWT, usuário decodificado, login/logout)
├── services/     # api.js (axios + interceptors), authService, userService, vehicleService
├── config.js     # resolução da URL da API (runtime/Docker x build/dev)
├── App.jsx
└── main.jsx
```

## Publicando no GitHub

Este projeto foi gerado localmente. Para publicar:

```bash
cd project-root
git init
git add .
git commit -m "Frontend React + Tailwind integrado ao backend via Docker"
git branch -M main
git remote add origin <url-do-seu-repositorio-no-github>
git push -u origin main
```
