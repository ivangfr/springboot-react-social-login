# springboot-react-social-login

The goal of this project is to implement an application called `movie-app` to manage movies. For it, we will implement a back-end [`Spring Boot`](https://docs.spring.io/spring-boot/docs/current/reference/html/documentation.html) application called `movie-api` and a font-end [React](https://react.dev/) application called `movie-ui`. Besides, we will use [`OAuth2`](https://en.wikipedia.org/wiki/OAuth#OAuth_2.0) (Social Login) to secure both applications.

## Proof-of-Concepts & Articles

On [ivangfr.github.io](https://ivangfr.github.io), I have compiled my Proof-of-Concepts (PoCs) and articles. You can easily search for the technology you are interested in by using the filter. Who knows, perhaps I have already implemented a PoC or written an article about what you are looking for.

## Additional Readings

- \[**Medium**\] [**Implementing A Full Stack Web App Using Spring-Boot and React**](https://medium.com/javarevisited/implementing-a-full-stack-web-app-using-spring-boot-and-react-7db598df4452)
- \[**Medium**\] [**Implementing Social Login in a Spring Boot and React App**](https://medium.com/@ivangfr/implementing-social-login-in-a-spring-boot-and-react-app-6ce073c9983c)
- \[**Medium**\] [**How to Create an OAuth2 App in GitHub**](https://medium.com/@ivangfr/how-to-create-an-oauth2-app-in-github-8e273e376408)
- \[**Medium**\] [**How to Create an OAuth2 App in Google**](https://medium.com/@ivangfr/how-to-create-an-oauth2-app-in-google-10e846d23adb)
- \[**Medium**\] [**Building a Web Chat with Social Login using Spring Boot: Introduction**](https://medium.com/@ivangfr/building-a-web-chat-with-social-login-using-spring-boot-introduction-644702e6be8e)
- \[**Medium**\] [**Building a Single Spring Boot App with Keycloak or Okta as IdP: Introduction**](https://medium.com/@ivangfr/building-a-single-spring-boot-app-with-keycloak-or-okta-as-idp-introduction-2814a4829aed)

## Project Diagram

![project-diagram](documentation/project-diagram.jpeg)

## Applications

- ### movie-api

  `Spring Boot` Web Java backend application that exposes a Rest API to create, retrieve and delete movies. If a user has `ADMIN` role he/she can also retrieve information of other users or delete them. The application secured endpoints can just be accessed if a valid JWT access token is provided.
  
  In order to get the JWT access token, the user can login using the credentials (`username` and `password`) created when he/she signed up directly to the application.
  
  `movie-api` stores its data in [`Postgres`](https://www.postgresql.org/) database.

  `movie-api` has the following endpoints:

  | Endpoint                                                      | Secured | Roles           |
  | ------------------------------------------------------------- | ------- | --------------- |
  | `POST /auth/authenticate -d {"username","password"}`          | No      |                 |
  | `POST /auth/signup -d {"username","password","name","email"}` | No      |                 |
  | `GET /public/numberOfUsers`                                   | No      |                 |
  | `GET /public/numberOfMovies`                                  | No      |                 |
  | `GET /api/users/me`                                           | Yes     | `ADMIN`, `USER` |
  | `GET /api/users`                                              | Yes     | `ADMIN`         |
  | `GET /api/users/{username}`                                   | Yes     | `ADMIN`         |
  | `DELETE /api/users/{username}`                                | Yes     | `ADMIN`         |
  | `GET /api/movies [?text]`                                     | Yes     | `ADMIN`, `USER` |
  | `POST /api/movies -d {"imdb","description"}`                  | Yes     | `ADMIN`         |
  | `DELETE /api/movies/{imdb}`                                   | Yes     | `ADMIN`         |

- ### movie-ui

  `React` frontend application where a user with role `USER` can retrieve the information about movies. On the other hand, a user with role `ADMIN` has access to all secured endpoints, including endpoints to create and delete movies.
  
  In order to access the application, a `user` or `admin` can login using his/her `Github` account or using the credentials (`username` and `password`) created when he/she signed up directly to the application. All the requests coming from `movie-ui` to secured endpoints in `movie-api` have the JWT access token. This token is generated when the `user` or `admin` logins.
  
  `movie-ui` uses [`Semantic UI React`](https://react.semantic-ui.com/) as CSS-styled framework.

## Creating OAuth2 apps for Social Login

- **Github**

  In the **Medium** article, [**How to Create an OAuth2 App in GitHub**](https://medium.com/@ivangfr/how-to-create-an-oauth2-app-in-github-8e273e376408), we will walk you through the process of creating an OAuth2 app in `GitHub`.

- **Google**

  In the **Medium** article, [**How to Create an OAuth2 App in Google**](https://medium.com/@ivangfr/how-to-create-an-oauth2-app-in-google-10e846d23adb), we will show in details how to create an OAuth2 app in `Google`.

## How Social Login Works?

In the **Medium** article, [**Implementing Social Login in a Spring Boot and React App**](https://medium.com/@ivangfr/implementing-social-login-in-a-spring-boot-and-react-app-6ce073c9983c), we show the complete Social Login flow, covering the request and redirections among `movie-ui`, `movie-api` and `GitHub` provider.

## Prerequisites

- [`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [`Java 17+`](https://www.oracle.com/java/technologies/downloads/#java17)
- [`Docker`](https://www.docker.com/)
- [`jq`](https://stedolan.github.io/jq)

## Start Environment

- In a terminal, make sure you are inside `springboot-react-social-login` root folder;

- Run the following command to start docker compose services:
  ```
  docker compose up -d
  ```

## Running movie-app using Maven & Npm

- **movie-api**

  - Open a terminal and navigate to `springboot-react-social-login/movie-api` folder;

  - Export the following environment variables for the `Client ID` and `Client Secret` of the Social Apps (see how to get them in [Creating OAuth2 apps for Social Login](#creating-oauth2-apps-for-social-login)):
    ```
    export GITHUB_CLIENT_ID=...
    export GITHUB_CLIENT_SECRET=...
    export GOOGLE_CLIENT_ID=...
    export GOOGLE_CLIENT_SECRET=...
    ```

  - Run the following `Maven` command to start the application:
    ```
    ./mvnw clean spring-boot:run
    ```

- **movie-ui**

  - Open another terminal and navigate to `springboot-react-social-login/movie-ui` folder;

  - Run the command below if you are running the application for the first time:
    ```
    npm install
    ```

  - Run the `npm` command below to start the application:
    ```
    npm start
    ```

## Applications URLs

| Application  | URL                                   | Credentials                                         |
| ------------ | ------------------------------------- | --------------------------------------------------- |
| movie-api    | http://localhost:8080/swagger-ui.html |                                                     |
| movie-ui     | http://localhost:3000                 | `admin/admin`, `user/user` or signing up a new user |

## Demo

- The gif below shows a `user` loging in using the `Github`:

  ![github-login](documentation/github-login.gif)

- The gif below shows an `admin` loging in using his application account:

  ![admin-login](documentation/admin-login.gif)

## Testing movie-api Endpoints

- **Manual Test**

  - Access `movie-ui` at http://localhost:3000;

  - Click `Login` and then, connect with `Github`;
  
  - Provide your `Github` credentials.

- **Automatic Endpoints Test**

  - Open a terminal and make sure you are in `springboot-react-social-login` root folder;

  - Run the following script:
    ```
    ./movie-api/test-endpoints.sh
    ```
    It should return something like the output below, where it shows the http code for different requests:
    ```
    POST auth/authenticate
    ======================
    admin access token
    ------------------
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1ODY2MjM1MjksImlhdCI6MTU4Nj..._ha2pM4LSSG3_d4exgA
    
    user access token
    -----------------
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1ODY2MjM1MjksImlhdCIyOSwian...Y3z9uwhuW_nwaGX3cc5A
    
    POST auth/signup
    ================
    user2 access token
    ------------------
    eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1ODY2MjM1MjksImanRpIjoiYTMw...KvhQbsMGAlFov1Q480qg

    Authorization
    =============
                    Endpoints | without token |  user token |  admin token |
    ------------------------- + ------------- + ----------- + ------------ |
     GET public/numberOfUsers |           200 |         200 |          200 |
    GET public/numberOfMovies |           200 |         200 |          200 |
    ......................... + ............. + ........... + ............ |
            GET /api/users/me |           401 |         200 |          200 |
               GET /api/users |           401 |         403 |          200 |
         GET /api/users/user2 |           401 |         403 |          200 |
      DELETE /api/users/user2 |           401 |         403 |          200 |
    ......................... + ............. + ........... + ............ |
              GET /api/movies |           401 |         200 |          200 |
             POST /api/movies |           401 |         403 |          201 |
       DELETE /api/movies/abc |           401 |         403 |          200 |
    ------------------------------------------------------------------------
     [200] Success -  [201] Created -  [401] Unauthorized -  [403] Forbidden
    ```

## Util Commands

- **Postgres**
  ```
  docker exec -it postgres psql -U postgres -d moviedb
  \dt
  ```

## Shutdown

- To stop `movie-api` and `movie-ui`, go to the terminals where they are running and press `Ctrl+C`;

- To stop and remove docker compose containers, network and volumes, go to a terminal and, inside `springboot-react-social-login` root folder, run the command below:
  ```
  docker compose down -v
  ```

## How to upgrade movie-ui dependencies to latest version

- In a terminal, make sure you are in `springboot-react-social-login/movie-ui` folder;

- Run the following commands:
  ```
  npm upgrade
  npm i -g npm-check-updates
  ncu -u
  npm install
  ```

## References

- https://www.callicoder.com/spring-boot-security-oauth2-social-login-part-1/