/**
 * Unit-tests for the PlaceholderController
 *
 * created by A Shonekan, 16/03/20
 */

import * as supertest from 'supertest';

import {} from 'mocha';
import { OK, BAD_REQUEST } from 'http-status-codes';
import { SuperTest, Test } from 'supertest';
import { Logger } from '@overnightjs/logger';

import TestServer from '../shared/TestServer.test';
import PlaceholderController from './PlaceholderController';


describe('PlaceholderController', () => {

    const PlaceholderController = new PlaceholderController();
    let agent: SuperTest<Test>;


    beforeAll(done => {
        const server = new TestServer();
        server.setController(PlaceholderController);
        agent = supertest.agent(server.getExpressInstance());
        done();
    });


    describe('API: "/api/say-hello/:name"', () => {

        const { SUCCESS_MSG } = PlaceholderController;
        const name = 'ashonekan';
        const message = SUCCESS_MSG + name;

        it(`should return a JSON object with the message "${message}" and a status code
            of "${OK}" if message was successful`, done => {

            agent.get('/api/say-hello/' + name)
                .end((err, res) => {
                    if (err) {
                        Logger.Err(err, true);
                    }
                    
                    expect(res.status).toBe(OK);
                    expect(res.body.message).toBe(message);
                    done();
                });
        });

        it(`should return a JSON object with the "error" param and a status code of "${BAD_REQUEST}"
            if message was unsuccessful`, done => {

            agent.get('/api/say-hello/make_it_fail')
                .end((err, res) => {
                    if (err) {
                        Logger.Err(err, true);
                    }
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBeTruthy();
                    done();
                });
        });
    });
});