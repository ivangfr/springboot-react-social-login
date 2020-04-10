# springboot-react-social-login

The goal of this project is to implement an application called `movie-app` to manage movies. For it, we will implement a back-end application called `movie-api` using [`Spring Boot`](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/) framework and a font-end application called `movie-ui` using [ReactJS](https://reactjs.org/). Besides, we will use [`OAuth2`](https://en.wikipedia.org/wiki/OAuth#OAuth_2.0) (Social Login) to secure both applications.

## Applications

- **movie-api**

  `Spring Boot` Web Java backend application that exposes a Rest API to manage movies. Its sensitive endpoints can just be just accessed if a user is authenticated and has autorization roles for it. `movie-api` stores its data in [`MySQL`](https://www.mysql.com/) database.

  `movie-api` has the following endpoints

  | Endpoint                                           | Authenticated | Roles           |
  | -------------------------------------------------- | ------------- | --------------- |
  | `GET /public/numberOfMovies`                       | No            |                 |
  | `GET /api/movies`                                  | Yes           | `ADMIN`, `USER` |
  | `GET /api/movies/{imdb}`                           | Yes           | `ADMIN`, `USER` |
  | `POST /api/movies {"imdb": "...", "title": "..."}` | Yes           | `ADMIN`         |
  | `DELETE /api/movies/{imdb}`                        | Yes           | `ADMIN`         |

- **movie-ui**

  `ReactJS` frontend application where `users` can see the list of movies and `admins` can manage movies. To login, the `user` must provide valid credentials store in his/her social network application. `movie-ui` communicates with `movie-api` to get `movie` and `users` data. It uses [`Semantic UI React`](https://react.semantic-ui.com/) as CSS-styled framework.

## Creating Github App

Github apps can be created from https://github.com/settings/apps

## Start Environment

- Open a terminal and inside `springboot-react-social-login` root folder run
  ```
  docker-compose up -d
  ```

- Wait a little bit until `mysql` container is Up (healthy). You can check their status running
  ```
  docker-compose ps
  ```

## Running movie-app using Maven & Npm

- **movie-api**

  - Open a terminal and navigate to `springboot-react-social-login/movie-api` folder

  - Run the following `Maven` command to start the application
    ```
    ./mvnw clean spring-boot:run
    ```

- **movie-ui**

  - Open another terminal and navigate to `springboot-react-social-login/movie-ui` folder

  - \[Optional\] Run the command below if you are running the application for the first time
    ```
    npm install
    ```

  - Run the `npm` command below to start the application
    ```
    npm start
    ```

## Applications URLs

| Application  | URL                   | Credentials |
| ------------ | --------------------- | ----------- |
| movie-api    | http://localhost:8080 |             |
| movie-ui     | http://localhost:3000 |             |

## Demo

The gif below shows ...

## Testing movie-api Endpoints

TODO

## Util Commands

- **MySQL**
  ```
  docker exec -it mysql mysql -uroot -psecret --database=moviedb
  show tables;
  ```

## Shutdown

- Go to `movie-api` and `movie-ui` terminals and press `Ctrl+C` on each one

- Stop and remove docker-compose containers, networks and volumes, run the command below in `springboot-react-social-login` root folder
  ```
  docker-compose down -v
  ```

## How to upgrade movie-ui dependencies to latest version

- In a terminal, make sure you are in `springboot-react-social-login/movie-ui` folder

- Run the following commands
  ```
  npm i -g npm-check-updates
  ncu -u
  npm install
  ```