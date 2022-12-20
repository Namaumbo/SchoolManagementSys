import './bootstrap'
import React from "react";
import ReactDOM from "react-dom/client";
import App from './components/App';
import {RecoilRoot} from "recoil";

 // if(document.getElementById("root")).render(<App/>)
ReactDOM.createRoot(document.getElementById('app')).render(
    <RecoilRoot>
        <App />
    </RecoilRoot>

);

