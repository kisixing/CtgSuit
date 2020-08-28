
import { appLogger } from "../utils/log";

export default (event, msg, ...args) => {
    args = args ? args : []
    args = args.map(_ => typeof _ === 'string' ? _.replace(/\\n/g, '\n') : '')
    const fn: Function = appLogger[msg]
    if (fn) {
        try {
            fn.apply(appLogger, args)
        } catch (error) {
            appLogger.error('ipc catch call error', error)
        }

    }
}





