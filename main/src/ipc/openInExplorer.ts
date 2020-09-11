
import { resolve } from "path";
import { spawnSync } from "child_process";

export default (event, path = '') => {
    const absPath = resolve(path)
    spawnSync('explorer',[absPath])
}





