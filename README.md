0. Install VS Code, nvm and Node.js
    - nvm?
    - Node.js?
1. npm init
    - npm?
2. Install, init and configure typescript
    - npm i typescript --save-dev
    - node_modules/typescript/bin/tsc --init
4. Install, init and configure tslint
    - npm install tslint --save-dev
    - ./node_modules/tslint/bin/tslint --init
5. Create src folder
    - mkdir src
    - add hello.ts
    - add "tsc" and "lint" scripts
6. Install libs
    - npm i --save koa koa-bodyparser koa-logger mysql2 bcryptjs dotenv jsonwebtoken umzug bluebird
    - npm install  ts-node --save-dev
    - https://github.com/sidorares/node-mysql2
7. Add types
    - npm install @types/node --save-dev
    - npm install @types/dotenv @types/umzug --save-dev
    - npm install @types/mysql2 --save-dev -> E404
    - npm i --save-dev @types/bluebird

7. Migrations
    - mkdir src/db && mkdir src/db/migrations && touch src/db/migrate.ts
    - generate a new migration > new Date().getTime()

Issues

[ts] Property 'repeat' does not exist on type '"="' -> change target to ES2015 and change TS version to 3 from bottom left