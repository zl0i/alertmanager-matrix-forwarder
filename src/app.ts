import express from 'express'
import client from './client'
import router from './routes'

require('dotenv').config()


const app = express()
app.use(express.json({ limit: 1048576 }))

//routers
app.use('/', router)


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
