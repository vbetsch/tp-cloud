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

## Roadmap
- [X]  Create API routes
    - [X]  /movies
    - [X]  /movies/search
    - [X]  /movies/discover/recommended
    - [X]  /movies/discover/toprated
    - [X]  /movies/[idMovie]
    - [X]  /movies/[idMovie]/likes
    - [X]  /movies/[idMovie]/videos
- [X]  Create API unit tests
- [X]  Create index page
- [ ]  Create unit test for index page
- [ ]  Create UI functionalities
    - [ ]  Movie details page
    - [ ]  Search bar
    - [ ]  Discover Page
- [ ]  Create unit tests for each previous features

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
- Check Prettier
  ```bash
  npm run prettier:c
  ```
- Run Prettier
  ```bash
  npm run prettier:w
  ```

### Test
- Launch Jest
  ```bash
  npm run test 
  ```

### Build

- Build Next app
  ```bash
  npm run build
  ```
