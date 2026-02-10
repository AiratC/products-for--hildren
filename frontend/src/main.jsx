import ReactDOM from "react-dom/client";
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { store } from './redux/store.js'
import { Provider } from 'react-redux'

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
)
