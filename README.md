# Jellyfin Wireless Remote

![logo](/public/logo.png)

Jellyfin Wireless Remote is a SO agnostic SPA for remote usage of your Jellyfin Client

> This app was built using [Jellyfin SDK](https://github.com/jellyfin/jellyfin-sdk-typescript) and [Jellyfin API](https://api.jellyfin.org/)

* [Demo Webpage](https://jellyfin-wireless-remote.vercel.app/)
* [How to install](#installation)
* [Configuration](#configuration)
* [Android](#android)
* [iOS](#ios)

> Feel free to use the Demo Webpage as your wireless remote, but i would highly recommend to selfhost your own instance for privacy.

## Why would i want to use this there is already official app for this?

I know there is an official app for this but i found it to be a bit clunky and not as user friendly as i would like it to be, it's not built in many other Jellyfin Clients so this is more like an universal remote that can be used on any device. Just like your TV remote you already have one but other TV's don't have the same remote and features.

## Why did you build this?

Every day i get in the threadmill to walk at least 30-45 minutes, but i always put something to watch while i'm walking tried so many remote apps but none of them would fit my needs, since i only use Jellyfin as my media player I decided to create my own Remote that could be used on my phone regardless of it being Android or iOS.

## Installation

You must have `docker` or `podman`, since _Docker_ is the most popular among devs i will provide a docker guide, but works the same changing the word `podman` for `docker`, indeed i use podman.

### Docker

This works for podman aswell just change the word `docker` for `podman` but make sure you have installed `podman compose` if you are using podman

```bash
#Download the docker-compose..yml
curl -L https://raw.githubusercontent.com/jnunez2301/jellyfin-wireless-remote/main/docker-compose.prod.yml -o docker-compose.yml

#Run the docker-compose
sudo docker compose up -d
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

## Android

For android devices we are using `@capacitor` to build the app, so you will need to have `android-sdk` installed and configured on your machine.
```bash

# Java version used
java version "21.0.10" 2026-01-20 LTS
Java(TM) SE Runtime Environment (build 21.0.10+8-LTS-217)
Java HotSpot(TM) 64-Bit Server VM (build 21.0.10+8-LTS-217, mixed mode, sharing)
```

I highly recommend using *Android Studio* to build and run the app.A nyways we have already prebuilt *APK*s at [Releases](https://github.com/jnunez2301/jellyfin-wireless-remote/releases) page but if you want to build your own you can run this scripts

```bash
# At the root of the project just run
bun run build:android
# Then if you have Android Studio opened it will promp to open it on the /android folder, if not you can open it manually

# Then just run the assembleRelease to get the APK
./gradlew assembleRelease
# The APK will be located at /android/app/build/outputs/apk/release/app-release.apk
# Or you can either run and copy the apk to the dist folder
cp android/app/build/outputs/apk/release/app-release.apk ./dist/app-release.apk
```

## iOS Support

I do not own an Apple Device and maybe never will so i can't provide support for iOS devices If you want to support it you can fork this repo and add iOS support.

Anyways you can use the [Demo Webpage](https://jellyfin-wireless-remote.vercel.app/) as your wireless remote or selfhost your own instance.


### Configuration

#### How do i change the Host Port?

By default it runs on 8080 on the host machine, you can change this port by providing the _env_ variable

```bash
# Where the client will be running
SERVER_PORT=3000
```

## Did you use AI?

> I gotta say I will never blidnly use AI and i will always check the code before using it and no this app was not vibe coded i'm not a huge fan of vibe coding things.

Yes i did use AI i used generative AI for the logo which i plan to change and pay a real artist for a more personalized picture.

I wrote 90% of the code and only a few AI code is here which i checked before placing it in to my code, every code that was wrriten purely by AI has the text `// -------- [AI Content] may contain some alucination --------` to indicate that i used AI for that specific component.

I tried my best to keep this code as clean as possible, so i hope it can be manteined with ease for me or other devs.