import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import GlobalStyles from '@/presentation/theme/globalStyles'
import { ThemeProvider } from 'styled-components'
import light from '@/presentation/theme/light'
import { makeLogin } from '@/main/factories/pages/login/login-factory'
import { makeSignup } from '@/main/factories/pages/signup/signup-factory'
import { ApiContext } from '@/presentation/contexts'
import {
  getCurrentAccountAdapter,
  setCurrentAccountAdapter
} from '@/main/adapters/current-account-adapter'
import { PrivateRoute } from '@/presentation/components'
import { makeSurveyList } from '@/main/factories/pages/survey-list/survey-list-factory'
import { makeSurveyResult } from '../factories/pages/survey-result/survey-result-factory'

const Router: React.FC = () => {
  return (
    <ThemeProvider theme={light}>
      <GlobalStyles />
      <ApiContext.Provider
        value={{
          setCurrentAccount: setCurrentAccountAdapter,
          getCurrentAccount: getCurrentAccountAdapter
        }}
      >
        <BrowserRouter>
          <Switch>
            <Route path='/login' exact component={makeLogin} />
            <Route path='/signup' exact component={makeSignup} />
            <PrivateRoute path='/' exact component={makeSurveyList} />
            <PrivateRoute path='/surveys/:id' component={makeSurveyResult} />
          </Switch>
        </BrowserRouter>
      </ApiContext.Provider>
    </ThemeProvider>
  )
}

export default Router
