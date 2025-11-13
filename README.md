# SimuTrade

A full-stack paper-trading simulator that combines a Django REST API, Celery-powered background jobs, and a modern Next.js dashboard. Users can register, place market or limit orders, monitor holdings, review trades/transactions, and see live market data pulled from Alpha Vantage or Finnhub.

## Features

- **Backend**: Django 5 + DRF + SimpleJWT with PostgreSQL persistence.
- **Trading Engine**: Validates cash/positions, fills market orders instantly, watches limit orders via Celery, updates holdings, cash, and PnL.
- **Market Data**: Pluggable Alpha Vantage/Finnhub fetcher with caching and scheduled refreshes.
- **Portfolio Services**: Computes cash, holdings value, realized/unrealized PnL, and exposes summary endpoints.
- **Frontend**: Next.js 15 + Tailwind dashboard with dashboards, markets, portfolio, orders, and transactions flows.
- **Infrastructure**: Docker/Docker Compose with Postgres, Redis, backend, frontend, Celery worker & beat, plus pre-commit hooks.

## Project Structure

```
app/
  backend/
    manage.py, requirements.txt, simutrade/, accounts/, trading/
  frontend/
    src/components|hooks|lib|pages|styles
  Dockerfile.backend
  Dockerfile.frontend
  docker-compose.yml
  init_db.sh
  README.md
```

## Getting Started (Local)

### Backend

```bash
cd app/backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # adjust secrets + DB connection
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

### Frontend

```bash
cd app/frontend
npm install
cp .env.example .env.local
npm run dev
```

### Celery Worker & Beat

In separate terminals (same virtualenv / env vars):

```bash
cd app/backend
celery -A simutrade worker -l info
celery -A simutrade beat -l info
```

## Docker Workflow

```bash
cd app
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
docker-compose up --build
```

Services exposed:
- Backend API: http://localhost:8000/api
- Frontend UI: http://localhost:3000
- Postgres: localhost:5432
- Redis: localhost:6379

Use `docker-compose down -v` to reset state.

## API Overview

- `POST /api/auth/register | login | refresh | profile`
- `GET /api/market/price/<symbol>` and `GET /api/market/search?q=`
- `POST /api/orders/create`, `POST /api/orders/cancel/<id>`, `GET /api/orders/open`, `GET /api/orders/history`
- `GET /api/portfolio/summary | holdings | pnl`
- `GET /api/trades/<order_id>`
- `GET /api/transactions`

## Tests

Backend unit tests focus on the trading engine and portfolio math:

```bash
cd app/backend
pytest
```

## Pre-commit Hooks

Install and run hooks locally:

```bash
cd app
pre-commit install
pre-commit run --all-files
```

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for all configurable settings (database, Alpha Vantage/Finnhub API keys, CORS, cache durations, etc.).

## Next Steps

- Connect a data provider key for real quotes.
- Expand charts with historical equity curve data persisted via scheduled snapshots.
- Add WebSockets for push price updates.
