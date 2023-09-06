# Import Generator

### Gerador de imports de arquivos

Versão 1.1 - Autor: Natan Cardoso (Vox) - Junho/2019

Utilizado para gerar bundles de arquivos Javascript, concatenando arquivos que estejam em um mesmo diretório. Se o
diretório colocado tiver subpastas, o gerador também captura. Nesse projeto foi usado este criador de bundles JS, pois a
configuração projetada para o Webpack captura todos os arquivos em `/assets` e lança no `/public/dist` com o mesmo path.
Foi necessário essa estratégia, pois a filosofia do original do webpack é importar arquivo por arquivo, contudo usando
desta forma pode ser chamado no html um conjunto de arquivos de mesma responsabilidade concatenados num arquivo. O
webpack também tem a opção de criar bundles, contudo o que inviabilizou foi a configuração dos entry's.

A execução da função encontra-se em `public/import-generator/gerar.js` e a base do código em `importacao.js`. Para
executar o comando basta executar `npm run imports`, o qual está sendo executado em modo de desenvolvimento e produção.
Para utilizar em desenvolvimento precisa está instalado o Node.js.

Ao executar a função no arquivo `gerar.js` é criado os bundles que devem ser criados de acordo com as pastas base em
`/assets/js`. Os bundles são criados com os mesmos nomes das pastas com a terminação `.imports.js`. Ao passar pelo
Webpack passasse pelo Babel, o qual é transpilado os scripts em ES6, e retira-se a terminação imports do nome do
arquivo. A implementação possui validação de diretórios inexistentes e sem arquivos.
