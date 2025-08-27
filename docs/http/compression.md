---
layout: doc
aside: false
---

# HTTP - Compression

You can enable the compression options via `config.json`. Once enabled, compression is applied on all the routes, however you can restrict this behaviour using the `setupCompressionWithOptions` method and [available options](https://www.npmjs.com/package/compression#options)

Enable compression in `config.json`

```json
{
  // Other Camouflage options
  "compression": true
}
```

Then provide required options

```js
function shouldCompress(req, res) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}
camouflageHttp.setupCompressionWithOptions({ filter: shouldCompress });
```
