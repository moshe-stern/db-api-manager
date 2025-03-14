import express from 'express'
import twilio from './routes/twilio'
import providers from './routes/providers'
import dotenv from 'dotenv'
import client from './routes/client'
import cubeStatus from './routes/cube-status'
import cors from 'cors'
import { errorHandler, auth } from './helpers'
const result = dotenv.config()
if (result.error) {
     console.error('Error loading .env file:', result.error)
}
const app = express()
const PORT = process.env.PORT ? process.env.PORT : 8080

app.use(cors())
app.use(express.json())
app.use('/cube-status', cubeStatus)
app.use(auth)
app.use('/twilio', twilio)
app.use('/providers', providers)
app.use('/client', client)
app.use(errorHandler)

app.listen(PORT, () => console.log(`app started on port ${PORT}`))
