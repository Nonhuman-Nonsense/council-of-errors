# Council of Errors

A Telegram relay bot for error messaging and system monitoring.

## Features
1.  **HTTP Relay**: Accepts POST requests and forwards the JSON body to a Telegram chat.
2.  **Docker Monitor**: Listens to the local Docker engine for `health_status: unhealthy` events and automatically alerts when a container fails.

## Configuration
The application requires the following environment variables:

-   `ERRORBOT_TOKEN`: Your Telegram Bot API Token.
-   `ERRORBOT_CHAT`: The Chat ID to send messages to.
-   `ERRORBOT_URL`: The public URL (used for Telegram Webhook).

## Running with Docker
To enable the Docker monitoring feature, you **must** mount the Docker socket into the container.

```yaml
services:
  errorbot:
    image: nonhumannonsense/council-of-errors:latest
    environment:
      - ERRORBOT_TOKEN=...
      - ERRORBOT_CHAT=...
      - ERRORBOT_URL=...
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
```

## Build docker image

```
docker build . -t nonhumannonsense/council-of-errors:latest
docker push nonhumannonsense/council-of-errors:latest
```

on Apple silicon, you might need to add `--platform linux/amd64` or similar to the build command

### Licence

This work is licensed under a
[Creative Commons Attribution-NonCommercial 4.0 International License][cc-by-nc]

[![CC BY-NC 4.0][cc-by-nc-image]][cc-by-nc]

[cc-by-nc]: https://creativecommons.org/licenses/by-nc/4.0/
[cc-by-nc-image]: https://licensebuttons.net/l/by-nc/4.0/88x31.png
[cc-by-nc-shield]: https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg
