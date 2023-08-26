const express = require('express')
const cors = require('cors')
const app = express()

const PORT =  parseInt(process.env['PORT'] ?? '8000')

app.use(cors())
app.use(express.json())


app.get('/hi'  ,(req, res, next) =>{
  res.json({msg: 'hi mom!'})
})

app.listen(PORT, function () {
  console.log(`web server listening on port ${PORT}`)
})
