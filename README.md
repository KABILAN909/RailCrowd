# RailCrowd – Predict. Plan. Travel Smart.

RailCrowd is a full-stack web application designed to help users explore train routes and view AI-based crowd predictions.

## Features

- Dashboard with train analytics
- Train search by source and destination stations
- Train details and stop information
- AI-based crowd level and occupancy predictions
- User login and registration
- Crowd prediction confidence and contributing factors

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Python, Flask
- **Database:** MySQL
- **API:** REST

## Getting Started

### Prerequisites

- Python
- Node.js and npm
- MySQL

### 1. Clone the repository

```bash
git clone https://github.com/KABILAN909/RailCrowd.git
cd RailCrowd
```

### 2. Start the backend

Open a terminal in the project root:

```bash
cd backend
```

Activate your existing virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies if required:

```bash
pip install -r requirements.txt
```

Configure your MySQL database and environment variables as required by the project, then start the Flask application using the project's configured entry point.

### 3. Start the frontend

Open a separate terminal in the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/analytics` | Dashboard analytics |
| GET | `/api/trains/search?from=SBC&to=MAS` | Search trains between stations |
| GET | `/api/trains/16378` | Retrieve train stops and details |
| GET | `/api/prediction/16378` | Retrieve a train crowd prediction |

## Important Note

Crowd levels and occupancy figures are predictions and should not be treated as verified real-time train occupancy.

## Project Status

Core dashboard, train search, prediction, and authentication flows have been tested locally.

## Author

KABILAN K
