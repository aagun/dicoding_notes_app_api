# Konfigurasi Database

```bash
  docker run -it --rm \
    --name <CONTAINER_NAME> \
    -e POSTGRES_DB= <DB_NAME>\
    -e POSTGRES_USER= <USER_NAME>\
    -e POSTGRES_PASSWORD= <PASSWORD>\
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -p 5432:5432 \
    -v "./notes-data/:/var/lib/postgresql/data" \
    postgres:15
```
