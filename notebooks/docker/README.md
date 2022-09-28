To update the Metabase dashboards etc., run the following to dump your local database:

```console
docker exec objectiv_postgres pg_dump -U objectiv metabase > 2_metabase_data.sql
```

And then add this as the first line on top of that dump file:

```text
\c metabase 
```