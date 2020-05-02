const fs = require('fs')
const fetch = require('node-fetch')

require('./raw.js')
Object.extend(true)

const markets = {
  'cac40': {
    'url': 'https://www.boursorama.com/bourse/actions/cotations/',
    'max_page': 12,
    'pattern1': new RegExp(/href="\/cours\/.*\/"[\s]{2,}title=.*/, "g"),
    'pattern2': new RegExp(/href="\/cours\/.*\/"[\s]/, "g"),
  },
  'etf': {
    'url': 'https://www.boursorama.com/bourse/trackers/palmares/',
    'max_page': 40,
    'pattern1': new RegExp(/href=".*\/cours\/.*\/"[\s]{2,}title=.*/, "g"), // A regrouper avec autre
    'pattern2': new RegExp(/href=".*\/cours\/.*\/"[\s]/, "g"),
  }
}

const parse_fiche_valeur = async (url) => {
  try{
    const fiche_valeur = await (await fetch('https://www.boursorama.com/' + url, {redirect: 'follow'})).text()
    const isin = fiche_valeur.match(/c-faceplate__isin">[A-Z0-9]{12}/g)[0].split('>')[1]
    const price = fiche_valeur.replace(/\n|\r/g, '').match(/<span class="c-instrument c-instrument--last" data-ist-last>.*?</)[0].match(/[0-9]*\.[0-9]*/)[0]
    return { url, isin, price }
  }
  catch(e){
    return { url, isin:'error', price:'error'}
  }
}

module.export = get_symbols = async (market) => {
  const { url, max_page, pattern1, pattern2 } = markets[market]
  const raw_urls = await Promise.all([...Array(max_page).keys()].map( async (page) => {
    const content = await (await fetch(url + 'page-' + page)).text()
    return content.match(pattern1).unique().filter(d => !d.includes("Cours "))
  }))

  const symbols = await Promise.all(raw_urls.flat().unique().map(async d => {
    try{
      const url = d.match(pattern2)[0].replace('href="/','').replace('/"\n','')
      const label = d.match(/title=".*"/g)[0].replace('title="', '').replace('"','')
      const fiche_valeur =  await parse_fiche_valeur(url)
      return  {...fiche_valeur, label}
    }catch(e){
      console.log(e)
    }
  }))

  fs.writeFileSync(['.symbols', market].join('_'), JSON.stringify(symbols), function(err) {
    if (err) console.log(err)
})
  return symbols
}

module.export = get_symbol = async (isin) => {
    if (!fs.existsSync('.symbols_cac40')) await get_symbols('cac40')
    const r1 = JSON.parse(fs.readFileSync('.symbols_cac40'))
    const cac40 = r1.flat().filter(d => d.isin === isin)
    if(cac40.length) return cac40[0]

    if (!fs.existsSync('.symbols_etf')) await get_symbols('etf')
    const r2 = JSON.parse(fs.readFileSync('.symbols_etf'))
    const etf = r2.flat().filter(d => d.isin === isin)
    if(etf.length) return etf[0]
    return 'KO'
}

module.export = get_price = async (isin) => {
  const symbol = await get_symbol(isin)
  return {
      date: new Date().format(),
      price: +(await parse_fiche_valeur(symbol.url)).price ,
      label: symbol.label,
      }
}

module.export = get_price2 = async (isin) => {
  // const symbol = await get_symbol(isin)
  return {
      date: new Date().format(),
      price: 10,
      label: 'LGA',
      }
}

// TO DO:
// export 1x at end.
