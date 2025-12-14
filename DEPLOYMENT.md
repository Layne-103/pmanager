# Deployment Guide

This guide covers multiple deployment strategies for the Ticket Manager application.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
  - [Option 1: Docker Compose (Recommended)](#option-1-docker-compose-recommended)
  - [Option 2: Platform as a Service (Railway/Render)](#option-2-platform-as-a-service-railwayrender)
  - [Option 3: Manual Deployment](#option-3-manual-deployment)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Docker & Docker Compose** (for Docker deployment)
- **PostgreSQL 15+** (if not using Docker)
- **Python 3.11+** (for manual deployment)
- **Node.js 18+** (for building frontend)

### Accounts (for PaaS deployment)
- Railway, Render, Heroku, or similar platform account
- GitHub account (for automated deployments)

---

## Environment Configuration

### 1. Create Environment Files

#### Backend Environment (`.env` in project root)
```bash
cp .env.production.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://postgres:password@db:5432/pmanager
ALLOWED_ORIGINS=https://yourapp.com,https://www.yourapp.com
HOST=0.0.0.0
PORT=8000
```

#### Frontend Environment (`client/.env.production`)
```bash
cd client
cp .env.production.example .env.production
```

Edit `client/.env.production`:
```env
VITE_API_URL=https://api.yourapp.com
NODE_ENV=production
```

---

## Deployment Options

## Option 1: Docker Compose (Recommended)

### Benefits
- ✅ Complete stack with one command
- ✅ Isolated environment
- ✅ Easy to scale
- ✅ Production-ready
- ✅ Includes database

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd pmanager
```

2. **Set environment variables**
```bash
# Create .env file
echo "DB_PASSWORD=your_secure_password" > .env
```

3. **Build and start services**
```bash
docker-compose up -d
```

4. **Run database migrations**
```bash
docker-compose exec backend alembic upgrade head
```

5. **Verify deployment**
```bash
# Check all services are running
docker-compose ps

# Check logs
docker-compose logs -f

# Test backend
curl http://localhost:8000/health

# Test frontend
open http://localhost:8080
```

### Production Deployment

For production with SSL and custom domains:

1. **Update docker-compose.yml**
   - Change ports as needed
   - Add environment variables
   - Configure volumes for persistence

2. **Add reverse proxy (Nginx/Traefik)**
```yaml
# Add to docker-compose.yml
  nginx-proxy:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
```

3. **Configure SSL certificates**
   - Use Let's Encrypt with Certbot
   - Or place certificates in `./ssl` directory

### Useful Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service_name]

# Restart a service
docker-compose restart [service_name]

# Rebuild after code changes
docker-compose up -d --build

# Run migrations
docker-compose exec backend alembic upgrade head

# Access database
docker-compose exec db psql -U postgres -d pmanager

# Clean up everything (including volumes)
docker-compose down -v
```

---

## Option 2: Platform as a Service (Railway/Render)

### Railway Deployment

1. **Create Railway Project**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

2. **Add PostgreSQL Database**
   - Go to Railway dashboard
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the `DATABASE_URL`

3. **Configure Backend Service**
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Set root directory: `server`
   - Add environment variables:
     ```
     DATABASE_URL=<your_postgres_url>
     ALLOWED_ORIGINS=<your_frontend_url>
     ```
   - Railway will auto-detect Procfile

4. **Configure Frontend Service**
   - Click "New" → "GitHub Repo" (same repo)
   - Set root directory: `client`
   - Build command: `npm install && npm run build`
   - Start command: `npx serve -s dist -l $PORT`
   - Add environment variable:
     ```
     VITE_API_URL=<your_backend_url>
     ```

5. **Run Migrations**
```bash
railway run alembic upgrade head
```

### Render Deployment

1. **Create Web Services**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"

2. **Backend Service**
   - Connect GitHub repository
   - Name: `pmanager-backend`
   - Root Directory: `server`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
   - Add environment variables

3. **Frontend Service**
   - Click "New +" → "Static Site"
   - Connect same repository
   - Name: `pmanager-frontend`
   - Root Directory: `client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

4. **Database**
   - Click "New +" → "PostgreSQL"
   - Copy connection string to backend environment

---

## Option 3: Manual Deployment

### Backend Deployment

1. **Setup Server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install python3.11 python3-pip postgresql nginx -y
```

2. **Clone and Setup**
```bash
# Clone repository
git clone <repository-url>
cd pmanager/server

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn
```

3. **Configure PostgreSQL**
```bash
# Create database
sudo -u postgres psql
CREATE DATABASE pmanager;
CREATE USER pmanager WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE pmanager TO pmanager;
\q
```

4. **Run Migrations**
```bash
# Update .env with database URL
export DATABASE_URL="postgresql://pmanager:your_password@localhost/pmanager"

# Run migrations
alembic upgrade head
```

5. **Create Systemd Service**
```bash
sudo nano /etc/systemd/system/pmanager-backend.service
```

```ini
[Unit]
Description=PManager Backend
After=network.target postgresql.service

[Service]
Type=notify
User=www-data
WorkingDirectory=/path/to/pmanager/server
Environment="PATH=/path/to/pmanager/server/venv/bin"
Environment="DATABASE_URL=postgresql://pmanager:password@localhost/pmanager"
ExecStart=/path/to/pmanager/server/venv/bin/gunicorn app.main:app \
    --workers 4 \
    --worker-class uvicorn.workers.UvicornWorker \
    --bind 0.0.0.0:8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable pmanager-backend
sudo systemctl start pmanager-backend
sudo systemctl status pmanager-backend
```

### Frontend Deployment

1. **Build Frontend**
```bash
cd ../client
npm install
npm run build
```

2. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/pmanager
```

```nginx
server {
    listen 80;
    server_name yourapp.com;
    
    root /path/to/pmanager/client/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/pmanager /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

3. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourapp.com
```

---

## Post-Deployment

### Health Checks

1. **Backend Health**
```bash
curl https://api.yourapp.com/health
# Expected: {"status": "healthy"}
```

2. **Frontend Access**
```bash
curl https://yourapp.com
# Should return HTML
```

3. **Database Connection**
```bash
curl https://api.yourapp.com/api/tickets
# Should return ticket list (may be empty)
```

### Monitoring

1. **Application Logs**
```bash
# Docker
docker-compose logs -f backend
docker-compose logs -f frontend

# Systemd
sudo journalctl -u pmanager-backend -f

# Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

2. **Resource Usage**
```bash
# Docker
docker stats

# System
htop
df -h
```

### Database Backup

```bash
# Docker
docker-compose exec db pg_dump -U postgres pmanager > backup_$(date +%Y%m%d).sql

# Manual
pg_dump -U pmanager pmanager > backup_$(date +%Y%m%d).sql
```

### Database Restore

```bash
# Docker
cat backup.sql | docker-compose exec -T db psql -U postgres pmanager

# Manual
psql -U pmanager pmanager < backup.sql
```

---

## Troubleshooting

### Backend Issues

**Problem: Cannot connect to database**
```bash
# Check database is running
docker-compose ps db
# or
sudo systemctl status postgresql

# Check DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL
```

**Problem: Gunicorn won't start**
```bash
# Check logs
docker-compose logs backend
# or
sudo journalctl -u pmanager-backend -n 50

# Test manually
gunicorn app.main:app --bind 0.0.0.0:8000
```

### Frontend Issues

**Problem: API requests fail**
- Check `VITE_API_URL` is set correctly
- Verify CORS origins in backend
- Check network/firewall rules

**Problem: Blank page**
- Check browser console for errors
- Verify build was successful
- Check nginx configuration

### Docker Issues

**Problem: Container won't start**
```bash
# Check logs
docker-compose logs [service_name]

# Rebuild
docker-compose build --no-cache [service_name]

# Check disk space
df -h
```

**Problem: Permission denied**
```bash
# Reset ownership
sudo chown -R $USER:$USER .

# Or run with sudo
sudo docker-compose up -d
```

---

## Performance Optimization

### Backend
1. Increase Gunicorn workers (CPU cores × 2 + 1)
2. Add Redis for caching
3. Enable database connection pooling
4. Use CDN for static assets

### Frontend
1. Enable Gzip compression (already in nginx.conf)
2. Use CDN for assets
3. Implement service workers for caching
4. Lazy load routes

### Database
1. Add indexes for frequently queried columns
2. Regular VACUUM and ANALYZE
3. Monitor slow queries
4. Consider read replicas for scale

---

## Security Checklist

- [ ] Change default passwords
- [ ] Enable SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Enable rate limiting
- [ ] Update CORS origins
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated
- [ ] Enable logging and monitoring
- [ ] Set up error alerting

---

## Updating the Application

### Docker Deployment
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Run new migrations
docker-compose exec backend alembic upgrade head
```

### Manual Deployment
```bash
# Pull latest code
git pull origin main

# Update backend
cd server
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart pmanager-backend

# Update frontend
cd ../client
npm install
npm run build
```

---

## Support

For issues and questions:
- Check logs first
- Review this deployment guide
- Check GitHub Issues
- Contact support team

---

**Last Updated:** December 14, 2025
