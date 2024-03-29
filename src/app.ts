import express from 'express'
import client from './client'
import router from './routes'

const app = express()
app.use(express.json({ limit: 1048576 }))

//routers
app.use('/', router)


client
    .login()
    .then(async () => {
        await client.joinAllRooms()
        // eslint-disable-next-line no-console
        console.log('alertmanager-matrix-forwarder initialized and ready')
        app.listen(process.env.APP_PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Server listening on ${process.env.APP_PORT} port`)
        })
    })
    .catch(e => {
        // eslint-disable-next-line no-console
        console.error('initialization failed')
        // eslint-disable-next-line no-console
        console.error(e)
        process.exit(1)
    })

export default app
