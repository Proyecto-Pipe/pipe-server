import * as dotenv from "dotenv";
dotenv.config();

const userCode = process.env.USER_CODE || "0000";

function checkUserCode(code) {
  if (code === userCode) {
    return true;
  } else {
    return false;
  }
}

export { checkUserCode };
