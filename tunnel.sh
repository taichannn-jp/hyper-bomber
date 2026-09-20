#!/bin/bash
while true; do
  echo "Starting localhost.run tunnel..."
  ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=20 -o ServerAliveCountMax=3 -R 80:localhost:3000 nokey@localhost.run
  echo "Tunnel disconnected. Reconnecting in 3 seconds..."
  sleep 3
done
