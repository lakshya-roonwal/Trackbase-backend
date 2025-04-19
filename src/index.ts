import app from './app'
const port = process.env.PORT || 8080
import http from 'http'

const server = http.createServer(app)

server.listen(port, () => {
    console.log(`✅ Server is up and running at ${port}`)
})
