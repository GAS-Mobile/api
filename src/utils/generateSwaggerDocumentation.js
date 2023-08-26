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
      }
    },
  }
}

const outputFile = '../documentation/swagger-output.json'
const routes = ['../server.js']

swaggerAutogen(outputFile, routes, doc)