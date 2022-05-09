# NestJs TypeScript starter

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app using node server (the normal way)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
### .env file
See the .env.example file and then create new .env file based on that file.
Make sure to set up .env variables in order to adjust to your environment. 
If you plan to use local database then you have to create one in your local psql based on the data you have inputted in your .env file.

## Using Docker Compose

```sh
# Build the docker image
$ docker-compose build

# Start and login to the container
$ docker-compose up -d
$ docker-compose exec app sh
```
### Connect pgadmin container to psql image container
If you need to connect pgadmin to your psql then you will have to login to pgadmin ( read docker-compose.yml - pgadmin service ) and type the 'host' based on your .env variable TYPEORM_HOST

## Other useful Docker commands

```sh
# Get the container ID
$ docker ps

# View logs
$ docker logs <container id>

# Enter the container (In alpine, use sh because bash is not installed by default)
$ docker exec -it <container id> /bin/sh

```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
