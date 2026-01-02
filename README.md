# Jellyfin Wireless Remote

![logo](/public/logo.png)

Jellyfin Wireless Remote is a SO agnostic SPA for remote usage of your Jellyfin instance via Remote Control

> This app was built using [Jellyfin SDK]('https://github.com/jellyfin/jellyfin-sdk-typescript') and [Jellyfin API]('https://api.jellyfin.org/')

## How do i install it?

You must have `docker` or `podman`, since *Docker* is the most popular among devs i will provide a docker guide, but works the same changing the word `podman` for `docker`, indeed i use podman.

```bash
# Clone the repo
git clone https://github.com/jnunez2301/jellyfin-wireless-remote.git

# build and run detached
sudo docker compose up -d
```
## How do i change the Port?

By default it runs on 8080 on the host myachine, you can change this port by providing the *env* variable
```bash
SERVER_PORT=3000
```

## Why did you build this?

Every day i get in the threadmill to walk at least 30-45 minutes, but i always put something to watch while i'm walking tried so many remote apps but none of them would fit my needs, since i only use Jellyfin as my media player I decided to create my own Remote that could be used on my phone regardless of it being Android or iOS.

## Did you use AI?

Yes i did use AI i used generative AI for the logo which i plan to change and pay a real artist for a more personalized picture.

I wrote 90% of the code and only a few AI code is here which i checked before placing it in to my code, every code that was wrriten purely by AI has the text `"// -------- [AI Content] may contain some alucination --------` to indicate that i used AI for that specific component.