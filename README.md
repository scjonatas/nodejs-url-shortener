# Encurtador de URLs em NodeJS

Este encurtador de URLs é uma API desenvolvida em NodeJS, Express.js e banco de dados MySQL.

Os hashes gerados pelo encurtador possuem entre 5 e 10 caracteres (apenas letras e números).

A validade das URL's geradas é apenas de 1 minuto, para facilitar os testes.

## Como executar a aplicação:

Para executar a aplicação, basta acessar a pasta e executar o seguinte comando:
`docker-compose up -d`

## Como executar os testes:

Para executar os testes, após ter executado o comando acima para criar os containers, basta executar o seguinte comando:
`docker-compose exec web npm run test`

## Como utilizar a API:

Para encurtar uma URL, basta fazer uma requisição da seguinte forma:

Method: POST
Endpoint: http://localhost:8081/encutador
Body:

```
{
    "url": "https://google.com.br"
}
```

Response:

```
{
    "newUrl": "http://localhost:8081/d479152d"
}
```

Ao acessar a URL encurtada, você será redirecionado para a URL original.
Caso o hash informado não seja encontrado no banco de dados, será retornado um JSON contendo a mensagem de erro e o status HTTP 404. Caso a URL já tenha expirado, então será retornado um JSON no mesmo formato, porém com o status HTTP 400.
