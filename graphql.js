import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://159cfec94697.ngrok.io/api',
    cache: new InMemoryCache(),
});

const getBitcoinPrice = client.query({
    query: gql`
        query getBitoinInfo {
            asset(symbol: BTC) {
                displayName
                formattedPrice
                priceDate
            }
        }
    `,
});

module.exports = { client, getBitcoinPrice };
