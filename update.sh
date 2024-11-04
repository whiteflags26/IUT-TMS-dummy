#!/bin/bash

# Install additional type definitions
npm install --save-dev @types/cors @types/helmet

# Install types for testing libraries (optional but recommended)
npm install --save-dev @types/jest @types/supertest

# Update the tsconfig.json to be more permissive with types
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "*": ["node_modules/*"]
    },
    "typeRoots": ["./node_modules/@types"],
    "types": ["node", "jest"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
EOL

# Create basic jest configuration (optional)
cat > jest.config.js << 'EOL'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
EOL

# Update package.json scripts
cat > package.json << 'EOL'
{
  "name": "iut-transport-backend",
  "version": "1.0.0",
  "description": "IUT Transport Management System Backend",
  "main": "src/server.ts",
  "scripts": {
    "start": "node dist/server.js",
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "lint": "eslint . --ext .ts",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
EOL

echo "Additional dependencies installed and configurations updated!"
