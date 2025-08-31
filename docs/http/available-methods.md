---
layout: doc
aside: false
---

# HTTP - Available Methods

Other than some configuration methods, Camouflage also allows you to control the server and customize the server behavior using some additional methods.

### _getHelpers = (): Helpers_

When you create a `CamouflageHttp` object, it automatically creates an instance of helpers. You can use `getHelpers()` to get a reference to this helpers object. This is useful when you want to add custom helpers that are specific to your requirements.

```js
import Helpers from "@camouflage/helpers";

const helpers = camouflageHttp.getHelpers();

helpers.addHelper("ping", (context) => {
  return "pong";
});

camouflageHttp.start();
```

You can learn more about helpers in the [Helpers](/helpers/) section. Take a look at how inbuilt helpers have been created, in case you want to understand how custom helpers can be created. Refer to the [helper source code](https://github.com/camouflage-app/camouflage/tree/main/packages/helpers/src/core).

### _loadConfigFromJson = (configFilePath: string): void_

`loadConfigFromJson` lets you load a config via a .json file. You don't need to worry about validating your config file, Camouflage takes care of validating your config and prints relevant errors which help you fix your config files, if you miss something.

> [!NOTE]
> Camouflage allows you to configure your server in various ways:
>
> - [`config.json`](/http/configuration#using-config-json)
> - Advanced configuration using `CamouflageHttp` [methods](/http/configuration#advanced-configuration).
> - And you can also configure your server programmatically by initializing [`CamouflageHttp`](/http/configuration#configuration-via-camouflagehttp-options) with necessary options.
>
> Depending on how you prefer to configure your server, you can choose to include your config as part of your code and ensure the types yourself, you may at times want to maintain the configuration for your Camouflage server separate from the application code in json files. This is usually a good practice from the point of view of maintainability, or even practical if you want to maintain multiple config files for different usecases. Or you may want to use a combination of json file and the available methods for more control.

### _addHook = (route: string, event: "onRequest" | "beforeResponse" | "afterResponse", fn: CamouflageHttpHook): void_

Camouflage allows you to add hooks to specific routes. You can add hooks to listen to certain events and manipulate the request/response as you wish. You can use this to create your own additional logic on top of how Camouflage generates the responses. You have access to `req` and `res` objects from express and `camouflageResponse` from Camouflage in these hooks, which you can use to for custom loggers, add headers, manipulate the response body and more.

Available hooks are:

- **onRequest**: `onRequest` hooks are executed as soon as Camouflage recieves the request. You can use `onRequest` hooks to intercept the incoming request. You can either **make some changes to your incoming request object** and then let Camouflage run the response builder on the modified request, or **bypass the Camouflage response builder entirely** and send the response from within the hook itself without refering to any mock files.

- **beforeResponse**: `beforeResponse` hooks are executed right before Camouflage is about to send the response. `beforeResponse` hooks are useful when you want Camouflage response builder to use the provided mock file to build a response, however you want to modify the response before it's sent.

- **afterResponse**: `afterResponse` hooks are executed once Camouflage has sent the response. `afterResponse` hooks is useful for logging or other such activities.

You can see example of these hooks in action in the [`Hooks` section](/http/hooks).

### _async start(): Promise&lt;void&gt;_

Self explanatory. Starts the Camouflage http server.

### _async stop(): Promise&lt;void&gt;_

Self explanatory. Stops the Camouflage http server.

### _async restart(): Promise&lt;void&gt;_

Self explanatory. Restarts the Camouflage http server.
