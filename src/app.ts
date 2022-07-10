import express, { json } from 'express'
import client from './client'
import { getRoot, postAlerts } from './routes'

// Config
require('dotenv').config()

// App
const app = express()
app.use(json({ limit: 1048576 })) // 1MiB
// Routes
app.get('/', getRoot)
app.post('/alerts', postAlerts)

// Initialize Matrix client
client.init().then(() => {
    // eslint-disable-next-line no-console
    console.log('matrix-alertmanager initialized and ready')
    app.listen(process.env.APP_PORT, () => { })
}).catch(e => {
    // eslint-disable-next-line no-console
    console.error('initialization failed')
    // eslint-disable-next-line no-console
    console.error(e)
})

export default app
