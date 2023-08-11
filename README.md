# GAS - Mobile Backend: Running the Project

Welcome to the API repository for the GAS-Mobile application. This guide will walk you through the steps to set up and run the API on your local machine.

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- Node.js (https://nodejs.org)
- MongoDB (https://www.mongodb.com)

### Installation

1. Clone the repository:

  ```bash
  git clone https://github.com/GAS-Mobile/api.git
  ```

2. Navigate to the project directory:

  ```bash
  cd api
  ```

3. Install dependencies:

  ```bash
  npm install
  ```

### Configuration

Create a `.env` file in the root directory based on the provided `.env.example` file. Adjust the configuration settings as needed (e.g., database connection URL, API port).

## Running the API

Before launching the API server, ensure your MongoDB server is up and running. If not, you can initiate it with the following command:

  ```bash
  mongod
  ```

Afterwards, start the API server by executing the following command:

  ```bash
  npm start
  ```

This command initiates the API server using the configuration specified in the .env file. By default, the API will be accessible through port 3000.

## Contributing

If you'd like to contribute to the project, you can follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -m "Add your changes"`.
4. Push to your forked repository: `git push origin feature/your-feature-name`.
5. Create a pull request to the main repository.

## Troubleshooting

If you encounter any issues or have questions, please open an issue on the GitHub repository. We'll be happy to assist you.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE.md) file for details.