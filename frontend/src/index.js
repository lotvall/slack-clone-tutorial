import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Routes from './Routes'
import { ApolloProvider } from "react-apollo";
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import 'semantic-ui-css/semantic.min.css'


const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const middlewareLink = setContext(() => ({
  headers: {
    'x-token': localStorage.getItem('token'),
    'x-refresh-token': localStorage.getItem('refreshToken'),
  },
}));

const afterwareLink = new ApolloLink((operation, forward) =>
  forward(operation).map((response) => {
    const { response: { headers } } = operation.getContext();
    if (headers) {
      const token = headers.get('x-token');
      const refreshToken = headers.get('x-refresh-token');

      if (token) {
        localStorage.setItem('token', token);
      }

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }

    return response;
  }));

const httpLinkWithMiddleware = afterwareLink.concat(middlewareLink.concat(httpLink));


const client = new ApolloClient({
  link: httpLinkWithMiddleware,
  cache: new InMemoryCache(),
});

const App = (
    <ApolloProvider client={client}>
        <Routes />  
    </ApolloProvider>
)

ReactDOM.render(App, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
