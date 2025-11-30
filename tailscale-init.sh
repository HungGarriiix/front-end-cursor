#!/bin/sh
set -e

# Start tailscaled in the background
echo "Starting tailscaled..."
tailscaled --tun=userspace-networking --statedir=/var/lib/tailscale &
TAILSCALED_PID=$!

# Wait for socket to be ready (default location)
echo "Waiting for tailscaled socket..."
for i in $(seq 1 30); do
  if [ -S /var/run/tailscale/tailscaled.sock ]; then
    echo "Socket ready!"
    break
  fi
  sleep 1
done

# Authenticate with the auth key
if [ -n "$TAILSCALE_AUTH_KEY" ]; then
  echo "Authenticating with Tailscale auth key..."
  tailscale up --authkey="$TAILSCALE_AUTH_KEY" --hostname="cursor-app" --accept-dns=true
  echo "✓ Tailscale authenticated successfully"
  
  # Get Tailscale IP
  sleep 2
  TS_IP=$(tailscale ip -4)
  echo "✓ Tailscale IP: $TS_IP"
  echo "✓ Access app at: http://$TS_IP:4173 or http://cursor-app:4173 (from other Tailscale nodes)"
else
  echo "⚠ TAILSCALE_AUTH_KEY not set, waiting for manual authentication..."
  sleep infinity
fi

# Keep the process alive
wait $TAILSCALED_PID
