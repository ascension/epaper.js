import * as React from 'react';
import {
    Box,
    Container,
    Heading,
    Text,
    Flex,
    ThemeProvider,
    ChakraProvider,
    extendTheme,
} from '@chakra-ui/react';
import { AppProps, AppStates } from '../../server/domain/IApp';

const theme = extendTheme({});
export default class App extends React.Component<AppProps, AppStates> {
    render() {
        return (
            <ChakraProvider theme={theme}>
                <Flex width="full" height="100vh" alignItems="center">
                    <Container maxW="4xl" centerContent>
                        <Box>
                            <Heading size="4xl" color="red">
                                Bitcoin
                            </Heading>
                            <Text fontSize="8xl">$ 52,000.00</Text>
                        </Box>
                    </Container>
                </Flex>
            </ChakraProvider>
        );
    }
}
