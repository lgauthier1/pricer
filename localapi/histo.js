const express = require('express')
const puppeteer = require('puppeteer')
const firebase = require('firebase-admin')
const fs = require('fs')

const app = express()

const serviceAccount = require('../api/pricer.json')
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://pricer-c75a5.firebaseio.com',
})
const database = firebase.database()
const get = async key => {return await database.ref(key).once('value').then(snapshot => {
      return snapshot.val()
    })
}

get_symbol = async isin => {
  return await get('public/referentiel/' + isin)
}

const delay = time => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}
app.get('/histo', async (req, res) => {
  if (!req.query.isin) return res.end('Missing isin')
  const info = await get_symbol(req.query.isin)
  const url = info.url
  const symbol = info.url.split('/').slice(-1)[0]
  console.log(url)
  console.log(symbol)
  puppeteer
    .launch({
      defaultViewport: { width: 1440, height: 800, deviceScaleFactor: 2 },
    })
    .then(async browser => {
      const page = await browser.newPage()
      await page.setViewport({ width: 1200, height: 800 })
      await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: './price/',
      })
      console.log('https://www.boursorama.com/' + url)
      await page.goto('https://www.boursorama.com/' + url)
      await page.waitFor(500)
      console.log('https://www.boursorama.com/bourse/action/graph/ws/download?length=3650&period=0&symbol=' + symbol)
      await page.goto('https://www.boursorama.com/bourse/action/graph/ws/download?length=3650&period=0&symbol=' + symbol, { waitUntil: 'load' })
      browser.close()
    })
    .catch(async error => {
      //HACK Error when download but file is download on FS.
      await delay(500)
      const file = fs.readdirSync('./price/')
      const content = fs.readFileSync('./price/' + file[0], 'utf8')
      if(file) fs.unlinkSync('./price/' + file[0])
      const price = arr => {return {'isin': req.query.isin ,'date': arr[0],'ouv': arr[1], 'haut': arr[2],'bas': arr[3],'clot': arr[4],'vol': arr[5]} }
      const result = content.split('\n').slice(1).map(line => price(line.split('\t')))
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify(result))
    })
})

const port = 11001

app.listen(port)
console.log('Running on port: ' + port)
