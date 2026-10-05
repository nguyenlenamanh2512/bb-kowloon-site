# V1 deployment on docker-mgr

This deployment intentionally keeps the V1 JSON store and uploaded media on one
Docker host. It does not use PostgreSQL and does not publish an image to GitHub.

## Data and availability model

- One website container runs on `docker-mgr`.
- `/srv/bb-kowloon-v1/storage` on the host is mounted at `/app/storage`.
- `cms-data.json` and `uploads/` survive container recreation.
- The deploy script creates a timestamped backup before replacing a container
  when CMS data already exists.
- The two HAProxy nodes share a Keepalived VIP. HAProxy routes by hostname so the
  website and Grafana can share ports 80/443.
- HAProxy failover remains available, but `docker-mgr` is a single point of
  failure for the V1 website and its data.

## First deployment

Copy the source directory to `docker-mgr` without `.git`, `.next`, or
`node_modules`. Then, on `docker-mgr`:

```sh
cp .env.docker-mgr.example .env.docker-mgr
# Edit SITE_URL and AUTH_SECRET before continuing.
chmod +x scripts/deploy-docker-mgr.sh
./scripts/deploy-docker-mgr.sh
```

When the target has no `cms-data.json`, the deploy script imports the bundled
local `storage/` automatically. On later deployments it preserves the server
copy and creates a timestamped backup instead of overwriting it.

## HAProxy routing

Merge `deploy/haproxy-bb-kowloon.cfg.example` into the existing HAProxy
configuration on both load balancers. Replace the example hostnames and private
IP placeholders, validate with `haproxy -c -f /etc/haproxy/haproxy.cfg`, and
reload HAProxy only after validation succeeds.

Use separate hostnames such as `www.example.com` and `grafana.example.com`.
They can share the same VIP and HTTPS port because HAProxy selects the backend
from the HTTP Host header.

## Verification

```sh
docker compose --env-file .env.docker-mgr -f compose.docker-mgr.yaml ps
curl -fsS http://127.0.0.1:3000/
curl -kfsS --resolve www.example.com:443:VIP_ADDRESS https://www.example.com/
./scripts/verify-docker-mgr.sh
```

After changing CMS content, restart the website container and confirm the
change remains. This verifies persistence independently of container lifetime.
