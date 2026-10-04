# saas-core-service

## Command-line arguments

Command-line arguments override environment variables. Run with
--help to see all options.

| Argument                    | Overrides            | Default                   | Description                                                                       |
| --------------------------- | -------------------- | ------------------------- | --------------------------------------------------------------------------------- |
| -p, --port <PORT>           | APP_PORT             | 8080                      | Port to listen on.                                                                |
| -h, --host <HOST>           | APP_HOST             | 0.0.0.0                   | Address to bind.                                                                  |
| --mysql-host <HOST>         | MYSQL_HOST           | 127.0.0.1                 | MySQL host.                                                                       |
| --mysql-port <PORT>         | MYSQL_PORT           | 3306                      | MySQL port.                                                                       |
| --mysql-user <USER>         | MYSQL_USER           | root                      | MySQL user.                                                                       |
| --mysql-password <PASSWORD> | MYSQL_PASSWORD       | root123456                | MySQL password.                                                                   |
| --mysql-name <NAME>         | MYSQL_NAME           | soulcut_saas_core_service | MySQL database name.                                                              |
| --cors-origins <LIST>       | CORS_ALLOWED_ORIGINS | \*                        | Comma-separated list of allowed CORS origins. Use concrete origins in production. |
| --help                      | -                    | -                         | Print this help and exit.                                                         |

Examples:

    # Override the listen port and point at a remote MySQL.
    cargo run -- --port 9000 --mysql-host 10.0.0.5

    # Restrict CORS to the production frontends.
    cargo run -- --cors-origins "https://app.soulcut.com,https://admin.soulcut.com"

## Environment variables

| Variable             | Required         | Default                   | Description                                                                                                    |
| -------------------- | ---------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------- |
| JWT_SECRET           | yes (production) | dev-secret-change-me      | Secret used to sign JWTs. Must be a long random string in production. The dev fallback is public and insecure. |
| APP_HOST             | no               | 0.0.0.0                   | Bind address.                                                                                                  |
| APP_PORT             | no               | 8080                      | Listen port.                                                                                                   |
| MYSQL_HOST           | no               | 127.0.0.1                 | MySQL host.                                                                                                    |
| MYSQL_PORT           | no               | 3306                      | MySQL port.                                                                                                    |
| MYSQL_USER           | no               | root                      | MySQL user.                                                                                                    |
| MYSQL_PASSWORD       | no               | root123456                | MySQL password.                                                                                                |
| MYSQL_NAME           | no               | soulcut_saas_core_service | MySQL database name.                                                                                           |
| CORS_ALLOWED_ORIGINS | no               | \*                        | Comma-separated list of allowed CORS origins. Set concrete origins in production.                              |

Generate a JWT secret:

    openssl rand -base64 48
