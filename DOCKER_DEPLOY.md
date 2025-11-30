# Docker Deployment Guide

## Architecture

- **Frontend**: React app with vite preview server (port 5173)
- **Nginx**: Reverse proxy routing traffic from port 80 → 5173 (port 443 for HTTPS)
- **Tailscale**: VPN networking layer for secure connectivity

## Prerequisites

1. **Docker & Docker Compose** installed
2. **Tailscale Account** with auth key
3. **Environment variables** configured

## Setup

### 1. Configure Environment Variables

Copy `.env.docker` and update with your values:

```bash
cp .env.docker .env
```

Update these critical values:

```env
TAILSCALE_AUTH_KEY=tskey-xxxxx  # Get from tailscale.com/admin
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx  # Use production key
CLERK_SECRET_KEY=sk_live_xxxxx
VITE_WEBHOOK_URL=https://your-webhook-url
VITE_IMAGE_WEBHOOK_URL=https://your-image-webhook-url
VITE_API_BASE_URL=http://your-api-url:8000
```

### 2. Get Tailscale Auth Key

1. Go to [tailscale.com/admin](https://tailscale.com/admin)
2. Navigate to **Settings > Personal auth tokens**
3. Create a new token with reusable option
4. Copy and paste into `.env` file as `TAILSCALE_AUTH_KEY`

### 3. Build and Start Services

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### 4. Verify Deployment

```bash
# Test frontend
curl http://localhost:5173

# Test nginx
curl http://localhost:80

# Check Tailscale connection
docker exec cursor-app tailscale status
```

## Configuration Files

### Dockerfile

- Multi-stage build for optimized image size
- Installs dependencies, builds project, runs `pnpm run serve`
- Exposes port 5173 (vite preview default)

### docker-compose.yml

- **tailscale**: VPN connectivity
- **frontend**: React app service
- **nginx**: HTTP reverse proxy & static caching

### nginx.conf

- Routes port 80 → frontend:5173
- WebSocket support for real-time features
- Static asset caching (7 days)
- Gzip compression enabled
- Health check endpoint at `/health`

## SSL/HTTPS Setup (Optional)

1. Place SSL certificates in `./ssl/` folder:

   ```
   ./ssl/
   ├── cert.pem      (SSL certificate)
   └── key.pem       (private key)
   ```

2. Uncomment HTTPS section in `nginx.conf`

3. Uncomment HTTP→HTTPS redirect in `nginx.conf`

4. Rebuild and restart:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## Accessing Your App

### Via Direct IP/Domain

```
http://your-server-ip
http://your-domain.com
```

### Via Tailscale

```
# Your app is also accessible on Tailscale network
http://cursor-app.tailnet-xxxx.ts.net
```

## Troubleshooting

### Frontend not accessible

```bash
# Check frontend logs
docker-compose logs frontend

# Check nginx logs
docker-compose logs nginx

# Verify connection
docker exec cursor-frontend curl http://localhost:5173
```

### Tailscale not connecting

```bash
# Check Tailscale status
docker exec cursor-app tailscale status

# Check Tailscale logs
docker-compose logs tailscale
```

### Health checks failing

```bash
# Check container status
docker-compose ps

# Run manual health check
docker exec cursor-frontend wget --quiet --tries=1 --spider http://localhost:5173
```

## Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart service
docker-compose restart frontend
```

## Performance Tuning

Edit `nginx.conf` to adjust:

- `worker_processes` - CPU cores
- `worker_connections` - Concurrent connections
- `gzip_types` - Compression formats
- `proxy_buffer_size` - Buffer sizes
- `keepalive_timeout` - Connection timeout

## Monitoring

Real-time monitoring:

```bash
docker stats
docker-compose logs -f
```

Health endpoints:

- Frontend: `http://localhost:5173/`
- Nginx: `http://localhost:80/health`

## Security Best Practices

1. ✅ Use production Clerk keys (pk*live*_ & sk*live*_)
2. ✅ Enable HTTPS with valid SSL certificates
3. ✅ Set strong Tailscale auth keys
4. ✅ Use environment variables for secrets (never commit .env)
5. ✅ Regularly update Docker images
6. ✅ Monitor container logs for errors
