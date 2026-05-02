# Trendify Website

A full-stack Angular e-commerce application with a local Node.js API server and SQLite database. This project includes product browsing, cart and wishlist management, authentication, checkout, and admin pages for products, categories, brands, and orders.

## Project structure

- `src/` - Angular frontend application
- `server/` - Node.js backend API and seed data
- `angular.json` - Angular CLI configuration
- `package.json` - project dependencies and scripts

## Prerequisites

- Node.js installed
- npm installed

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the Angular app:

```bash
npm start
```

3. Start the API server in a separate terminal:

```bash
npm run start:api
```
## Api Server command 
npm run start:api


## Available scripts

- `npm start` - starts the Angular development server
- `npm run start:api` - starts the Node.js API server
- `npm run build` - builds the Angular app for production

## Notes

- The frontend is configured to use Tailwind CSS and Angular 20.
- The backend uses Express, SQLite, bcryptjs, and JSON web tokens.
- The app appears to be structured for an e-commerce workflow with admin and user pages.
