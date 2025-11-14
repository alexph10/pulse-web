# Deployment Guide

## AI Service Deployment

The AI service should be deployed separately from the main app for security and scalability.

### Option 1: Docker Deployment (Recommended)

1. Build the Docker image:
```bash
cd pulse-ai-service
docker build -t pulse-ai-service .
```

2. Run the container:
```bash
docker run -d \
  --name pulse-ai-service \
  -p 3001:3001 \
  --env-file .env \
  pulse-ai-service
```

3. Setup reverse proxy (nginx):
```nginx
server {
    listen 80;
    server_name ai-service.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Option 2: VPS Deployment

1. SSH into your VPS
2. Clone the repository
3. Install dependencies: `npm install`
4. Build: `npm run build`
5. Start with PM2: `pm2 start dist/server.js --name pulse-ai-service`
6. Setup nginx reverse proxy

### Option 3: Serverless (Vercel/Railway/Render)

1. Connect your repository
2. Set environment variables
3. Deploy

## Main App Deployment

The main app continues to deploy on Vercel as before. Just add the new environment variable:

```
NEXT_PUBLIC_AI_SERVICE_URL=https://ai-service.your-domain.com
JWT_SECRET=your_jwt_secret_here (must match AI service)
```

## Security Checklist

- [ ] AI service has separate domain/subdomain
- [ ] SSL/TLS certificates installed
- [ ] CORS configured correctly
- [ ] JWT_SECRET is strong and unique
- [ ] API keys stored securely (not in code)
- [ ] Firewall rules configured
- [ ] Rate limiting enabled
- [ ] Monitoring and logging setup

