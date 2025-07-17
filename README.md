# Projeto InsideTec - Aplicação Full-Stack

Este é o projeto completo do site corporativo da InsideTec. Originalmente uma versão estática, o projeto foi evoluído para uma aplicação full-stack com um back-end em Node.js para processar o formulário de contato.

## Tecnologias Utilizadas

-   **Front-end**: HTML5, CSS3 (com Variáveis), JavaScript (ES6+)
-   **Back-end**: Node.js, Express.js
-   **Envio de E-mail**: Nodemailer
-   **Ícones**: Font Awesome
-   **Fontes**: Google Fonts (Inter)

## Estrutura dos Arquivos

insidetec-site/
├── assets/
│   ├── css/
│   │   └── style.css         # Estilos principais
│   ├── images/             # Imagens otimizadas do site
│   └── js/
│       └── script.js         # Lógica do front-end
├── node_modules/             # Dependências do Node.js (gerado via npm)
├── .env                      # Arquivo para variáveis de ambiente (NÃO versionar)
├── .gitignore                # Arquivo para ignorar o node_modules e .env
├── index.html                # Página principal
├── desenvolvimento.html      # Páginas de serviços...
├── manutencao.html
├── outsourcing.html
├── package.json              # Definições e dependências do projeto Node.js
├── package-lock.json         # Lockfile de dependências
├── README.md                 # Este arquivo
└── server.js                 # Servidor back-end (Node.js)

## Como Executar o Projeto Localmente

Para executar a aplicação completa (front-end e back-end), siga estes passos:

### 1. Pré-requisitos
-   **Node.js**: É necessário ter o Node.js instalado. Você pode baixá-lo em [nodejs.org](https://nodejs.org/).

### 2. Instalação
-   Abra um terminal na pasta raiz do projeto.
-   Execute o comando abaixo para instalar todas as dependências do back-end:
    ```bash
    npm install
    ```

### 3. Configuração do Ambiente
-   Crie um arquivo chamado `.env` na raiz do projeto.
-   Copie e cole o conteúdo abaixo no arquivo `.env`, substituindo pelos seus dados:

    ```env
    # Porta em que o servidor back-end irá rodar
    PORT=3000

    # Configuração do seu e-mail para enviar as notificações (Ex: Gmail)
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=seu-email-aqui@gmail.com
    EMAIL_PASS=sua-senha-de-aplicativo-aqui

    # E-mail que irá receber as mensagens do formulário
    RECIPIENT_EMAIL=email-de-destino@exemplo.com
    ```
-   **IMPORTANTE**: Para o `EMAIL_PASS` do Gmail, você deve usar uma **"Senha de Aplicativo"** e não a sua senha principal. [Siga as instruções do Google para gerar uma](https://support.google.com/accounts/answer/185833).

### 4. Execução
-   Com o terminal ainda na raiz do projeto, inicie o servidor back-end:
    ```bash
    node server.js
    ```
-   Você verá a mensagem `Servidor back-end rodando na porta 3000`. Mantenha o terminal aberto.
-   Agora, abra o arquivo `index.html` em seu navegador. O site estará totalmente funcional, e o formulário de contato enviará e-mails de verdade.

## Funcionalidades Implementadas

-   **Navegação Responsiva**: Menu funcional em todas as resoluções.
-   **Front-end Robusto**: Código CSS e JavaScript organizado, comentado e modularizado.
-   **Acessibilidade**: Melhorias de semântica, contraste e atributos ARIA para uso universal.
-   **Performance**: Imagens otimizadas e servidas localmente para carregamento rápido.
-   **Back-end de Contato**: Formulário de contato funcional que envia os dados para um e-mail configurado via Nodemailer.

## Personalização

-   **Conteúdo e Estilos**: Para alterar o visual e os textos, edite os arquivos `.html` e o `assets/css/style.css` como antes.
-   **Comportamento do Back-end**: Para alterar a lógica de envio de e-mail ou adicionar novas rotas, edite o arquivo `server.js`.

## Licença

Este código foi criado para a InsideTec e pode ser usado livremente para os fins comerciais da empresa.