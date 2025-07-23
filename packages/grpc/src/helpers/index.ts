import Helpers from "@camouflage/helpers"
import { RequestHelper } from "./Capture.js"

export const registerCustomHelpers = (helpers: Helpers) => {
    helpers.addHelper("capture", RequestHelper)
}