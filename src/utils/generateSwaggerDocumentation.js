const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'})

const doc = {
  info: {
    version: '1.0.0',
    title: 'GAS Mobile API Documentation',
    description: 'Documentation for the GAS Mobile REST API'
  },
  basePath: '/api/v1',
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'Endpoints for handling user authentication'
    },
    {
      name: 'Admins',
      description: 'Endpoints for handling admins and their data'
    },
    {
      name: 'Analysts',
      description: 'Endpoints for handling analysts and their data'
    },
    {
      name: 'Customers',
      description: 'Endpoints for handling customers and their data'
    },
    {
      name: 'Companies',
      description: 'Endpoints for handling companies and their data'
    },
    {
      name: 'Analysis Requests',
      description: 'Endpoints for handling analysis requests and their data'
    },
  ],
  components: {
    securitySchemes:{
      bearerAuth: {
        type: 'http',
        scheme: 'bearer'
      }
    },
    schemas: {
      user: {
        $email: 'user@gmail.com',
        $password: '123456',
      },
      tokens: {
        $accessToken: 'eyJhbOi12dIU6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6IjY0ZGYyZTE2MjVmYjQwMDllMmUwZjfasdfwZjc5ZSJ9gsIdDASdV4cCI6MTY5NjIzOH0.32314EPF_kcutZhfQL3HQkKVuudPg',
        $refreshToken: 'eyJhbOi12dIU6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6IjY0ZGYyZTE2MjVmYjQwMDllMmUwZjfasdfwZjc5ZSJ9gsIdDASdV4cCI6MTY5NjIzOH0.32314EPF_kcutZhfQL3HQkKVuudPg',
      },
      refreshToken: {
        $refreshToken: 'eyJhbOi12dIU6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6IjY0ZGYyZTE2MjVmYjQwMDllMmUwZjfasdfwZjc5ZSJ9gsIdDASdV4cCI6MTY5NjIzOH0.32314EPF_kcutZhfQL3HQkKVuudPg'
      },
      admin: {
        $email: 'admin@gmail.com',
        $password: '123456',
      },
      analyst: {
        $name: "analyst",
        $cpf: "000.000.000-00",
        $email: 'analyst@gmail.com',
        $password: '123456',
      },
      customer: {
        $name: "customer",
        $cpf: "000.000.000-00",
        $email: 'customer@gmail.com',
        $password: '123456',
      },
      company: {
        $name: "XYZ Enterprises",
        $industry: "Finance",
        $cnpj: "00.705.432/0001-02",
        $headquartersLocation: {
          $street: "456 Elm Avenue",
          $city: "Townsville",
          $state: "Province",
          $postalCode: "50000-000",
          $country: "Country"
        }
      },
      analysisRequest: {
        $customerID: "64dfeddasdbc2d9ba5c3575b",
        $companyID: "64dfeddc2d9b92902mc3575b",
        $motive: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
      },
      analysisRequestStatus: {
        $status: "Reproved"
      }
    },
  }
}

const outputFile = '../documentation/swagger-output.json'
const routes = ['../server.js']

swaggerAutogen(outputFile, routes, doc)