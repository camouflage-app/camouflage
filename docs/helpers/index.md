---
layout: doc
aside: false
---

# Helpers - What are Helpers?

Camouflage uses handlebars to help you generate dynamic responses if needed. Read more about handlebars [here](https://handlebarsjs.com/guide/).

You can use all the helpers provided by handlebars itself, for example, `if`, `unless`, `each`, and `with`. Camouflage also provides some additional helpers to make some repetitive tasks easy.

## `array`

Usage:
**<span v-pre>{{array source='Apple,Banana,Mango,Kiwi' delimiter=','}}</span>**: Generate an array from a source using given delimiter.

Parameters:

| parameter   | required |
| :---------- | :------- |
| `source`    | yes      |
| `delimiter` | no       |

## `assign`

Usage: Assign helper can be used to assign a value to a variable, by specifying a name value pair. This can be useful specially when using capture helper using regex and jsonpath selectors. Since running a regex or jsonpath operation is an expensive task, assign helper can be used to capture a value once, store it in a variable and use throughout the mock file. Aesthetically, it also improves readability of the mock file which otherwise would contain long illegible regular expressions repeated throughout the mock file.

Following example shows the usage of a complex combination of helpers, i.e. assign, array, concat, and code.

```hbs
{{assign name="fruits" value=(array source=(concat "Apple" "Kiwi" "Oranges" delimiter="-") delimiter="-")}}
{{#each fruits as |fruit|}}{{#if @last}}{{fruit}}{{else}}{{fruit}}-{{/if}}{{/each}}
```

Explanation:

- `concat`: We are using `concat` to make a hyphenated string out of 3 seperate string values.
- `array`: Then we are making an array by splitting the hyphenated string using the hyphen delimiter. Because why not?
- `assign`: Next, we assign this monstrous redundancy to a variable `fruits`
- `each`: Next use the helper `each` to loop over the `fruits` array.
- `if`: Finally, we use `if` helper, to make a big beautiful string. We concatenate the `fruits` with a hyphen (if the current fruit is not the last item in the array).

_Phew, that was quite a journey. We started with 'Apple-Kiwi-Oranges' and we ended it with 'Apple-Kiwi-Oranges'....wait a minute!_

Parameters:

| parameter | required |
| :-------- | :------- |
| `name`    | yes      |
| `value`   | yes      |

## `concat`

Usage: Concatenates multiple strings together, (static or dynamic), to form a single string.

Example:

- <span v-pre>`{{concat 'Camouflage ' 'is ' 'easy!!'}}`</span> results in `Camouflage is easy`.
- You can also pass in a delimiter, i.e. <span v-pre>`{{concat '1' '22' '333' delimiter='-'}}`</span> will result in 1-22-333

Parameters:

| parameter                           | required |
| :---------------------------------- | :------- |
| A list of string separated by space | yes      |
| `delimiter`                         | no       |

## `csv`

Usage: CSV Helper allows you to provide a data source as an input along with several combinations of selection policies

- **With a key and value**: Specify the column name with key and the value you want to search with value. CSV helper returns the first row of the csv file where the value matches the row value in the specified column.
- **Random**: Omitting key and value altogether and specifying random=true will fetch you one row at random.
- **All**: Specifying all=true, fetches you the entire CSV file, do what you will with the data.

Examples:

- <span v-pre>`{{csv src="./data.csv" key="city" value="Worcester"}}`</span>
- <span v-pre>`{{csv src="./data.csv" random=true}}`</span>
- <span v-pre>`{{csv src="./data.csv" all=true}}`</span>

Parameters:

| parameter   | required                        |
| :---------- | :------------------------------ |
| `src`       | yes                             |
| `delimiter` | no                              |
| `random`    | no                              |
| `all`       | no                              |
| `key`       | no (required when random=false) |
| `value`     | no (required when random=false) |

> [!TIP]
> All combinations of the policies return a JSON Array.

## `faker`

`faker` helpers allows you to generate a host of dynamic random values based on the [faker API](https://fakerjs.dev/api/)

Usage:

- <span v-pre>**{{faker method="internet.email"}}**</span>: Generates an email address.
- <span v-pre>**{{faker method="person.firstName"}}**</span>: Generated a random first name.
- <span v-pre>**{{faker method="number.int" min=10 max=50}}**</span>: Returns a single random integer between zero and the given max value or the given range. The bounds are inclusive.
- <span v-pre>**{{faker method="location.city"}}**</span>: Generates a random localized city name.

Parameters:

| parameter                              | required |
| :------------------------------------- | :------- |
| `method`                               | yes      |
| Other options as required by Faker API | no       |

## `import`

Usage: Import helpers lets you store your reusable templates in shared files, which can then be imported into other files.

Example:

You can create a Camouflage mock file which would contain the response for the request `GET /hello/world`

```http
HTTP/1.1 200 OK
Content-Type: application/json

{
    "now": "{{import path="/User/john.doe/uselessButReusableNow.mock"}}"
}
```

Here you are importing the file `uselessButResuableNow.mock`, Camouflage helper will replace the import with the contents of your imported file. You can create the reusable file as

```hbs
{{now format="yyyy-MM-dd"}}
```

This seems trivial and of no use but think bigger. Your mock file may contain not just one but several responses and you select one of them based on a certain condition. You can break down your mocks into several files and import them as needed, making it easier to maintain.

Parameters:

| parameter | required |
| :-------- | :------- |
| `path`    | yes      |

## `inject`

**Time for the forbidden fruit! The security vulnerability. Everything you have been taught not to do.**

Inject helper allows you replace the hard coded values in your mock files with a javascript code, when you still want to use Camouflage's response builder but you want control over one or two fields.

Example:

```json
{
    "phone": {{#inject}}(()=>{ return Math.floor(1000000000 + Math.random() * 9000000000); })();{{/inject}}
}
```

This translates to a random 10 digit number. Is it a phone number? Is it not? Who knows!

> [!CAUTION]
> `inject` helper is not enabled by default. If you want to use inject helper, you'd have to enable it when you are creating the helper object.
>
> ```js
> const helpers = camouflageHttp.getHelpers();
> // const helpers = camouflageGrpc.getHelpers();
> helpers.setInjectionAllowed(true);
> ```

## `is`

Credits: [danharper/Handlebars-Helpers](https://github.com/danharper/Handlebars-Helpers)

Usage: `is` helper can be considered as an extension of if which allows you to evaluate conditions that are lacking in inbuilt helper.

`is` can be used in following three ways:

- With one argument: `is` acts exactly like `if`

  ```hbs
  {{#is x}} ... {{else}} ... {{/is}}
  ```

- With two arguments: `is` compares the two provided value are equal (a non-strict, == comparison, so 5 == '5' is true)

  ```hbs
  {{#is x y}} ... {{else}} ... {{/is}}
  ```

- With three arguments: the second argument becomes the comparator.

  ```hbs
  {{#is x "not" y}} ... {{else}} ... {{/is}}
  {{#is 5 ">=" 2}} ... {{else}} ... {{/is}}
  ```

Accepted operators are:

```
- == (same as not providing a comparator)
- !=
- not (alias for !=)
- ===
- !==
- >
- >=
- <
- <=
- in (to check if a value exists in an array. ex: {{#is 'John' in (capture from='body' using='jsonpath' selector='$.names')}})
```

## `now`

You can use the `now` helper to generate current date/time (or a date/time with specific offset) in a desired format.

Usage:

- <span v-pre>**{{now}}**</span> - Simply using now will give you date in format YYYY-MM-DD hh:mm:ss
- <span v-pre>**{{now format='MM/DD/YYYY'}}**</span> - Format not to your liking? We use luxon to handle date/time, you can provide any format that's supported by luxon. Read more [here](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).
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

- <span v-pre>**{{num_between lower=500 upper=600}}**</span>: Generate a random number between two values.
- <span v-pre>**{{num_between lower=500 upper=600 lognormal=true}}**</span>: Generate random numbers on a bell curve centered between two values.

| parameter   | required |
| :---------- | :------- |
| `lower`     | yes      |
| `upper`     | yes      |
| `lognormal` | no       |

## `random`

Usage

- <span v-pre>**{{random}}**</span> - Simply using randomValue will generate a 16 character alphanumeric string. ex: 9ZeBvHW5viiYuWRa.
- <span v-pre>**{{random type='ALPHANUMERIC'}}**</span> - You can specify a type as well. Your choices are: 'ALPHANUMERIC', 'ALPHABETIC', 'NUMERIC' and 'UUID'.
- <span v-pre>**{{random type='NUMERIC' length=10}}**</span> - Don't want a 16 character output? Use length to specify the length.
- <span v-pre>**{{random type='ALPHABETIC' uppercase=true}}**</span> - Finally, specify uppercase as true to get a uppercase string.

| parameter   | required |
| :---------- | :------- |
| `type`      | no       |
| `length`    | no       |
| `uppercase` | no       |

## `repeat`

`repeat` helper allows you to create loop with specified counts. You can pass a fixed integer or if you'd want to loop over an array you can pass in the array.length variable (latter can be simply done by the inbuilt (`each` helper)[https://handlebarsjs.com/guide/builtin-helpers.html#each] )

Usage:

```hbs
{{#repeat N}}
  ...content...
{{/repeat}}
```

- **N**: Number of times the block will be repeated.
- Within the block, helper automatically provides metadata as:
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
