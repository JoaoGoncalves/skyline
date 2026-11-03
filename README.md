# Skyline ✈️

Projeto integrador do curso **React Avançado** (moOngy · 2026): uma aplicação de pesquisa e reserva de voos, construída sessão a sessão com **React 19 + TypeScript + Vite**.

Formador: João Gonçalves · [joaogoncalves.net](https://joaogoncalves.net) · edu@joaogoncalves.net

## Requisitos

- **Node.js 22.12 ou superior** (recomendado: 24 LTS) — o Vite 8 não arranca com versões anteriores. Confirmar com `node -v`.
- Git
- Browser com o **React Developer Tools**
- Editor: VS Code (recomendado)

## Arrancar

```bash
git clone https://github.com/JoaoGoncalves/skyline.git
cd skyline
git checkout sessao-01      # o estado no fim da sessão que querem ver
npm install
npm start                   # API (json-server, :3000) + app (Vite, :5173)
```

- App: http://localhost:5173
- API: http://localhost:3000/flights

O `npm start` tem de mostrar **duas** saídas no terminal (json-server e Vite).
Para mudar de sessão: `git checkout sessao-NN` (e `npm install`, se o `package.json` tiver mudado).

## Uma tag por sessão

Cada sessão termina com uma tag com o código escrito na aula: `sessao-01`, `sessao-02`, …
O ramo `main` tem sempre a versão mais recente.

## Material do curso — pasta `curso/`

| Pasta | O que tem |
|---|---|
| `curso/slides/` | PDF dos slides de cada sessão |
| `curso/exercicios/` | Exercício de revisão de cada sessão (corrigido no início da sessão seguinte) |
| `curso/snippets/` | O código da aula, passo a passo, pela ordem dos slides |

## Scripts

| Comando | O quê |
|---|---|
| `npm start` | API + app em paralelo |
| `npm run dev` | só a app (Vite) |
| `npm run api` | só a API (json-server 0.17, porta 3000) |
| `npm run build` | verificação de tipos (`tsc -b`) + build de produção |
| `npm run lint` | oxlint |

## Problemas comuns

- **O Vite não arranca** → versão do Node abaixo de 22.12. Atualizar para o 24 LTS.
- **Porta 3000 ocupada** → no `package.json`, script `api`, trocar para `--port 3001`.
- **`/flights` não existe** → o `db.json` tem de estar na raiz do projeto antes do `npm start`.
- **O VS Code mostra erros de TypeScript diferentes do `npm run build`** → abrir um `.tsx`, Command Palette → *TypeScript: Select TypeScript Version* → *Use Workspace Version*.
