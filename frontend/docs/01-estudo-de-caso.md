# Estudo de Caso — Revista FITITEL

## 1. Contexto

A **FITITEL** é uma revista angolana focada em tecnologia, inovação e cultura digital. O projecto actual consiste na reconstrução completa da sua plataforma digital — um sistema que integra um **site público** (apresentação de edições, flipbook interactivo), uma **área de leitor** (biblioteca pessoal, compras, favoritos) e uma **área de gestão** (admin/editor) com controle de acesso baseado em funções.

## 2. Problema

A plataforma anterior era estática e não permitia:

- Autenticação e área pessoal para leitores
- Compra individual de edições digitais
- Gating de conteúdo (pré-visualização vs. acesso total)
- Gestão centralizada de edições e editores
- Registro de auditoria (logs de actividade)
- Relatórios financeiros

## 3. Solução Proposta

Aplicação single-page (SPA) em React com três zonas distintas:

### 3.1 Site Público (`/`, `/edition/:id`, `/edition/:id/flipbook`)

- Página inicial com hero e listagem de edições (estilo system-log)
- Página de detalhe da edição com tabs (descrição, índice, detalhes técnicos)
- Flipbook interactivo com navegação página-a-página
- Conteúdo gratuito vs. pago com pré-visualização limitada

### 3.2 Área do Leitor (`/login`, `/register`, `/library`)

- Autenticação por email/senha com persistência de sessão
- Registo de novos leitores
- Biblioteca pessoal com separadores "Compras" e "Favoritos"
- Compra de edições com um clique (mock)
- Favoritos (toggle coração)

### 3.3 Área de Gestão (`/admin/*`)

- **Admin**: Dashboard com métricas, CRUD de edições, CRUD de editores, gestão de leitores, relatórios financeiros, logs de auditoria
- **Editor**: Dashboard simplificado + CRUD de edições apenas
- Sidebar com navegação contextual por role

## 4. Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                    React SPA                         │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Público  │  │  Leitor  │  │  Gestão (Admin)  │  │
│  │           │  │          │  │                  │  │
│  │  Home     │  │  Login   │  │  Dashboard       │  │
│  │  Detail   │  │  Registo │  │  Edições CRUD    │  │
│  │  Flipbook │  │  Library │  │  Editores CRUD   │  │
│  │           │  │          │  │  Leitores        │  │
│  │           │  │          │  │  Relatórios      │  │
│  │           │  │          │  │  Logs            │  │
│  └──────────┘  └──────────┘  └──────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │           AuthContext (role-based)              │  │
│  │  admin / editor / reader / null (anónimo)       │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │           Mock Data Layer (in-memory)           │  │
│  │  editions / editors / readers / purchases       │  │
│  │  favorites / comments / logs / flipbook         │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 5. Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 |
| Routing | React Router v7 (nested routes) |
| Build | Vite 5 |
| Estilos | CSS custom properties (monolithic, ~4k lines) |
| Tipografia | Space Grotesk (display/sans) + Fira Code (mono) |
| Persistência | localStorage (apenas sessão auth) |
| Dados | Mocks in-memory (substituível por API REST) |

## 6. Funcionalidades Implementadas

### Site Público
- [x] Home com hero + listagem de edições (system-log style)
- [x] Página de detalhe da edição (metadata, tags, artigos, tabs)
- [x] Flipbook interactivo (navegação spread, comentários internos)
- [x] Pré-visualização limitada para edições pagas (4 páginas)
- [x] Edições relacionadas

### Leitor
- [x] Login com email/senha
- [x] Registo de novos leitores
- [x] Sessão persistente (localStorage)
- [x] Biblioteca pessoal (compras + favoritos)
- [x] Compra de edição com um clique
- [x] Favoritar/desfavoritar edições
- [x] Header adaptável (anónimo vs. logado)

### Gestão (Admin/Editor)
- [x] Dashboard com métricas por role
- [x] CRUD de edições (criar, editar, apagar)
- [x] Upload de PDF (base64 mock)
- [x] Toggle gratuito/pago com campo de preço condicional
- [x] CRUD de editores (admin-only)
- [x] Lista de leitores com estatísticas (compras, favoritos, comentários)
- [x] Detalhe do leitor com abas
- [x] Relatórios financeiros (admin-only)
- [x] Logs de auditoria com filtros (admin-only)

### Cross-cutting
- [x] Role-based access control (admin, editor, reader)
- [x] Rotas protegidas (ProtectedRoute, RequireRole, ReaderRoute)
- [x] Logs de actividade para operações CRUD
- [x] Design system com paleta escura (#0B1120) e terminal aesthetic

## 7. Próximos Passos (Backend)

1. Implementar API REST conforme documentação (`docs/03-api.md`)
2. Substituir mock data por chamadas HTTP
3. Implementar base de dados conforme MER (`docs/02-mer.md`)
4. Autenticação JWT real
5. Upload de PDF real (não base64)
6. Processamento de pagamentos
7. CDN para imagens e PDFs
