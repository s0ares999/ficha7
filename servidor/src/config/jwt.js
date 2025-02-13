require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('JWT_SECRET não definido no arquivo .env');
    process.exit(1);
}

console.log('JWT_SECRET configurado:', JWT_SECRET);

module.exports = {
    JWT_SECRET
}; 