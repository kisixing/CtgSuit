import { remote } from 'electron'
const FileStorage = remote.getGlobal('FileStorage')
const constant = remote.getGlobal('constant')

const {
    SETTING_PATH,
    DEFAULT_SETTING_PATH
} = constant

const store = new FileStorage(SETTING_PATH, DEFAULT_SETTING_PATH)

export default store