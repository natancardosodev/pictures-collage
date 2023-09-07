# Pictures Collage

É um editor de colagem de imagens para confecção de cartazes para divulgação de eventos.

![Screen Capture](/assets/images/screen-capture.png)

_Fotografia de Dragos Gontariu na [Unplash](https://unsplash.com/)_

## Como usar?

-   Clique no botão `Escolher Arquivo`, dê permissão para envio caso esteja no celular
-   Procure a imagem e clique em algum botão como `Concluído/Abrir`.
-   Enviada a imagem basta clicar em `Baixar Imagem`
-   Depois no botão de `compartilhar` enviar para a rede social desejada.

## Demonstrativo

-   https://criar-cartaz-euvou.netlify.app/?evento=evento-exemplo

## Features

-   HTML, Sass, Javascript
-   Bootstrap 5
-   jQuery 3
-   Font Awesome 6
-   Webpack 4
-   ESLint, Stylelint e Prettier
-   Husky

## Instalação

-   **Requisitos:** Node.js v14

```sh
npm install
npm run start ## modo watch
```

-   **Deploy:** `npm ci --production && npm run build`

## Execução local

-   **Opção 1** - Modo Build
    -   Rodar `npm run build && npm run server`
    -   E Acessar http://127.0.0.1:5500/index.html?evento=evento-exemplo
-   **Opção 2** - Modo Watch
    -   Executar `npm run start`
    -   Habilitar a extensão do `VS Code` chamada Live Server `ext install ritwickdey.LiveServer`
    -   E Acessar http://127.0.0.1:5500/public/index.html?evento=evento-exemplo
    -   _Extra:_ Rodar o `ngrok http 5500` (Caso deseje enviar seu localhost para teste externo)
