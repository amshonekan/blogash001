/**
 * Start server for development or production,
 * or running tests.
 * 
 * created by A Shonekan, 16/03/20
 */

import { Logger } from '@overnightjs/logger';
import PlaceholderServer from './server';

// Start the server or run tests
if (process.env.NODE_ENV !== 'testing') {
    
    let server = new PlaceholderServer;
    server.start(process.env.NODE_ENV === 'development' ? 3001 : 8081);

} else {
    
    const Mocha = require('mocha');
    const mocha = new Mocha();

    mocha.loadConfig({
        "spec-dir": "src",
        "spec-files": [
            "./controllers/**/*.test.ts"
        ],
        "stopSpecOnExpectationFailure": false,
        "random": true
    });

    mocha.onComplete((passed: boolean) => {
        if (passed) {
            Logger.Info('All tests have passed!');
        } else {
            Logger.Err('At least one test has failed... > __ < : ');
        }
    });

    let testPath = process.argv[3];

    if (testPath) {
        testPath = `./src${testPath}.test.ts`;
        mocha.execute([testPath]);
    } else {
        mocha.execute();
    }

}