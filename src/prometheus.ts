import express from 'express'
import { Registry, Counter, collectDefaultMetrics } from 'prom-client'

class Metrics {

    private register: Registry

    public alertsCounter: Counter<string>
    public sendErrorCounter: Counter<string>

    constructor() {
        this.register = new Registry()
        collectDefaultMetrics({ register: this.register, prefix: "amf_" })

        this.alertsCounter = new Counter({
            name: 'amf_alerts_counter',
            help: 'Number of alerts',
            registers: [this.register],
        })
        this.sendErrorCounter = new Counter({
            name: 'amf_error_send_counter',
            help: 'Number of error send messasge to matrix room',
            registers: [this.register],
        })
    }

    controller() {
        return async (_req: express.Request, res: express.Response) => {
            res.setHeader('Content-Type', this.register.contentType)
            res.end(await this.register.metrics())
        }
    }
}

const metrics = new Metrics()
export default metrics

