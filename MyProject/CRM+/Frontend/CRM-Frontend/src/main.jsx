import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@fontsource/poppins'
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import router from './routes/index.jsx'
import {store} from './utils/store/index'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    {/* <App /> */}
    </Provider>
  </StrictMode>,
)
 