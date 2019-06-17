import React from 'react'

import LoadRoutes from 'client/LoadRoutes'
// import GlobalStyles from 'components/ui/GlobalStyles'
import { Helmet } from 'react-helmet'

function App () {
  return (
    <>
      <Helmet>
        <title>APP React Split</title>
        <link rel='canonical' href='http://mysite.com/example' />
      </Helmet>
      {/* <GlobalStyles /> */}
      <LoadRoutes />
    </>
  )
}

export default App
