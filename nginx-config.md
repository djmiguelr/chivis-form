# Nginx Configuration for app.chivisclothes.com

## Prerequisites
1. Ensure you have Nginx installed
2. Ensure you have Certbot installed for SSL certificates

## Configuration Steps

1. Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/app.chivisclothes.com
```

2. Add the following configuration:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name app.chivisclothes.com;

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name app.chivisclothes.com;

    # SSL configuration (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/app.chivisclothes.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.chivisclothes.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_session_tickets off;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Root directory and index file
    root /var/www/app.chivisclothes.com/dist;
    index index.html;

    # Proxy settings for API requests
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # CORS headers
        add_header 'Access-Control-Allow-Origin' 'https://app.chivisclothes.com' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Accept,Origin' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;

        # Handle OPTIONS method
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' 'https://app.chivisclothes.com' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Accept,Origin' always;
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # Static file handling
    location / {
        try_files $uri $uri/ /index.html;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml application/javascript;
    gzip_disable "MSIE [1-6]\.";
}
```

3. Create the necessary directories:
```bash
sudo mkdir -p /var/www/app.chivisclothes.com
```

4. Copy your built application to the directory:
```bash
sudo cp -r /path/to/your/dist/* /var/www/app.chivisclothes.com/dist/
```

5. Create a symbolic link to enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/app.chivisclothes.com /etc/nginx/sites-enabled/
```

6. Obtain SSL certificate using Certbot:
```bash
sudo certbot --nginx -d app.chivisclothes.com
```

7. Test Nginx configuration:
```bash
sudo nginx -t
```

8. If the test is successful, restart Nginx:
```bash
sudo systemctl restart nginx
```

## Important Notes

1. This configuration preserves existing sites by:
   - Using a separate configuration file
   - Using a unique server_name
   - Having its own root directory

2. The configuration includes:
   - HTTP to HTTPS redirect
   - Modern SSL settings
   - CORS headers for API requests
   - Proper proxy settings for the Node.js backend
   - Static file caching
   - Gzip compression
   - Security headers

3. Make sure to:
   - Update the domain name if different from app.chivisclothes.com
   - Adjust the root directory path if needed
   - Verify the backend port (currently set to 3000)

4. Troubleshooting:
   - Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
   - Check access logs: `sudo tail -f /var/log/nginx/access.log`
   - Verify permissions: `sudo chown -R www-data:www-data /var/www/app.chivisclothes.com`