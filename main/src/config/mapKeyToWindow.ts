import { isDev } from "../utils/is";
import { publicPath } from "./path";
import { resolve } from "path";

export const mapKeyToWindow = {
    remote: ['远程', isDev ? 'http://localhost:3000/remote/index.html' : ''],
    help: ['操作手册', isDev ? 'http://127.0.0.1:1702/handbook/index.html' : resolve(publicPath, 'render/handbook/index.html')]
}