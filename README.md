# NexaCode Labs

NexaCode Labs is a professional software development and freelancing agency
website. This repository currently contains the frontend foundation for the
public website.

## Planned Technology Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router
- Lucide React icons

### Backend

The backend will be added in a later loop.

- Node.js
- Express.js
- MySQL

## Current Project Structure

```text
client/
  src/
    assets/
    components/
    layouts/
    pages/
    routes/
    data/
    hooks/
    utils/
```

## Setup Instructions

Install frontend dependencies:

```bash
cd client
npm install
```

Start the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Current Status

- Vite React client exists in `client/`
- Tailwind CSS is configured through the Vite plugin
- React Router is configured for the initial public routes
- Placeholder pages exist for Home, Services, Portfolio, About, Contact, and
  Not Found
- Backend and database work have not been started
