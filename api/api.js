import './scraper_bourso.js'

module.exports = async (req, res) => {
  console.log(req.query.isin)
  if(req.query.isin) res.end(JSON.stringify(await get_price(req.query.isin)))
  res.end('url must contains ?isin=XXXXXXXXXXXX (with X is an isin)')
}
