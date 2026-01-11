#!/bin/bash

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

echo "Clearing old certificates..."
docker-compose down -d caddy 2>/dev/null || true
docker volume rm steam-alternative_caddy-data 2>/dev/null || true

docker-compose up -d --build

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
