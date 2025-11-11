#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd \"$(dirname \"$0\")\" && pwd)
cd \"$ROOT_DIR/backend\"

export DJANGO_SETTINGS_MODULE=simutrade.settings
python manage.py migrate
python manage.py collectstatic --no-input
