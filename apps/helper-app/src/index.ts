import Helpers from "@camouflage/helpers";
const helpers = new Helpers();

const arrayAndAssign = helpers.parse(`
    {{~assign name='fruits' value=(array source=(concat 'Apple' 'Kiwi' 'Oranges' delimiter='-') delimiter='-')~}}
    {{~#each fruits as |fruit|~}}
        {{~#if @last~}}
            {{fruit}}
        {{~else~}}
            {{fruit}}-
        {{~/if~}}
    {{~/each~}}`)
console.log(arrayAndAssign)

const concat = helpers.parse(`{{concat 'Camouflage ' 'is ' 'easy!!'}} {{concat '1' '22' '333' delimiter='-'}}`)
console.log(concat)

const todaysDate = helpers.parse("{{now format='yyyy-MM-dd'}}");
console.log(todaysDate)

const faker = helpers.parse(`
{{faker method="internet.email"}}
{{faker method="person.firstName"}}
{{faker method="number.int" min=10 max=50}}
{{faker method="location.city"}}
`)
console.log(faker)

const repeat = helpers.parse(`[
    {{~#repeat 3~}}
        {{~#if @last~}}
            { "id": "{{random}}", "name": "{{faker method="person.firstName"}}" }
        {{~else~}}
            { "id": "{{random}}", "name": "{{faker method="person.firstName" sex="female"}}" },
        {{~/if~}}
    {{~/repeat~}}
]`)
console.log(repeat)