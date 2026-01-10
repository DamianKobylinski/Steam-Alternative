#!/bin/bash
# Setup SSL with Caddy and traefik.me
# Run this script on your VPS

set -e

# Get VPS public IP and convert to traefik.me format
PUBLIC_IP=$(curl -s ifconfig.me)
DOMAIN=$(echo $PUBLIC_IP | tr '.' '-')

echo "========================================"
echo "Steam Alternative SSL Setup"
echo "========================================"
echo ""
echo "Your VPS IP: $PUBLIC_IP"
echo "Your domain: $DOMAIN.traefik.me"
echo ""

# Create Caddyfile with actual domain
cat > Caddyfile << EOF
# Steam Alternative - SSL Configuration
# Domain: $DOMAIN.traefik.me

# Main Next.js app
$DOMAIN.traefik.me {
    reverse_proxy localhost:3000
}

# Grafana dashboard
grafana.$DOMAIN.traefik.me {
    reverse_proxy localhost:3001
}

# Prometheus metrics
prometheus.$DOMAIN.traefik.me {
    reverse_proxy localhost:9090
}

# Uptime Kuma status page
uptime.$DOMAIN.traefik.me {
    reverse_proxy localhost:3002
}

# Alertmanager
alertmanager.$DOMAIN.traefik.me {
    reverse_proxy localhost:9093
}

# pgAdmin
pgadmin.$DOMAIN.traefik.me {
    reverse_proxy localhost:15432
}
EOF

echo "Caddyfile created with domain: $DOMAIN.traefik.me"
echo ""

# Start Caddy
echo "Starting Caddy..."
docker compose up -d caddy

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Access your services at:"
echo "  App:         https://$DOMAIN.traefik.me"
echo "  Grafana:     https://grafana.$DOMAIN.traefik.me"
echo "  Prometheus:  https://prometheus.$DOMAIN.traefik.me"
echo "  Uptime Kuma: https://uptime.$DOMAIN.traefik.me"
echo "  Alertmanager:https://alertmanager.$DOMAIN.traefik.me"
echo "  pgAdmin:     https://pgadmin.$DOMAIN.traefik.me"
echo ""
echo "IMPORTANT: Add this domain to Clerk Dashboard:"
echo "  https://$DOMAIN.traefik.me"
echo ""
