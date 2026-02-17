# Jellyfin Wireless Remote

![logo](/public/logo.png)

Jellyfin Wireless Remote is a SO agnostic SPA for remote usage of your Jellyfin instance via Remote Control

> This app was built using [Jellyfin SDK](https://github.com/jellyfin/jellyfin-sdk-typescript) and [Jellyfin API](https://api.jellyfin.org/)

* [Demo Webpage](https://jellyfin-wireless-remote.vercel.app/)
* [How to install](#installation)
* [Extra Config](#configuration)

> Feel free to use the Demo Webpage as your wireless remote, but i would highly recommend to selfhost your own instance for privacy.

## Why would i want to use this there is already official app for this?

I know there is an official app for this but i found it to be a bit clunky and not as user friendly as i would like it to be, it's not built in many other Jellyfin Clients so this is more like an universal remote that can be used on any device. Just like your TV remote you already have one but other TV's don't have the same remote and features.

## Installation

You must have `docker` or `podman`, since _Docker_ is the most popular among devs i will provide a docker guide, but works the same changing the word `podman` for `docker`, indeed i use podman.

### Using Docker Compose  

If you have **docker compose** or **podman compose** installed you can copy the [Production Compose File](./docker-compose.prod.yml)

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
# Where the client will be running
SERVER_PORT=3000
```

## Android

For android devices we are using `@capacitor` to build the app, so you will need to have `android-sdk` installed and configured on your machine.

I highly recommend using *Android Studio* to build and run the app.

Anyways we have already prebuilt *APK*s at [Releases](/releases) page.

But if you want to build your own you can run this scripts

```bash
# At the root of the project just run
bun run build:android
# Then if you have Android Studio opened it will promp to open it on the /android folder, if not you can open it manually

# Then just run the assembleRelease to get the APK
./gradlew assembleRelease
# The APK will be located at /android/app/build/outputs/apk/release/app-release.apk
```

## iOS Support

I do not own an Apple Device i maybe never will so i can't provide support for iOS devices, if you want to support it you can fork this repo and add iOS support.

## Why did you build this?

Every day i get in the threadmill to walk at least 30-45 minutes, but i always put something to watch while i'm walking tried so many remote apps but none of them would fit my needs, since i only use Jellyfin as my media player I decided to create my own Remote that could be used on my phone regardless of it being Android or iOS.

## Did you use AI?

Yes i did use AI i used generative AI for the logo which i plan to change and pay a real artist for a more personalized picture.

I wrote 90% of the code and only a few AI code is here which i checked before placing it in to my code, every code that was wrriten purely by AI has the text `// -------- [AI Content] may contain some alucination --------` to indicate that i used AI for that specific component.

I tried my best to keep this code as clean as possible, so i hope it can be manteined with ease for me or other devs.

And no, this app was not vibe coded i'm not a huge fan of vibe coding things.