# Fullstack Discord: Next.js 14, React, Socket.io, Prisma, Tailwind CSS, MySQL

## Demo

## Screenshots

## Technologies

### Front-End

- **Node.js** ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
- **Next.js 14** ![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)
- **TypeScript** ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
- **App Router** ![App Router](https://img.shields.io/badge/App%20Router-Enabled-4f4f4f)
- **Shadcn UI** ![Shadcn UI](https://img.shields.io/badge/Shadcn%20UI-Component%20Library-000000)
- **Tailwind CSS** ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-06b6d4?logo=tailwindcss&logoColor=white)
- **Realtime with Socket.IO** ![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?logo=socket.io&logoColor=white)

### Back-End

- **Node.js** ![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
- **Docker-Compose** ![Docker-Compose](https://img.shields.io/badge/Docker--Compose-2496ed?logo=docker&logoColor=white)
- **Prisma** ![Prisma](https://img.shields.io/badge/Prisma-2d3748?logo=prisma&logoColor=white)
- **MySQL** ![MySQL](https://img.shields.io/badge/MySQL-00758f?logo=mysql&logoColor=white)
- **Clerk** ![Clerk](https://img.shields.io/badge/Clerk-004dff?logo=clerk&logoColor=white)
- **Socket.IO** ![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io&logoColor=white)
- **NestJS** ![NestJS](https://img.shields.io/badge/NestJS-e0234e?logo=nestjs&logoColor=white)
- **TypeScript** ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

## Features:

- Real-time messaging using Socket.io
- Send attachments as messages using UploadThing
- Delete & Edit messages in real time for all users
- Create Text, Audio and Video call Channels
- 1:1 conversation between members
- 1:1 video calls between members
- Member management (Kick, Role change Guest / Moderator)
- Unique invite link generation & full working invite system
- Infinite loading for messages in batches of 10 (tanstack/query)
- Server creation and customization
- Beautiful UI using TailwindCSS and ShadcnUI
- Full responsivity and mobile UI
- Light / Dark mode
- Websocket fallback: Polling with alerts
- ORM using Prisma
- MySQL database using Planetscale
- Authentication with Clerk

## Getting Started

### Prerequisites

**Node version 18 or later**
**If you want to use yarn instead of npm, you can to install it with the following command.**

```shell
npm i -g yarn
```

### Installation:

**Instructions for setting up the project locally.**

#### 1. Cloning the repository

```shell
git clone https://github.com/tuanpandadev/discord-clone.git
```

or

```shell
git clone git@github.com:tuanpandadev/discord-clone.git
```

#### 2. Install packages

```shell
npm i
```

or

```shell
yarn install
```

#### 3. Setup .env file

```js
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=
UPLOADTHING_TOKEN=
```

#### 4. Add MySQL Database (I used docker compose)

```shell
npm run docker
```

or

```shell
yarn docker
```

#### 5. Setup Prisma

```shell
npm prisma:generation
```

or

```shell
yarn prisma:generation
```

#### 6. Start the app

```shell
npm run dev
```

or

```shell
yarn dev
```

#### 7. Available Commands

You can run commands using npm with `npm run [command]`. Here are the available commands and their descriptions:

| Command             | Description                                              |
| :------------------ | :------------------------------------------------------- |
| `dev`               | Starts a development instance of the app                 |
| `build`             | Builds the application for production                    |
| `start`             | Starts the production server                             |
| `lint`              | Runs the linter to check for code issues                 |
| `docker:build`      | Builds and starts the Docker containers in detached mode |
| `docker`            | Starts the Docker containers in detached mode            |
| `docker:stop`       | Stops and removes the Docker containers                  |
| `setup:db`          | Applies database migrations and pulls the schema         |
| `prisma:generation` | Generates Prisma client and applies schema to database   |
