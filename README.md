# Jellyfin Wireless Remote

![logo](/public/logo.png)

Jellyfin Wireless Remote is a SO agnostic SPA for remote usage of your Jellyfin instance via Remote Control

> This app was built using [Jellyfin SDK](https://github.com/jellyfin/jellyfin-sdk-typescript) and [Jellyfin API](https://api.jellyfin.org/)

* ~~[Quick demostration Video](https://youtu.be/WuA-TMfj0tQ)~~ ***outdated***
* [Demo Webpage](https://jellyfin-wireless-remote.vercel.app/)
* [How to install](#installation)
* [Extra Config](#configuration)

> Feel free to use the Demo Webpage as your wireless remote, but i would highly recommend to selfhost your own instance for privacy.

## Installation

You must have `docker` or `podman`, since _Docker_ is the most popular among devs i will provide a docker guide, but works the same changing the word `podman` for `docker`, indeed i use podman.

### Using Docker Compose  

If you have **docker compose** or **podman compose** installed you can copy the [Production Compose File](./docker-compose.prod.yml) or copy the example bellow

```yml
services:
  web:
    image: ghcr.io/jnunez2301/jellyfin-wireless-remote:latest
    environment:
      # If default host is provided on the main page it will fill the form automatically
      # e.g: VITE_JELLYFIN_DEFAULT_HOST=yourjellyfindomain.com
      - "${VITE_JELLYFIN_DEFAULT_HOST}"
      # You can set a default user and password from Jellyfin to trigger auto-login
      # [!] If your server is exposed to the internet it's not recommended to use this option for security reasons since VITE exposes this to the public
      - "${VITE_JELLYFIN_DEFAULT_USERNAME}"
      - "${VITE_JELLYFIN_DEFAULT_PASSWORD}"
    ports:
      - "${SERVER_PORT:-8080}:3000"
    container_name: jellyfin_wireless_remote
    restart: unless-stopped
```

### Manually

```bash
# Clone the repo
git clone https://github.com/jnunez2301/jellyfin-wireless-remote.git
# Go to repo directory
cd jellyfin-wireless-remote
# build and run detached
sudo docker compose up -d
```

## Configuration

## How do i change the Port?

By default it runs on 8080 on the host myachine, you can change this port by providing the _env_ variable

```bash
SERVER_PORT=3000
```

## Can i use a default host/user?

Yes you can provide a default host, user and password you can either create an `.env` file or provide them by *args* in your shell.


```bash
VITE_JELLYFIN_DEFAULT_HOST=127.0.0.1:8096
# [!] It's highly recommended to only use this for local instances
VITE_JELLYFIN_DEFAULT_USERNAME=jellyfin_user
VITE_JELLYFIN_DEFAULT_PASSWORD=jellyfin_password
```


## Why did you build this?

Every day i get in the threadmill to walk at least 30-45 minutes, but i always put something to watch while i'm walking tried so many remote apps but none of them would fit my needs, since i only use Jellyfin as my media player I decided to create my own Remote that could be used on my phone regardless of it being Android or iOS.

## Did you use AI?

Yes i did use AI i used generative AI for the logo which i plan to change and pay a real artist for a more personalized picture.

I wrote 90% of the code and only a few AI code is here which i checked before placing it in to my code, every code that was wrriten purely by AI has the text `"// -------- [AI Content] may contain some alucination --------` to indicate that i used AI for that specific component.

I tried my best to keep this code as clean as possible, so i hope it can be manteined with ease for me or other devs.

And no, this app was not vibe coded i'm not a huge fan of vibe coding things.

## And who are you?

I'm a Software Engineer that has been working for the past 3 years in this field, huge fan of selfhosting and besides other things myself which i go outside as the name of "roxc" or "jnunez" on my github account.
