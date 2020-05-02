import './scraper_bourso.js'

const display_test = (label ,status) => {
  const FgRed = "\x1b[31m"
  const FgGreen = "\x1b[32m"
  const Reset = "\x1b[0m"
  const green = (str) => [FgGreen, str, Reset].join(' ')
  const red = (str) => [FgRed, str, Reset].join(' ')
  console.log(label, status ? green('OK') : red('KO'))
}

const test_build_symbols = async (market) => {
  try{
    const start = new Date()
    const data = await get_symbols(market)
    const end = new Date()
    const duration = new Date(end - start).format('mm:ss')
    display_test('Build {} Symbols (in {})'.format(market, duration), true)
    const missing = data.flat().filter(d => d.isin === 'error' || d.url === 'error').length
    display_test('{} Symbols with error {} / {}:'.format(market, missing.toString(), data.flat().length), missing == 0)
  }catch(e){
    console.log(e)
    display_test('Build {} Symbols'.format(market), false)
  }
}

const run_tests = async () => {
  await test_build_symbols('cac40')
  await test_build_symbols('etf')
  
  display_test('Check FR0000120271 (CAC40):', await get_symbol('FR0000120271') !== null)
  display_test('Check FR0000066672 (CAC40):', await get_symbol('FR0000066672') !== null)
  display_test('Check FR0000133308 (CAC40):', await get_symbol('FR0000133308') !== null)
  display_test('Check FR0004163111 (CAC40):', await get_symbol('FR0004163111') !== null)
  display_test('Check FR0010208488 (CAC40):', await get_symbol('FR0010208488') !== null)
  // (OST => LU1681047079)
  display_test('Check FR0010878033 (CAC40):', await get_symbol('FR0010878033') !== null)
  // FR0013457272 => KO (FDJ => FR0013451333)
  display_test('Check FR0013457272 (CAC40):', await get_symbol('FR0013457272') !== null)
  display_test('Check FR0004035913 (ETF)  :', await get_symbol('FR0004035913') !== null)
  display_test('Check LU1681047079 (ETF)  :', await get_symbol('LU1681047079') !== null)
  display_test('Check FR0013041530 (ETF)  :', await get_symbol('FR0013041530') !== null)
  display_test('Check FR0011869353 (ETF)  :', await get_symbol('FR0011869353') !== null)

  const price_cac40 = await get_price('FR0000120271')
  display_test('Check get_price FR0000120271 (CAC40): {}'.format(price_cac40), typeof(+price_cac40) === 'number')

  const price_etf = await get_price('FR0011869353')
  display_test('Check get_price FR0011869353 (ETF): {}'.format(price_etf.price), typeof(+price_etf.price) === 'number')
}

run_tests()
