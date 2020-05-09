const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')
const fs = require('fs')
const firebase = require('firebase-admin')

const serviceAccount = require('./pricer.json')
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
module.exports = async (req, res) => {
  if (!req.query.isin) return res.end('Missing isin')
  const info = await get_symbol(req.query.isin)
  const url = info.url
  const symbol = info.url.split('/')[1]
  puppeteer
    .launch({
      args: chromium.args,
      executablePath: await chromium.executablePath,
      defaultViewport: { width: 1440, height: 800, deviceScaleFactor: 2 },
    })
    .then(async browser => {
      const page = await browser.newPage()
      await page.setViewport({ width: 1200, height: 800 })
      await page._client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: '/tmp/price/',
      })
      await page.goto('https://www.boursorama.com/' + url)
      await page.waitFor(500)
      await page.goto('https://www.boursorama.com/bourse/action/graph/ws/download?length=3650&period=0&symbol=' + symbol, { waitUntil: 'load' })
      browser.close()
    })
    .catch(async error => {
      //HACK Error when download but file is download on FS.
      await delay(500)
      const file = fs.readdirSync('/tmp/price/')
      const content = fs.readFileSync('/tmp/price/' + file[0], 'utf8')
      if(file) fs.unlinkSync('/tmp/price/' + file[0])
      const price = arr => {return {'isin': req.query.isin ,'date': arr[0],'ouv': arr[1], 'haut': arr[2],'bas': arr[3],'clot': arr[4],'vol': arr[5]} }
      const result = content.split('\n').slice(1).map(line => price(line.split('\t')))
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify(result))
    })
}
