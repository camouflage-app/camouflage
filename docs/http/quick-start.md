---
layout: doc
aside: false
---

# HTTP - Quick Start

HTTP module of Camouflage lets you mock your backends based on http and https protocols. You can create a Camouflage http object from `CamouflageHttp` class and configure it to serve mocks for your incoming requests.

Let's setup a basic minimal camouflage http mock server in less than 3 minutes.

## Install `@camouflage/http`

- Create a new project

```bash
npm init --y
```

- Change the `type: module` in your `package.json`. Optionally setup typescript.
- Install `@camouflage/http`

```bash
npx jsr add @camouflage/http
```

### Requirements

- Node.js 18+
- npm or yarn

## Setting up HTTP mock server:

Once you have your project setup with Camouflage's http module installed, you can begin to setup your camouflage http server. You need three things.

- A `config.json` file to hold the configurations you want your mock server to use.
- An `index.js` file to write your code in.
- A `mocks/` folder to hold the definitions of what API endpoints you are mocking and what responses you'd expect.

Let's begin:

**Create a config.json file at the root of your project**

```json
{
  "mode": "development",
  "log": {
    "enable": true,
    "level": "info"
  },
  "http": {
    "enable": true,
    "port": 3000
  },
  "mocksDir": "./mocks"
}
```

**Create following folder structure at the root of your project**

```text
mocks/
    users/
        GET.mock
        POST.mock
```

As you can see, we are going to mock two APIs

- GET /users
- POST /users

**In the .mock files, simply write the response you'd like the API to respond**

> [!TIP]
> The response should follow the standard [HTTP Message Body](https://en.wikipedia.org/wiki/HTTP_message_body) format.

Paste following content in `mocks/users/GET.mock`

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]
```

Paste following content in `mocks/users/POST.mock`

```http
HTTP/1.1 201 Created
Content-Type: application/json

{ "message": "User created successfully" }
```

**And finally write the following code in the `index.js` file to start your mock server**

```javascript
import CamouflageHttp from "@camouflage/http";

const server = new CamouflageHttp();
server.loadConfigFromJson("./config.json");
server.start();
```

**Run `node index.js`, and you have your mock server running at http://localhost:3000/**

## Test your APIs

```bash
curl -X GET http://localhost:3000/users
```

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "email@email.com",
    "password": "very-strong-password"
  }'
```

Congratulations! You have just created two mock APIs. And we are done... just kidding, we are just getting started.

Let's dive in what [configuration options](/http/configuration) you have and how you can use them to granularly control your Camouflage server.
