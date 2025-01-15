import { rm } from "fs/promises";
import { join } from "path";

global.beforeEach(async () => {
    try { //we did this because if we tried to remove the file and it doesn't exist we will get an error, so to avoid the error we have an empty catch section
        await rm(join(__dirname, '..', 'test.sqlite')); //join(reference to the test folder that this setup file is in, go up one directory, find test.sqlite file)
    }   catch (err) { //now thanks to this we are deleting our test datebase every single time!

    }
});