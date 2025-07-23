import Helpers from "@camouflage/helpers";
import { createLogger } from "@camouflage/logger";
const log = createLogger("build", "info")
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
log.info(arrayAndAssign)

const concat = helpers.parse(`{{concat 'Camouflage ' 'is ' 'easy!!'}} {{concat '1' '22' '333' delimiter='-'}}`)
log.info(concat)

const todaysDate = helpers.parse("{{now format='yyyy-MM-dd'}}");
log.info(todaysDate)

const faker = helpers.parse(`
{{faker method="internet.email"}}
{{faker method="person.firstName"}}
{{faker method="number.int" min=10 max=50}}
{{faker method="location.city"}}
`)
log.info(faker)