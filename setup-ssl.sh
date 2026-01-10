#!/bin/bash
# Setup SSL with Caddy and sslip.io
# Run this script on your VPS

set -e

# Get VPS public IP and convert to sslip.io format
PUBLIC_IP=$(curl -s ifconfig.me)
DOMAIN=$(echo $PUBLIC_IP | tr '.' '-')

echo "========================================"
echo "Steam Alternative SSL Setup"
echo "========================================"
echo ""
echo "Your VPS IP: $PUBLIC_IP"
echo "Your domain: $DOMAIN.sslip.io"
echo ""

# Clear old Caddy certificates to force fresh issuance
echo "Clearing old certificates..."
docker compose down caddy 2>/dev/null || true
docker volume rm steam-alternative_caddy-data 2>/dev/null || true

# Create Caddyfile with actual domain
cat > Caddyfile << EOF
# Steam Alternative - SSL Configuration
# Domain: $DOMAIN.sslip.io

# Main Next.js app
$DOMAIN.sslip.io {
    reverse_proxy localhost:3000
}

# Grafana dashboard
grafana.$DOMAIN.sslip.io {
    reverse_proxy localhost:3001
}

# Prometheus metrics
prometheus.$DOMAIN.sslip.io {
    reverse_proxy localhost:9090
}

# Uptime Kuma status page
uptime.$DOMAIN.sslip.io {
    reverse_proxy localhost:3002
}

# Alertmanager
alertmanager.$DOMAIN.sslip.io {
    reverse_proxy localhost:9093
}

# pgAdmin
pgadmin.$DOMAIN.sslip.io {
    reverse_proxy localhost:15432
}
EOF

echo "Caddyfile created with domain: $DOMAIN.sslip.io"
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
echo "  App:         https://$DOMAIN.sslip.io"
echo "  Grafana:     https://grafana.$DOMAIN.sslip.io"
echo "  Prometheus:  https://prometheus.$DOMAIN.sslip.io"
echo "  Uptime Kuma: https://uptime.$DOMAIN.sslip.io"
echo "  Alertmanager:https://alertmanager.$DOMAIN.sslip.io"
echo "  pgAdmin:     https://pgadmin.$DOMAIN.sslip.io"
echo ""
echo "IMPORTANT: Add this domain to Clerk Dashboard:"
echo "  https://$DOMAIN.sslip.io"
echo ""
