Biblioteca útil para a criação de interfaces de linha de comando (CLI) para aplicações NodeJS. As principais funções da biblioteca permitem criar prompts de comando, processar entradas do usuário e executar comandos apropriados.

## Como instalar 

Para instalar esta biblioteca, execute o seguinte comando no terminal:

```sh
npm install git@github.com:pliffer/cl.git
```

## Como usar

O script do exemplo abaixo mostra como você pode usar esta biblioteca em sua aplicação:

```javascript
const Cl = require('cl');

// Define uma função de comando
function helloWorld() {
  console.log('Olá, Mundo!');
}

// Adiciona a função de comando à interface CLI
Cl.add('hello', helloWorld, 'Imprime Olá, Mundo!');

// Inicializa a interface de linha de comando
Cl.init(process);
```

Agora quando você roda a sua aplicação e digita `hello` no prompt do comando, a mensagem 'Olá, Mundo!' será impressa.

## Documentação da API

### Cl.init(p)

Inicializa a interface da linha de comando.

### Cl.prompt()

Cria um novo prompt de comando.

### Cl.ask(msg, f)

Cria uma pergunta de confirmação com a mensagem fornecida (`msg`) e, em seguida, executa a função (`f`) se a resposta for afirmativa.

### Cl.execute(data)

Executa o comando fornecido (`data`).

### Cl.addModule(name, mod)

Adiciona um módulo de comandos à interface da linha de comando.

### Cl.add(command, f, description)

Adiciona um novo comando à interface da linha de comando.

### Cl.list()

Lista todos os comandos disponíveis.

## Contribuindo

Contribuições são bem-vindas! Sinta-se livre para abrir um Issue ou um Pull Request no repositório do Github.

## Licença

Esta biblioteca é licenciada sob a licença MIT.
