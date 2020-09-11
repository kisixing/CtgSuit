
import { spawn } from "child_process";
export default (event,) => {
    spawn('shutdown',['/s','/t','1'])
}





