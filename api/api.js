import './scraper_bourso.js'

module.exports = async (req, res) => {
  if (!req.query.isin) res.end('url must contains ?isin=XXXXXXXXXXXX (with X is an isin)')
   res.end(JSON.stringify(await get_price(req.query.isin)))
}
