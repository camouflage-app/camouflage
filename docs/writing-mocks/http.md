# Writing HTTP Mocks

Camouflage uses a file-based routing system where the folder structure maps directly to routes. For HTTP, folders map to URL paths.

Mock files define:

- HTTP status codes & headers
- Response bodies (static or dynamic)
- Optional delays & randomization

## Routing Conventions

- mocks/users/GET.mock → GET /users
- mocks/users/POST.mock → POST /users
- mocks/users/{id}/GET.mock → GET /users/:id

> [!TIP]
> On Windows, avoid `:` in folder names—use `{param}` instead.

Supported HTTP methods:
GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS, TRACE

## Mock file content

Camouflage expects a raw HTTP Response to be placed in the .mock files. Please refer to this [Wikipedia](https://en.wikipedia.org/wiki/HTTP_message_body) page, if you are not sure what the response looks like.

Each mock file can have the HTTP Responses in following manner:

- One response per .mock file.
- Multiple responses in one .mock file with conditions defined to help Camouflage decide which response should be sent under what conditions. (Read [Helpers](/helpers) section for more)
- Multiple responses separated by Camouflage's delimiter i.e. "====" (four equals). Camouflage will pick one response at random and send it to the client. An example of this can be found here

The data you want in your mock file can be easily fetched using a curl command with -i -X flags as shown in the example below.

```bash
curl -i -X GET https://jsonplaceholder.typicode.com/users/1 > GET.mock
```

Running this command, gives you a `GET.mock` file with following content. Modify it according to your requirement and place it in the location `./mocks/users/:userId`, and you have successfully mocked jsonplaceholder API. You can remove or keep

```http
HTTP/1.1 200 OK
date: Sat, 17 Apr 2021 05:21:51 GMT
content-type: application/json; charset=utf-8
content-length: 509

{
  "id": 1,
  "name": "Leanne Graham",
  "username": "Bret",
  "email": "Sincere@april.biz",
  "address": {
    "street": "Kulas Light",
    "suite": "Apt. 556",
    "city": "Gwenborough",
    "zipcode": "92998-3874",
    "geo": {
      "lat": "-37.3159",
      "lng": "81.1496"
    }
  },
  "phone": "1-770-736-8031 x56442",
  "website": "hildegard.org",
  "company": {
    "name": "Romaguera-Crona",
    "catchPhrase": "Multi-layered client-server neural-net",
    "bs": "harness real-time e-markets"
  }
}
```

Another, easier, approach to create mocks is by installing the [REST Client VS Code Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) and using it to fetch the required data for mocks.

- Launch VS Code and install "REST Client" Extension by Huachao Mao or simply open the link above.
- Create a .http file in your project to document your actual http endpoints and make the requests.
- Visit [REST Client github repository](https://github.com/Huachao/vscode-restclient) for more details on usage

> [!CAUTION]
> Camouflage by default looks for the OS specific line breaks. For example, if you are on MacOS or Unix based systems, the default line break/new line is `\n`, whereas on windows it's `\r\n`. This is known to cause issues if your development environment and testing environment are different for Camouflage. For example, if you have created your mock file on a windows machine and uploaded it to a Camouflage server running on linux, your mocks might not work as expected. Or in case your text editor's line break settings do not match your OS default line break, you might not get an expected response.<br/><br/>
> Though Camouflage detects new lines used in the file irrespective of the OS default, you should not face any issues. However, if you face any issues where you are getting a blank response or any unexpected response, please create an issue attaching your log files. REMEMBER TO REMOVE SENSITIVE DATA, IF ANY, FROM YOUR LOGS.

## Request Matching

There are scenarios when you would need to change your response based on some conditions met by fields on request objects. For example, if the end user passes an Authorization header, you'd want to send a 200 OK response if not you'd want to send a 401 Unauthorized response.

To do so you can utilize the beauty of handlebars. Simply provide an if else condition and you are good to go. Let's understand how to do this in the following example:

You expect the user to call the endpoint `/hello` in two ways.

1. By simple making a GET request to `/hello`; Or
2. By adding a query parameter name in the GET request to `/hello`. i.e. `/hello?name=John`

Based on how the user calls the API, you'd want to send different responses. Let's see how we can achieve the desired result.

Start by creating a `GET.mock` file at the location `./mocks/hello`. Paste the following content in the mock file.

```http
{{#if request.query.name}}
HTTP/1.1 200 OK
X-Provided-By: CamouflageHttp
Content-Type: application/json

{
    "greeting": "Hello {{capture from='query' key='name'}}",
    "phone": {{randomValue length=10 type='NUMERIC'}},
    "dateOfBirth": "{{now format='MM/DD/YYYY'}}",
    "test": "{{randomValue}}"
}
{{else}}
HTTP/1.1 200 OK
X-Provided-By: CamouflageHttp
Content-Type: application/json

{
    "greeting": "Hello World",
    "phone": {{randomValue length=10 type='NUMERIC'}},
    "dateOfBirth": "{{now format='MM/DD/YYYY'}}",
    "test": "{{randomValue}}"
}
{{/if}}
```

In the example above, we have provided two responses that Camouflage can pick from, one with `greeting: "Hello World"`, and another with `greeting: "Hello John"`. In the first line of the mock <span v-pre>`{{#if request.query.name}}`</span>, we are checking for the condition, if there exists a query parameter called `name`. And that's it. If your request is made with the query param `name`, Camouflage will respond with first response, if not then the 2nd second response is what you get. And the value of `name` can be anything. We are using `capture` helper to help us make our response dynamic.

> [!NOTE]
> `if` and `unless` helpers are provided by handlebarjs, which don't have comparison capabilities. These helpers only check if the provided value is truthy or falsy. i.e. you can not do something like this: <span v-pre>`{{#if something = something}}`</span>. For comparisons, you'd need to use `is` helper. See [Helpers](/helpers) page for example.

### Request Matching using headers

You can use the approach shown above to perform request matching with query, path params and cookies. Use `request.query.name` or `request.params.name` or `request.cookies.something` as required.

However for headers and body, we need to follow a slightly different approach. In the following example, we are using `capture` helper to capture a specific header value which then can be passed to other helpers like `is` or `if`.

```javascript
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

```javascript
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

## Request Model

Request object made available by Camouflage is simply an instance of express request object for a given incoming request. Following are the properties/objects available on the request object which can be used in request matching or to extract information out of the request.

- request.baseUrl
- request.body
- request.cookies
- request.method
- request.originalUrl
- request.path
- request.protocol
- request.query

Refer to [Express Documentation](https://expressjs.com/en/5x/api.html#req) for more information on each of these properties.

## Response Delays

You can add a Response-Delay header in raw response placed in your .mock file.

For example, if you'd like to simulate a delay of 2 seconds for `GET /hello` endpoint, contents of your `./mocks/hello/GET.mock` file would be as follows:

```http
HTTP/1.1 200 OK
X-Requested-By: Shubhendu Madhukar
Content-Type: application/json
Response-Delay: 2000

{
    "greeting": "Hello World",
    "phone": {{randomValue length=10 type='NUMERIC'}},
    "dateOfBirth": "{{now format='MM/DD/YYYY'}}",
    "test": "{{randomValue}}"
}
```

Additionally you can also simulate a dynamic delay using the {{num_between}} handlebar as follows

```http
Response-Delay: {{num_between lower=500 upper=600}}
```

## Serving Files

If you want to serve a file as a response, maybe an image, or text file, a pdf document, or any type of supported files, use `file` helper to do so. Content-Type header is decided automatically based on the file type. An example is shown below:

```http
HTTP/1.1 200 OK

{{file path="./docs/camouflage.png"}}
```

## Dynamic Responses with Helpers

Mock files can contain **Handlebars templates** to dynamically generate data.

Example:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "{{num_between min=100 max=999}}",
  "name": "{{faker method='name.firstName'}}",
  "timestamp": "{{now format='YYYY-MM-DD HH:mm:ss'}}"
}
```

When requested, it will render unique values every time.

Common built-in helpers:

- `faker` → fake names, emails, etc.
- `now` → current date/time
- `num_between` → random number between min & max
- `random` → pick a random value from a list

Read more on [Helpers](/helpers) page.

## Path Parameters

You can define dynamic routes using {param} syntax.

Example folder:

`mocks/users/{userId}/GET.mock` → `GET /users/123`
The userId path param will be available inside the mock template as `request.params.userId`.
