const mysql = require('mysql2/promise');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const dotenv = require("dotenv");

dotenv.config();

// RDS Configuration
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// DynamoDB Configuration
const dynamoDbClient = new DynamoDBClient({
    region: 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

module.exports = {
    db,
    dynamoDb,
};
