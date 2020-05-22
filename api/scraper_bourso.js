const fetch = require('node-fetch')
const firebase = require('firebase-admin')

const serviceAccount = require('./auth/pricer.json')
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://pricer-c75a5.firebaseio.com',
})
const database = firebase.database()
const get = async key => {return await database.ref(key).once('value').then(snapshot => {
      return snapshot.val()
    })
}
const set = async (key, value) => {
  const update = {}
  update[key] = value
  database.ref().update(update)
}

require('./raw.js')
Object.extend(true)

const markets = {
  cac40: {
    url: 'https://www.boursorama.com/bourse/actions/cotations/',
    max_page: 12,
    pattern1: new RegExp(/href="\/cours\/.*\/"[\s]{2,}title=.*/, 'g'),
    pattern2: new RegExp(/href="\/cours\/.*\/"[\s]/, 'g'),
  },
  etf: {
    url: 'https://www.boursorama.com/bourse/trackers/palmares/',
    max_page: 40,
    pattern1: new RegExp(/href=".*\/cours\/.*\/"[\s]{2,}title=.*/, 'g'), // A regrouper avec autre
    pattern2: new RegExp(/href=".*\/cours\/.*\/"[\s]/, 'g'),
  },
}

const parse_fiche_valeur = async url => {
  try {
    const fiche_valeur = await (await fetch('https://www.boursorama.com/' + url, { redirect: 'follow' })).text()
    const isin = fiche_valeur.match(/c-faceplate__isin">[A-Z0-9]{12}/g)[0].split('>')[1]
    const price = fiche_valeur.replace(/\n|\r/g, '').match(/<span class="c-instrument c-instrument--last" data-ist-last>.*?</)[0].match(/[0-9]*\.[0-9]*/)[0]
    return { url, isin, price }
  } catch (e) {
    return { url, isin: 'error', price: 'error' }
  }
}

module.export = get_symbols = async market => {
  const { url, max_page, pattern1, pattern2 } = markets[market]
  const raw_urls = await Promise.all(
    [...Array(max_page).keys()].map(async page => {
      const content = await (await fetch(url + 'page-' + page)).text()
      return content.match(pattern1).unique().filter(d => !d.includes('Cours '))
    }),
  )

  const symbols = await Promise.all(
    raw_urls.flat().unique().map(async d => {
        try {
          const url = d.match(pattern2)[0].replace('href="/', '').replace('/"\n', '')
          const label = d.match(/title=".*"/g)[0].replace('title="', '').replace('"', '')
          const fiche_valeur = await parse_fiche_valeur(url)
          return { ...fiche_valeur, label, market }
        } catch (e) {
          console.log(e)
        }
      }),
  )
  return symbols
}

module.export = sync_firebase = async () => {
  const cac40 = await get_symbols('cac40')
  const etf = await get_symbols('etf')
  await set('public/referentiel', { ...cac40, ...etf })
}

module.export = get_symbol = async isin => {
  return await get('public/referentiel/{}'.format(isin))
}

module.export = get_price = async isin => {
  const symbol = await get_symbol(isin)
  return {
    isin,
    date: new Date().format(),
    price: +(await parse_fiche_valeur(symbol.url)).price,
    market: symbol.market,
    label: symbol.label
  }
}
// TO DO:
// export 1x at end.
