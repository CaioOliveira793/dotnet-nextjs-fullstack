# Challenge frontend NextJS

Minha solução frontend para o desafio fullstack.

## Como executar

No diretório `company-leads-front` deste repositório, execute `pnpm run dev` para iniciar o servidor do NextJS em desenvolvimento.

Após iniciar o Next, a interface estará disponível em [http://localhost:3000](http://localhost:3000).

Certifique de estar rodando o servidor backend em desenvolvimento, acessível em [http://localhost:5004](http://localhost:5004).

### Docker

TODO: add docker setup
TODO: add docker instructions

## Lint

O projeto foi desenvolvido com total suporte ao `typescript`, fazendo o uso extenso de tipos.

Para verificar a validade dos tipos, execute `pnpm run check:type`.

Lints de código do NextJS e regras de formatação de cógido podem ser verificados pelo comando `pnpm run check:lint`.

Para verificar os tipos e todos os lints em paralelo, execute `pnpm run check`.

## Build

Para fazer o build, execute `pnpm run build`.
