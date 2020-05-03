const chromium = require('chrome-aws-lambda')
const puppeteer = require('puppeteer-core')

const fs = require('fs')
const delay = time => {
  return new Promise(function(resolve) {
    setTimeout(resolve, time)
  })
}
module.exports = async (req, res) => {
  if (!req.query.isin) return res.end('Missing isin')
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
      await page.goto('https://www.boursorama.com/cours/1rPGLO/')
      await page.waitFor(500)
      await page.goto('https://www.boursorama.com/bourse/action/graph/ws/download?length=3650&period=0&symbol=1rPGLO', { waitUntil: 'load' })
      browser.close()
    })
    .catch(async error => {
      //HACK Error when download but file is download on FS.
      await delay(500)
      const file = fs.readdirSync('/tmp/price/')
      const content = fs.readFileSync('/tmp/price/' + file[0])
      return res.end(content.toString('utf8'))
    })
}
