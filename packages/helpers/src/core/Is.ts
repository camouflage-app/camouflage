import bunyan from "bunyan";
import Handlebars from "handlebars";
/**
 * Registers is helper
 * Extends builtin if helper functionalities
 * Provides support for operators to be used for comparisions
 * @returns {void}
*/
export const is = (log: bunyan) => {
    Handlebars.registerHelper("is", (...args: any[]) => {
        let left: any;
        let right: any;
        let operator: any;
        let context: any;
        switch (args.length) {
            case 2:
                left = args[0];
                context = args[1];
                if (left) {
                    return context.fn(this);
                } else {
                    return context.inverse(this);
                }
            case 3:
                left = args[0];
                right = args[1];
                context = args[2];
                if (left === right) {
                    return context.fn(this);
                } else {
                    return context.inverse(this);
                }
            case 4:
                left = args[0]
                operator = args[1]
                right = args[2]
                context = args[3]
                if (evaluateOperator(log, operator, left, right)) {
                    return context.fn(this);
                } else {
                    return context.inverse(this);
                }
            default:
                log.error("Incorrect number of arguments")
                break;
        }
    });
}
const evaluateOperator = (log: bunyan, operator: string, left: any, right: any | any[]) => {
    switch (operator) {
        case "not":
            return left != right;
        case ">":
            return left > right;
        case "<":
            return left < right;
        case ">=":
            return left >= right;
        case "<=":
            return left <= right;
        case "==":
            return left == right;
        case "===":
            return left === right;
        case "!==":
            return left !== right;
        case "in":
            if (right.constructor !== ([]).constructor) {
                log.error("right hand side value not an array")
                return false
            } else {
                if (right.indexOf(left) > -1) {
                    return true
                } else {
                    return false;
                }
            }
        default:
            return false;
            break;
    }
}