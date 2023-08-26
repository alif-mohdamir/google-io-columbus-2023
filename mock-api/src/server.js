const express = require('express')
const cors = require('cors')
const { faker } = require('@faker-js/faker')
const app = express()


const PORT = parseInt(process.env['PORT'] ?? '8000')

app.use(cors())
app.use(express.json())



app.get("/items", async (_, res) => {
    const ingredients = new Array(6).map(() => { ingredientName: faker.word.noun() })


    await new Promise((res) => setTimeout(res, 3000))


    res.json({ ingredients })

})

app.get('/hi', (_, res) => {
    res.json({ msg: 'hi mom!' })
})

app.listen(PORT, function () {
    console.log(`web server listening on port ${PORT}`)
})
