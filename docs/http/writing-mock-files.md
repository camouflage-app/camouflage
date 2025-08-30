---
layout: doc
aside: false
---

# HTTP - Writing Mock Files

Camouflage expects a raw HTTP Response to be placed in the .mock files. Please refer to this [Wikipedia](https://en.wikipedia.org/wiki/HTTP_message_body) page, if you are not sure what the response looks like.

Each mock file can have the HTTP Responses in following manner:

- One response per .mock file.
- Multiple responses in one .mock file with conditions defined to help Camouflage decide which response should be sent under what conditions. (Read Handlebars section for more)
- Multiple responses separated by Camouflage's delimiter i.e. "====" (four equals). Camouflage will pick one response at random and send it to the client.

> [!TIP]
> If you are creating a mock API that mimics a live API, you can simply get the content for your mock file by making a curl request to the live API with `curl -i` flag
>
> **Example**:
>
> ```bash
> curl -i -X GET https://jsonplaceholder.typicode.com/users/1 > GET.mock
> ```
>
> Running this command, gives you a `GET.mock` file with following content. Modify it according to your requirement and place it in the location `mocks/users/{userId}`, and you have successfully mocked jsonplaceholder API.

## Mock File Content

### Single Response

The simplest mock file would contain:

- Status line, such as HTTP/1.1 200 OK,
- Headers
- An empty line
- Optional HTTP message body data

> [!WARNING]
> Comments are not allowed in a mock file

Example:

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]
```

You can use helpers to enhance this static response and introduce some dynamically generated outputs. The same response could also look like:

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
    {{~#repeat 3~}}
        {{~#if @last~}}
            { "id": "{{random}}", "name": "{{faker method="person.firstName"}}" }
        {{~else~}}
            { "id": "{{random}}", "name": "{{faker method="person.firstName" sex="female"}}" },
        {{~/if~}}
    {{~/repeat~}}
]
```

The cryptic runes above might look intimidating but they are mostly self explanatory. We are using handlebarjs to create a template which Camouflage uses to generate a dynamic response. We are running a loop with the iteration count 3. If it's the last iteration, we skip the comma at the end of the json object, otherwise we keep the comma. We are also generating a random alphanumeric id and a first name for each user. The "cryptic" rune above, just produces the following output.

```json
[
  { "id": "sY6noRN1PWftcjJC", "name": "Samantha" },
  { "id": "cflA2vjd7bLG7h4C", "name": "Gina" },
  { "id": "M5PXiJLaYWoV0XA3", "name": "Cyrus" }
]
```

> [!TIP]
> We will learn more about helpers in the [Helpers section](/helpers/).

### Multiple Responses - Randomly Selected

You can introduce some randomness without writing any logic. This is helpful in case you want to introduce some faults in your APIs, have them fail intermittently, send out 2XX responses sometimes or 4XX/5XX responses other times. Or you simply just want some sort of chaos.

You can have multiple responses in the same .mock file separated by `====` (four equals), and Camouflage will pick on at random and use it to generate the response.

```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  { "id": 1, "name": "Alice" },
  { "id": 2, "name": "Bob" }
]
====
HTTP/1.1 403 OK
Content-Type: application/json

{ "error": "Forbidden" }
```

### Multiple Responses - Request Matching

Finally, you can write some conditional checks to determine which response you want to use. In the scenarios when you would need to change your response based on some conditions met by fields on request objects. For example, if the end user passes an Authorization header, you'd want to send a 200 OK response if not you'd want to send a 401 Unauthorized response.

Let's understand how to do this in the following example:

You expect the user to call the endpoint `/hello` in two ways.

- By simple making a GET request to `/hello`; Or
- By adding a query parameter name in the GET request to `/hello`. i.e. `/hello?name=John`

Based on how the user calls the API, you'd want to send different responses. Let's see how we can achieve the desired result.

Start by creating a `GET.mock` file at the location `mocks/hello`. Paste the following content in the mock file.

```http
{{#if request.query.name}}
HTTP/1.1 200 OK
Content-Type: application/json

{
    "greeting": "Hello {{capture from='query' key='name'}}",
    "phone": {{random length=10 type='NUMERIC'}},
    "dateOfBirth": "{{now format='MM/DD/YYYY'}}"
}
{{else}}
HTTP/1.1 200 OK
Content-Type: application/json

{
    "greeting": "Hello World",
    "phone": {{random length=10 type='NUMERIC'}},
    "dateOfBirth": "{{now format='MM/DD/YYYY'}}"
}
{{/if}}
```

In the example above, we have provided two responses that Camouflage can pick from, one with `greeting: "Hello World"`, and another with `greeting: "Hello John"`. In the first line of the mock <span v-pre>`{{#if request.query.name}}`</span>, we are checking for the condition, if there exists a query parameter called `name`. And that's it. If your request is made with the query param `name`, Camouflage will respond with first response, if not then the 2nd second response is what you get. And the value of `name` can be anything. We are using `capture` helper to help us make our response dynamic.

> [!TIP]
> `if` and `unless` helpers are provided by handlebarjs, which don't have comparison capabilities. These helpers only check if the provided value is truthy or falsy. i.e. you can not do something like this: <span v-pre>`{{#if something = something}}`</span>. For comparisons, you'd need to use `is` helper. See [Helpers page](/helpers/) for example.

#### Request Matching using headers

You can use the approach shown above to perform request matching with query, path params and cookies. Use `request.query.name` or `request.params.name` or `request.cookies.something` as required.

However for headers and body, we need to follow a slightly different approach. In the following example, we are using `capture` helper to capture a specific header value which then can be passed to other helpers like `is` or `if`.

```http
{{#if (capture from='headers' key='Authorization') }}
HTTP/1.1 200 OK
Content-Type: application/json

{
    "response": "response if auth header is present."
}
{{else}}
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
    "response": "response if no auth header present."
}
{{/if}}
```

If you want to validate a given header against a specific value, the mock file would be as shown below:

```http
{{#is (capture from='headers' key='Authorization') 'Basic c2h1YmhlbmR1Om1hZGh1a2Fy' }}
HTTP/1.1 200 OK
Content-Type: application/json

{
    "response": "response if auth header is present."
}
{{else}}
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
    "response": "response if no auth header present."
}
{{/is}}
```

#### Request Model

Request object made available by Camouflage is simply an instance of express request object for a given incoming request. Following are the properties/objects available on the request object which can be used in request matching or to extract information out of the request.

- request.baseUrl
- request.body
- request.cookies
- request.method
- request.originalUrl
- request.path
- request.protocol
- request.query
- request.body

Refer to [Express Documentation](https://expressjs.com/en/5x/api.html) for more information on each of these properties.

### Response Delays

You can add a Response-Delay header in raw response placed in your .mock file.

For example, if you'd like to simulate a delay of 2 seconds for` GET /hello` endpoint, contents of your `mocks/hello/GET.mock` file would be as follows:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Response-Delay: 2000

{
    "greeting": "Hello World",
    "phone": {{random length=10 type='NUMERIC'}},
    "dateOfBirth": "{{now format='MM/DD/YYYY'}}",
}
```

Additionally you can also simulate a dynamic delay using the {{num_between}} handlebar as follows

```http
Response-Delay: {{num_between lower=500 upper=600}}
```
