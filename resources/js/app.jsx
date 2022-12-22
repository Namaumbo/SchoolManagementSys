import './bootstrap'
import React from "react";
import ReactDOM from "react-dom/client";
import App from './components/App';
import {RecoilRoot} from "recoil";

ReactDOM.createRoot(document.getElementById('app')).render(
    <RecoilRoot>
        <App/>
    </RecoilRoot>

);

