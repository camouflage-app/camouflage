# @camouflage/helpers

A collection of **Handlebars helpers** used by Camouflage to generate **dynamic mock responses**.

- ✅ Generate fake names, emails, dates
- ✅ Pick random values & numbers
- ✅ Import mock files
- ✅ Access request data (query params, headers, cookies)
- ✅ Maintain state across requests

> [!NOTE]
> These helpers are automatically included in **@camouflage/http** and **@camouflage/grpc**

👉 **[Full Documentation](https://camouflage-app.github.io/camouflage/)**

---

## Installation

```bash
npx jsr add @camouflage/helpers
```

## Quick Example

```ts
import Handlebars from "handlebars";
import Helpers from "@camouflage/helpers";

// Register all helpers
const helpers = new Helpers();
helpers.register(Handlebars);

// Use a template with dynamic helpers
const template = Handlebars.compile(`
{
  "id": "{{num_between min=100 max=999}}",
  "name": "{{faker 'name.firstName'}}",
  "created_at": "{{now format='YYYY-MM-DD'}}"
}
`);

console.log(template({}));
// => { "id": 234, "name": "Alice", "created_at": "2025-07-23" }
```

## Built-in Helpers

- faker → generate random names, emails, addresses
- now → current date/time with custom format
- num_between → random number in a range
- random → pick a random value from a list
- concat → join strings
- assign → define and reuse variables
- inject → evaluate simple JS expressions
- request.\* → access incoming request params, headers, etc.

## Usage in Camouflage

When you use **@camouflage/http** or **@camouflage/grpc**, these helpers are already available in `.mock` files:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "{{num_between min=100 max=999}}",
  "name": "{{faker 'name.firstName'}}",
  "timestamp": "{{now format='YYYY-MM-DD HH:mm:ss'}}"
}

```

Response:

```json
{ "id": 456, "name": "Bob", "timestamp": "2025-07-23 10:32:15" }
```
