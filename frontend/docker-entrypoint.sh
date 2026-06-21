#!/bin/sh
set -e

# Valor padrão caso a variável de ambiente API_URL não seja definida no docker-compose
API_URL_VALUE="${API_URL:-http://localhost:3000}"

cat <<EOF > /usr/share/nginx/html/env-config.js
window.APP_CONFIG = {
  API_URL: "${API_URL_VALUE}"
};
EOF

echo "[env-config] API_URL definido como: ${API_URL_VALUE}"
