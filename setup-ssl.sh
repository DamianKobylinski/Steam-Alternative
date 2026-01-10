#!/bin/bash
# Setup SSL with Caddy using self-signed certificates
# Run this script on your VPS

set -e

# Get VPS public IP
PUBLIC_IP=$(curl -s ifconfig.me)
DOMAIN=$(echo $PUBLIC_IP | tr '.' '-')

echo "========================================"
echo "Steam Alternative SSL Setup"
echo "========================================"
echo ""
echo "Your VPS IP: $PUBLIC_IP"
echo "Your domain: $DOMAIN.nip.io"
echo ""

# Clear old Caddy certificates to force fresh issuance
echo "Clearing old certificates..."
docker compose down caddy 2>/dev/null || true
docker volume rm steam-alternative_caddy-data 2>/dev/null || true

# Create Caddyfile with self-signed TLS (works immediately, browser warning)
cat > Caddyfile << EOF
# Steam Alternative - SSL Configuration
# Using self-signed certificates (click through browser warning)
# Domain: $DOMAIN.nip.io

# Main Next.js app
$DOMAIN.nip.io {
    tls internal
    reverse_proxy localhost:3000
}

# Grafana dashboard
grafana.$DOMAIN.nip.io {
    tls internal
    reverse_proxy localhost:3001
}

# Prometheus metrics
prometheus.$DOMAIN.nip.io {
    tls internal
    reverse_proxy localhost:9090
}

# Uptime Kuma status page
uptime.$DOMAIN.nip.io {
    tls internal
    reverse_proxy localhost:3002
}

# Alertmanager
alertmanager.$DOMAIN.nip.io {
    tls internal
    reverse_proxy localhost:9093
}

# pgAdmin
pgadmin.$DOMAIN.nip.io {
    tls internal
    reverse_proxy localhost:15432
}
EOF

echo "Caddyfile created with self-signed TLS"
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
echo "  App:         https://$DOMAIN.nip.io"
echo "  Grafana:     https://grafana.$DOMAIN.nip.io"
echo "  Prometheus:  https://prometheus.$DOMAIN.nip.io"
echo "  Uptime Kuma: https://uptime.$DOMAIN.nip.io"
echo "  Alertmanager:https://alertmanager.$DOMAIN.nip.io"
echo "  pgAdmin:     https://pgadmin.$DOMAIN.nip.io"
echo ""
echo "NOTE: Browser will show a security warning."
echo "Click 'Advanced' -> 'Accept the Risk and Continue'"
echo ""
echo "For Clerk, add this domain to Dashboard:"
echo "  https://$DOMAIN.nip.io"
echo ""
