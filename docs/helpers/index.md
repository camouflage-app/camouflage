---
layout: doc
aside: false
---

# Helpers - What are Helpers?

Camouflage uses Handlebars to help you generate dynamic responses if needed. Read more about Handlebars [here](https://handlebarsjs.com/guide/).

You can use all the helpers provided by Handlebars itself, for example, `if`, `unless`, `each`, and `with`. Camouflage also provides some additional helpers to make repetitive tasks easier.

## `array`

**Usage:**
**<span v-pre>{{array source='Apple,Banana,Mango,Kiwi' delimiter=','}}</span>**: Generates an array from a source using the given delimiter.

**Parameters:**

| Parameter   | Required |
| :---------- | :------- |
| `source`    | Yes      |
| `delimiter` | No       |

## `assign`

**Usage:**

The `assign` helper can be used to assign a value to a variable by specifying a name–value pair. This is especially useful when using the `capture` helper with regex and JSONPath selectors. Since running a regex or JSONPath operation is an expensive task, the `assign` helper can capture a value once, store it in a variable, and use it throughout the mock file. Aesthetically, it also improves readability of the mock file, which might otherwise contain long, illegible regular expressions repeated throughout.

The following example shows the usage of a complex combination of helpers: `assign`, `array`, `concat`, and `code`.

```hbs
{{assign name="fruits" value=(array source=(concat "Apple" "Kiwi" "Oranges" delimiter="-") delimiter="-")}}
{{#each fruits as |fruit|}}{{#if @last}}{{fruit}}{{else}}{{fruit}}-{{/if}}{{/each}}
```

**Explanation:**

- `concat`: We are using `concat` to make a hyphenated string out of 3 separate string values.
- `array`: Then we are making an array by splitting the hyphenated string using the hyphen delimiter—because why not?
- `assign`: Next, we assign this monstrous redundancy to a variable `fruits`.
- `each`: We then use the `each` helper to loop over the `fruits` array.
- `if`: Finally, we use the `if` helper to make a big, beautiful string. We concatenate the `fruits` with a hyphen (if the current fruit is not the last item in the array).

_Phew, that was quite a journey. We started with 'Apple-Kiwi-Oranges' and we ended with 'Apple-Kiwi-Oranges'... wait a minute!_

**Parameters:**

| Parameter | Required |
| :-------- | :------- |
| `name`    | Yes      |
| `value`   | Yes      |

## `concat`

**Usage:**

Concatenates multiple strings together (static or dynamic) to form a single string.

**Example:**

- <span v-pre>`{{concat 'Camouflage ' 'is ' 'easy!!'}}`</span> results in `Camouflage is easy`.
- You can also pass in a delimiter, i.e., <span v-pre>`{{concat '1' '22' '333' delimiter='-'}}`</span> will result in `1-22-333`.

**Parameters:**

| Parameter                            | Required |
| :----------------------------------- | :------- |
| A list of strings separated by space | Yes      |
| `delimiter`                          | No       |

## `csv`

**Usage:**

The `csv` helper allows you to provide a data source as input along with several combinations of selection policies.

- **With a key and value**: Specify the column name with `key` and the value you want to search with `value`. The CSV helper returns the first row of the CSV file where the value matches the row value in the specified column.
- **Random**: Omitting `key` and `value` altogether and specifying `random=true` will fetch one row at random.
- **All**: Specifying `all=true` fetches the entire CSV file—do what you will with the data.

**Examples:**

- <span v-pre>`{{csv src="./data.csv" key="city" value="Worcester"}}`</span>
- <span v-pre>`{{csv src="./data.csv" random=true}}`</span>
- <span v-pre>`{{csv src="./data.csv" all=true}}`</span>

**Parameters:**

| Parameter   | Required                          |
| :---------- | :-------------------------------- |
| `src`       | Yes                               |
| `delimiter` | No                                |
| `random`    | No                                |
| `all`       | No                                |
| `key`       | No (required when `random=false`) |
| `value`     | No (required when `random=false`) |

> [!TIP]
> All combinations of the policies return a JSON array.

## `faker`

The `faker` helper allows you to generate a host of dynamic random values based on the [Faker API](https://fakerjs.dev/api/).

**Usage:**

- <span v-pre>**{{faker method="internet.email"}}**</span>: Generates an email address.
- <span v-pre>**{{faker method="person.firstName"}}**</span>: Generates a random first name.
- <span v-pre>**{{faker method="number.int" min=10 max=50}}**</span>: Returns a single random integer between zero and the given max value or within the given range. The bounds are inclusive.
- <span v-pre>**{{faker method="location.city"}}**</span>: Generates a random localized city name.

**Parameters:**

| Parameter                              | Required |
| :------------------------------------- | :------- |
| `method`                               | Yes      |
| Other options as required by Faker API | No       |

## `import`

**Usage:**

The `import` helper lets you store your reusable templates in shared files, which can then be imported into other files.

**Example:**

You can create a Camouflage mock file that contains the response for the request `GET /hello/world`:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "now": "{{import path="/User/john.doe/uselessButReusableNow.mock"}}"
}
```

Here, you are importing the file `uselessButReusableNow.mock`. The Camouflage helper will replace the import with the contents of the imported file.

You can create the reusable file as:

```hbs
{{now format="yyyy-MM-dd"}}
```

This may seem trivial and of little use, but think bigger. Your mock file may contain not just one but several responses, and you may select one of them based on certain conditions. By breaking down your mocks into several files and importing them as needed, you make them easier to maintain.

Parameters:

| parameter | required |
| :-------- | :------- |
| `path`    | yes      |

## `inject`

**Time for the forbidden fruit! The security vulnerability. Everything you have been taught not to do.**

The `inject` helper allows you to replace hard-coded values in your mock files with JavaScript code. This is useful when you still want to use Camouflage's response builder but need control over one or two fields.

**Example:**

```json
{
    "phone": {{#inject}}(()=>{ return Math.floor(1000000000 + Math.random() * 9000000000); })();{{/inject}}
}
```

This translates to a random 10-digit number. Is it a phone number? Is it not? Who knows!

> [!CAUTION]
> The `inject` helper is not enabled by default. If you want to use the `inject` helper, you must enable it when creating the helper object.
>
> ```js
> const helpers = camouflageHttp.getHelpers();
> // const helpers = camouflageGrpc.getHelpers();
> helpers.setInjectionAllowed(true);
> ```

## `is`

Credits: [danharper/Handlebars-Helpers](https://github.com/danharper/Handlebars-Helpers)

Usage: The `is` helper can be considered as an extension of `if`, allowing you to evaluate conditions that are not supported by the inbuilt `if` helper.

The `is` helper can be used in the following three ways:

- **With one argument**: `is` acts exactly like `if`.

  ```hbs
  {{#is x}} ... {{else}} ... {{/is}}
  ```

- **With two arguments**: `is` compares the two provided values for equality (a non-strict, `==` comparison, so `5 == '5'` evaluates to true).

  ```hbs
  {{#is x y}} ... {{else}} ... {{/is}}
  ```

- **With three arguments**: the second argument acts as the comparator.

  ```hbs
  {{#is x "not" y}} ... {{else}} ... {{/is}}
  {{#is 5 ">=" 2}} ... {{else}} ... {{/is}}
  ```

Accepted operators are:

- `==` (same as not providing a comparator)
- `!=`
- `not` (alias for `!=`)
- `===`
- `!==`
- `>`
- `>=`
- `<`
- `<=`
- `in` (to check if a value exists in an array)

## `now`

You can use the `now` helper to generate the current date/time (or a date/time with a specific offset) in a desired format.

Usage:

- <span v-pre>**{{now}}**</span> - Simply using now will give you the date in the format YYYY-MM-DD hh:mm:ss
- <span v-pre>**{{now format='MM/DD/YYYY'}}**</span> - Format not to your liking? We use Luxon to handle date/time; you can provide any format supported by Luxon. Read more [here](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).
- <span v-pre>**{{now format='epoch'}}**</span> - Time since epoch in milliseconds
- <span v-pre>**{{now format='unix'}}**</span> - Time since epoch in seconds
- <span v-pre>**{{now format='MM/DD/YYYY hh:mm:ss' offset='-10 days'}}**</span> - Use offset to specify the delta for your desired date from the current date.

Parameters:

| parameter | required |
| :-------- | :------- |
| `format`  | no       |
| `offset`  | no       |

## `num_between`

Usage:

- <span v-pre>**{{num_between lower=500 upper=600}}**</span>: Generates a random number between two values.
- <span v-pre>**{{num_between lower=500 upper=600 lognormal=true}}**</span>: Generates random numbers on a bell curve centered between two values.

| parameter   | required |
| :---------- | :------- |
| `lower`     | yes      |
| `upper`     | yes      |
| `lognormal` | no       |

## `random`

Usage:

- <span v-pre>**{{random}}**</span> - Simply using random will generate a 16-character alphanumeric string, e.g., 9ZeBvHW5viiYuWRa.
- <span v-pre>**{{random type='ALPHANUMERIC'}}**</span> - You can specify a type as well. Your choices are: 'ALPHANUMERIC', 'ALPHABETIC', 'NUMERIC', and 'UUID'.
- <span v-pre>**{{random type='NUMERIC' length=10}}**</span> - Don’t want a 16-character output? Use length to specify the length.
- <span v-pre>**{{random type='ALPHABETIC' uppercase=true}}**</span> - Finally, specify uppercase as true to get an uppercase string.

| parameter   | required |
| :---------- | :------- |
| `type`      | no       |
| `length`    | no       |
| `uppercase` | no       |

## `repeat`

The `repeat` helper allows you to create a loop with a specified count. You can pass a fixed integer, or if you want to loop over an array you can pass in the `array.length` variable. (The latter can be done more simply with the built-in [`each` helper](https://handlebarsjs.com/guide/builtin-helpers.html#each).)

Usage:

```hbs
{{#repeat N}}
  ...content...
{{/repeat}}
```

- **N**: Number of times the block will be repeated.
- Within the block, the helper automatically provides metadata:
  - **@index** → Current iteration index (0-based)
  - **@first** → Boolean, true if it’s the first iteration
  - **@last** → Boolean, true if it’s the last iteration

Example:

```hbs
[
{{~#repeat 3~}}
  {{~#if @last~}}
    { "id": "{{random}}-{{@index}}", "name": "{{faker method="person.firstName"}}" }
  {{~else~}}
    { "id": "{{random}}-{{@index}}", "name": "{{faker method="person.firstName" sex="female"}}" },
  {{~/if~}}
{{~/repeat~}}
]
<!-- Output [
  { "id": "sY6noRN1PWftcjJC-0", "name": "Samantha" },
  { "id": "cflA2vjd7bLG7h4C-1", "name": "Gina" },
  { "id": "M5PXiJLaYWoV0XA3-2", "name": "Cyrus" }
] -->
```
