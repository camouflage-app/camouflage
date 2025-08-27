---
layout: doc
aside: false
---

# HTTP - Validation

Camouflage uses `express-openapi-validator` to enable you to validate your requests/responses against a provided OpenAPI 3 schema.

You can configure validation in two ways.

- **Basic Usage**: You can enable it via config.json. Add following options to you config:

```json
{
  // Other Camouflage options
  "validation": {
    "enable": true,
    "apiSpec": "./apiSpec.yaml",
    "validateRequests": true,
    "validateResponses": true
  }
}
```

Modify the above config as per your requirements, and you are good to go.

- **Advanced Usage**: If you want more control over how to configure validation, you can set the [supported validation options](https://cdimascio.github.io/express-openapi-validator-documentation/usage-options-summary/) via the Camouflage method `setupValidationWithOptions`

Enable it via config

```json
{
  // Other Camouflage options
  "validation": {
    "enable": true
  }
}
```

And then configure rest of the options as you wish

```js
camouflageHttp.setupValidationWithOptions({
  apiSpec: "./openapi.yaml",
  validateRequests: true,
  validateResponses: true,
  // Other options
});
```
