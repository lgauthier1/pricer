import './scraper_bourso.js'

const display_test = (label ,status) => {
  const FgRed = "\x1b[31m"
  const FgGreen = "\x1b[32m"
  const Reset = "\x1b[0m"
  const green = (str) => [FgGreen, str, Reset].join(' ')
  const red = (str) => [FgRed, str, Reset].join(' ')
  console.log(label, status ? green('OK') : red('KO'))
}

const run_tests = async () => {
    console.log('CAC40 get symbol (<1min)')
    try{
      const start = new Date()
      const cac40 = await get_symbols('cac40')
      const end = new Date()
      const duration = new Date(end - start).format('mm:ss')
      display_test('Build cac40 Symbols (in {})'.format(duration), true)
      const missing_cac40 = cac40.flat().filter(d => d.isin === 'error' || d.url === 'error').length
      display_test('CAC40 Symbols with error {} / {}:'.format(missing_cac40.toString(), cac40.flat().length), missing_cac40 == 0)
      //TO DO cach des symbols
    }catch(e){
      console.log(e)
      display_test('Build CAC40 Symbols', false)
    }
    console.log('Etf get symbols...')
    try{
      const start = new Date()
      const etf = await get_symbols('etf')
      const end = new Date()
      const duration = new Date(end - start).format('mm:ss')
      display_test('Build ETF Symbols (in {})'.format(duration), true)
      const missing_etf = etf.flat().filter(d => d.isin === 'error' || d.url === 'error').length
      display_test('ETF Symbols with error {} / {}:'.format(missing_etf.toString(), etf.flat().length), missing_etf == 0)
      //TO DO cach des symbols
    }catch(e){
      display_test('Build ETF Symbol', false)
    }

  display_test('Check FR0000120271 (CAC40):', await get_symbol('FR0000120271') !== 'KO')
  display_test('Check FR0000066672 (CAC40):', await get_symbol('FR0000066672') !== 'KO')
  display_test('Check FR0000133308 (CAC40):', await get_symbol('FR0000133308') !== 'KO')
  display_test('Check FR0004163111 (CAC40):', await get_symbol('FR0004163111') !== 'KO')
  display_test('Check FR0010208488 (CAC40):', await get_symbol('FR0010208488') !== 'KO')
  // (OST => LU1681047079)
  display_test('Check FR0010878033 (CAC40):', await get_symbol('FR0010878033') !== 'KO')
  // FR0013457272 => KO (FDJ => FR0013451333)
  display_test('Check FR0013457272 (CAC40):', await get_symbol('FR0013457272') !== 'KO')
  display_test('Check FR0004035913 (ETF)  :', await get_symbol('FR0004035913') !== 'KO')
  display_test('Check LU1681047079 (ETF)  :', await get_symbol('LU1681047079') !== 'KO')
  display_test('Check FR0013041530 (ETF)  :', await get_symbol('FR0013041530') !== 'KO')
  display_test('Check FR0011869353 (ETF)  :', await get_symbol('FR0011869353') !== 'KO')

  const price_cac40 = await get_price('FR0000120271')
  display_test('Check get_price FR0000120271 (CAC40): {}'.format(price_cac40), typeof(+price_cac40) === 'number')

  const price_etf = await get_price('FR0011869353')
  display_test('Check get_price FR0011869353 (ETF): {}'.format(price_etf.price), typeof(+price_etf.price) === 'number')
}

run_tests()
