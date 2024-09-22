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
- **Next.js 14** ![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)
- **Prisma** ![Prisma](https://img.shields.io/badge/Prisma-2d3748?logo=prisma&logoColor=white)
- **MySQL** ![MySQL](https://img.shields.io/badge/MySQL-00758f?logo=mysql&logoColor=white)
- **Clerk** ![Clerk](https://img.shields.io/badge/Clerk-004dff?logo=clerk&logoColor=white)
- **Socket.IO** ![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io&logoColor=white)
- **TypeScript** ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
- **Docker-Compose** ![Docker-Compose](https://img.shields.io/badge/Docker--Compose-2496ed?logo=docker&logoColor=white) (optional)

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

#### 1. Install NodeJS version 18 or later

##### a. Mac OS

- Step 1: Install Homebrew\*\*

```shell
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

- Step 2: Update Homebrew\*\*

```shell
brew update
```

- Step 3: Install NodeJS 18\*\*

```shell
brew install node@18
```

##### b. Windows install with Chocolate

- Step 1: Open PowerShell as Administrator and run the following command\*\*

```shell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```

- Step 2: Install NodeJS\*\*

```shell
choco install -y nodejs-lts
```

##### c. Linux

- Step 1: Install NodeJS\*\*

```shell
sudo apt install -y nodejs
```

After installing NodeJS, you can verify the installation by running the following command:

```shell
node -v
```

**If you want to use yarn instead of npm, you can to install it with the following command.**

```shell
npm i -g yarn
```

#### 2. Get Your Clerk API Keys (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY)

##### Step 1: Create a Clerk Account

- Go to [Clerk.dev](https://clerk.dev) and sign up for an account if you don't have one.

##### Step 2: Create an Application

- Log in to the Dashboard.
- Click on “Create Application” or select an existing one.

##### Step 3: Find Your API Keys

- In the application settings, you will see your API keys listed:
  - **NEXT_PUBLIC_CLERK_FRONTEND_API**: Public key for frontend use.
  - **CLERK_API_KEY**: Secret key for server-side use.

##### Step 4: Copy the Keys

- Copy the keys and store them securely in your environment variables.

##### Step 5: Environment Configuration

- Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` & `CLERK_SECRET_KEY` in your environment file (e.g., `.env`):
  ```bash
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_publishable_key>
  CLERK_SECRET_KEY=<your_secret_key>
  ```

#### 3. Get your Upload Thing API Key (UPLOADTHING_TOKEN)

##### Step 1: Create an Uploadthing Account

- Go to [Uploadthing.com](https://uploadthing.com) and sign up for an account if you haven't done so.

##### Step 2: Access Your Dashboard

- Log in to your Uploadthing account.
- Navigate to your dashboard to manage your applications [Uploadthing.com/dashboard](https://uploadthing.com/dashboard)

##### Step 3: Create a New Project

- Click on “Create New Project” or select an existing project.
- Fill in the necessary details and save your project.

##### Step 4: Retrieve Your Token

- In the project settings, you will find your API keys and tokens.
- Locate the **UPLOADTHING_TOKEN** and copy it.

##### Step 5: Store Your Token Securely

- Store your token securely in your environment variables or configuration files to keep it confidential.

##### Step 6: Use the Token in Your Application

- Set the `UPLOADTHING_TOKEN` in your environment file (e.g., `.env`):
  ```bash
  UPLOADTHING_TOKEN=<your_uploadthing_token>
  ```

#### 4. Docker Desktop or Docker Compose (optional)

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
DATABASE_URL="mysql://discord:discord@localhost:3306/discord"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
UPLOADTHING_TOKEN=
```

#### 4. Add MySQL Database (I used docker compose)

```shell
npm run docker-compose:dev
```

or

```shell
yarn docker-compose:dev
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

| Command               | Description                                                        |
| :-------------------- | :----------------------------------------------------------------- |
| `dev`                 | Starts a development instance of the app                           |
| `build`               | Builds the application for production                              |
| `start`               | Starts the production server                                       |
| `lint`                | Runs the linter to check for code issues                           |
| `prisma:reset`        | Resets the database by rolling back and applying migrations        |
| `prisma:studio`       | Opens the Prisma Studio for database management                    |
| `prisma:generation`   | Generates the Prisma client and applies the schema to the database |
| `docker:start`        | Builds and runs the Dockerfile for the application                 |
| `docker:stop`         | Stops the running Docker container for the application             |
| `docker-compose:dev`  | Starts the Docker containers in detached mode                      |
| `docker-compose:stop` | Stops and removes the Docker containers                            |
