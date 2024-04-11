# TP Cloud

Emerging streaming platform specializing in movie recommendations based on user preferences

### Stack

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Swagger](https://img.shields.io/badge/-Swagger-%23Clojure?style=for-the-badge&logo=swagger&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![CircleCI](https://img.shields.io/badge/circle%20ci-%23161616.svg?style=for-the-badge&logo=circleci&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

## Links

- [User Interface](https://tp-cloud.vercel.app) (UI)
- [API Documentation](https://tp-cloud.vercel.app/docs) (Swagger)

## Roadmap

### API endpoints

- [X]  /auth/signup
- [X]  /auth/signin
- [X]  /auth/user
- [X]  /auth/logout
- [X]  /movies
- [X]  /movies/search
- [X]  /movies/discover/recommended
- [X]  /movies/discover/toprated
- [X]  /movies/[idMovie]
- [X]  /movies/[idMovie]/likes
- [X]  /movies/[idMovie]/videos

### Swagger

- [X]  Swagger UI

### UI

- [X]  Navbar
- [X]  Home page
    - [ ]  search bar
    - [ ]  like button
- [X]  Authentication pages
    - [X] Sign-up
    - [X] Sign-in
    - [X] Profile
- [ ]  Movie details page
- [ ]  Favorite movies page
- [ ]  Discover page

### Unit tests

#### API

- [X]  /auth/signup
- [X]  /auth/signin
- [X]  /auth/user
- [X]  /auth/logout
- [X]  /movies
- [X]  /movies/search
- [X]  /movies/discover/recommended
- [X]  /movies/discover/toprated
- [X]  /movies/[idMovie]
- [X]  /movies/[idMovie]/likes
- [X]  /movies/[idMovie]/videos

#### Swagger

- [ ]  Swagger UI

#### UI

- [ ]  Navbar
- [ ]  Home Page
    - [ ]  search bar
    - [ ]  like button
- [ ]  Authentication pages
    - [ ] Sign-up
    - [ ] Sign-in
    - [ ] Profile
- [ ]  Movie details page
- [ ]  Favorite movies page
- [ ]  Discover page

## Windows & MacOS & Linux

### Installation

- Install Nodejs dependencies
  ```bash
  npm install
  ```

- Copy the `.env.local.example` file to create your own `.env` file
    ```dotenv
    MONGODB_URI=your_mongodb_uri
    MONGO_DATABASE=your_mongodb_database
    API_TOKEN=your_tmdb_api_token
    REACT_EDITOR=your_favorite_ide
    ```

### Getting Started

- Run Next app
  ```bash
  npm run dev
  ```

### Linter & Formatter

- Run ESLint
  ```bash
  npm run eslint
  ```
- Run ESLint in quiet mode
  ```bash
  npm run eslint:quiet
  ```
- Check Prettier
  ```bash
  npm run prettier:c
  ```
- Run Prettier
  ```bash
  npm run prettier:w
  ```

### Test

- Launch all Jest tests
  ```bash
  npm run test 
  ```
- Launch API Jest tests
  ```bash
  npm run test:api
  ```
- Launch UI Jest tests
  ```bash
  npm run test:ui
  ```
- Run Jest coverage
  ```bash
  npm run test:coverage
  ```

### Build

- Build Next app
  ```bash
  npm run build
  ```
