# Deployment Guide for VPS

## Prerequisites

1. A VPS with SSH access
2. Git installed on the VPS
3. Node.js (v18 or higher) and npm installed on the VPS
4. PM2 for process management (optional but recommended)

## Initial Server Setup

1. Connect to your VPS via SSH:
```bash
ssh user@your-vps-ip
```

2. Install Node.js and npm (if not already installed):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

3. Install PM2 globally:
```bash
npm install -g pm2
```

## Application Deployment

1. Clone the repository on your VPS:
```bash
git clone <your-repository-url>
cd chivis-clothes-survey
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```bash
cp .env.example .env
```

4. Edit the .env file with your actual values:
```
VITE_APP_TITLE=Chivis Formularios
GOOGLE_CLIENT_EMAIL=your-google-service-account-email
GOOGLE_PRIVATE_KEY=your-private-key
SPREADSHEET_ID=your-spreadsheet-id
VITE_API_URL=http://your-domain.com/api/submit-form
```

5. Build the application:
```bash
npm run build
```

6. Start the server with PM2:
```bash
pm2 start server.js --name "chivis-survey"
```

## Nginx Configuration (Optional but Recommended)

If you want to use Nginx as a reverse proxy:

1. Install Nginx:
```bash
sudo apt-get install nginx
```

2. Create a new Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/chivis-survey
```

3. Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/chivis-survey /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Maintenance

### Updating the Application

1. Pull the latest changes:
```bash
git pull origin main
```

2. Install any new dependencies:
```bash
npm install
```

3. Rebuild the application:
```bash
npm run build
```

4. Restart the server:
```bash
pm2 restart chivis-survey
```

### Monitoring

- View application logs:
```bash
pm2 logs chivis-survey
```

- Monitor application status:
```bash
pm2 status
```

## Troubleshooting

1. If the application fails to start, check the logs:
```bash
pm2 logs chivis-survey
```

2. Verify environment variables are set correctly:
```bash
pm2 env chivis-survey
```

3. Check if the port is in use:
```bash
sudo lsof -i :3000
```

4. Verify Nginx configuration:
```bash
sudo nginx -t
```