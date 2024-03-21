# TP Cloud

Emerging streaming platform specializing in movie recommendations based on user preferences

### Dependencies

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

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
