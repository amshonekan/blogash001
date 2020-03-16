/**
 * Express server file
 * 
 * Created by A Shonekan, 16/03/20
 */

import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as controllers from './controllers';

import { Server } from '@overnightjs/core';
import { Logger } from '@overnightjs/logger';

class PlaceholderServer extends Server {
    
    private readonly SERVER_START_MSG = 'Placeholder server starting on port: ';
    private readonly DEV_MSG = 'Express Server is running in development mode. No front-end ' + 'content is being served.';

    constructor() {
        super(true);
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.setupControllers();

        // Point to front-end code
        if (process.env.NODE_ENV !== 'production') {
            this.app.get('*', (req, res) => res.send(this.DEV_MSG));
        } else {
            this.serveFrontEndProd();
        }
    }

    private setupControllers(): void {
        const ctrlInstances = [];
        for (const name in controllers) {
            if (controllers.hasOwnProperty(name)) {
                let Controller = (controllers as any)[name];
                ctrlInstances.push(new Controller());
            }
        }
        super.addControllers(ctrlInstances);
    }

    private serveFrontEndProd(): void {
        const dir = path.join(__dirname, 'public/react/demo-react');

        // Set the static and views directory
        this.app.set('views', dir);
        this.app.use(express.static(dir));

        // Serve front-end content
        this.app.get('*', (req, res) => {
            res.sendFile('index.html', {root: dir});
        });
    }

    public start(port: number): void {
        this.app.listen(port, () => {
            Logger.Imp(this.SERVER_START_MSG + port);
        })
    }

}

export default PlaceholderServer;
