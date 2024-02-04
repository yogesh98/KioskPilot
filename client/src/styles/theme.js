import { extendTheme } from '@chakra-ui/react'
  
const config = {
    styles: {
        global: {
            body: {
                margin:0,
                display: "flex",
                minHeight: "100vh",
                minWidth: "320px",
            },
            '#root': {
                padding: '0',
                minWidth:'100%',
            },
        }
    },
    initialColorMode: 'dark',
    useSystemColorMode: false,
}

const theme = extendTheme(config)

export default theme