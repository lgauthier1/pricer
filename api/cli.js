const isin = process.argv[2]
require('./scraper_bourso.js')

const cli = async () => {
  if (!isin) return 'missing mandatory parameter'
  return await get_price(isin)
}

cli().then(console.log)
