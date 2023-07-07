import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sales Management Platform APIs',
      version: '1.1.0',
    },
    "servers": [
      {
        "url": "http://localhost:8082/api/v1"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js'],
};

const swaggerDocument = swaggerJSDoc(options);
export default swaggerDocument;