import { RequestHelper } from "./Capture.js"
import { FileHelper } from "./File.js"
import { StateHelper } from "./State.js"
import Helpers from '@camouflage/helpers'

export const registerCustomHelpers = (helpers: Helpers) => {
    helpers.addHelper("capture", RequestHelper)
    helpers.addHelper("file", FileHelper)
    helpers.addHelper("state", StateHelper)
}