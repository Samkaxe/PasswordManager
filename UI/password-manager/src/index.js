import { Client as Styletron } from 'styletron-engine-monolithic';
import { Provider as StyletronProvider } from 'styletron-react';
import { LightTheme, BaseProvider
} from 'baseui';
import React from 'react';
import ReactDOM
    from 'react-dom/client';
import App from './App';
import reportWebVitals from "./reportWebVitals";

// Create the Styletron engine first
const engine = new Styletron();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StyletronProvider value={engine}>
        <BaseProvider theme={LightTheme}>
            <App />
        </BaseProvider>
    </StyletronProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

