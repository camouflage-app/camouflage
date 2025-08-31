---
layout: doc
aside: false
---

# HTTP - Hooks

While for most use cases Camouflage by itself is powerful enough to generate dynamic mocked responses, you often won't need to write more JavaScript/TypeScript code than what we did in the [quick start](/http/quick-start) section. However, Camouflage's extensibility allows you to customize your mock server in the way you want. There are two ways to extend and customize Camouflage's capabilities.

1. **Helpers**: Camouflage's templates and built-in helpers allow you to make your response dynamic using helpers like `faker`, `random`, `now`, and more. You can add delays by adding a `Response-Delay` header in your mock files. You can even write some basic if/else blocks and use loops for request matching and conditional responses using the [Handlerbar.js](https://handlebarsjs.com/) templating language. We'll learn more about [Helpers](/helpers/) in the Helpers section.
2. **Hooks**: Hooks allow you to go beyond the Handlebars/helpers capabilities and write your own code to extend and customize how Camouflage generates your responses. In this section, we'll learn how to write hooks.

### `onRequest`

The `onRequest` hook is called as soon as the Camouflage server receives a request for a specific URL. You can use this hook to intercept and modify your request objects, attach additional headers, or check certain conditions and decide whether to send your own response or let Camouflage handle the response generation.

In the following example, we'll see how we can use the `onRequest` hook to intercept the incoming request:

```js
camouflageHttp.addHook("/user/{userId}/wallet/{walletId}", "onRequest", (req, res) => {
  console.log("Hello from hook", req.route.path); // You can do some logging
  res.set("Sent-From", "onRequestHook"); // You can set some headers
  // You can check for some conditions
  if (req.param.userId === 1) {
    // If the condition passes, you can choose
    // to bypass Camouflage entirely by sending the response from within the hook
    res.set("Content-Type", "application/json");
    const body = {
      message: "Sent from onRequestHook",
    };
    res.status(200).send(JSON.stringify(body));
  }
  // Or you can do nothing and let Camouflage take over after you are done modifying the request/response objects
});
```

### `beforeResponse`

The `beforeResponse` hook is called when Camouflage has finished generating the response but hasn't sent it yet. You get access to an additional `camouflageResponse` object in this hook, which you can inspect or modify before letting Camouflage send it.

```js
camouflageHttp.addHook("/user/{userId}/wallet/{walletId}", "beforeResponse", (req, res, camouflageResponse) => {
  if (camouflageResponse) console.log(camouflageResponse);
  res.set("Added-In-Hook", "SomeHeader");
});
```

### `afterResponse`

The `afterResponse` hook is called after Camouflage has sent the response back to the client. You can use `afterResponse` hooks to measure time, log messages, or perform cleanup activities. An example is shown below:

```js
let time = 0;
let startTime = 0;
camouflageHttp.addHook("/user/{userId}/wallet/{walletId}", "onRequest", (req, res) => {
  startTime = Date.now();
  console.log("Hello from hook", req.route.path);
});
camouflageHttp.addHook("/user/{userId}/wallet/{walletId}", "afterResponse", (req, res) => {
  time = Date.now() - startTime;
  console.log(time);
  time = 0;
  startTime = 0;
});
```

Now that you know how the hooks work, you can let your creativity flow. If you come up with an interesting use case, feel free to [show off](https://github.com/camouflage-app/camouflage/discussions/categories/show-and-tell)!
