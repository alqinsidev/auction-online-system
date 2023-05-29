import AppRouter from './router/router'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './redux/Store'
import './helpers/socketHelpers'

function App() {
  return (
    <Provider store={store}>
      <AppRouter/>
    </Provider>
  )
}

export default App
