import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import CssBaseline from '@mui/material/CssBaseline';

const token = 'da2-yg24vzep6zgc5gzsftrp4hi65q' //TODO this obviously needs changin

const link = createHttpLink({
  uri: 'https://e2ktqhorwvdzxczqg5klacwlpy.appsync-api.us-east-1.amazonaws.com/graphql',
  headers: {
    "x-api-key": `${token}`
  },
})

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <CssBaseline>
        <App />
      </CssBaseline>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
