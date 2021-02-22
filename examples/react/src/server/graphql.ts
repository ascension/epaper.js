import { ApolloClient, InMemoryCache, gql, HttpLink } from '@apollo/client';
import fetch from 'cross-fetch';

export const client = new ApolloClient({
    link: new HttpLink({ uri: 'https://www.blockforge.io/api', fetch }),
    cache: new InMemoryCache(),
});

export const getBitcoinPrice = async () =>
    client.query({
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
