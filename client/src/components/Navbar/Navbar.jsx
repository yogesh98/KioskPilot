import {
  Box,
  Flex,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Image,
  Icon,
} from '@chakra-ui/react'

import { MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons'
import { useAuth } from '@yogeshp98/pocketbase-react'
import ConfigurationPickerComponent from '../Common/ConfigurationPickerComponent'
import { useNavigate, useParams } from 'react-router-dom'


const NavLink = (props) => {
  const { children } = props

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('gray.200', 'gray.700'),
      }}
      href={'#'}>
      {children}
    </Box>
  )
}

export default function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode()
  const navigate = useNavigate();
  const params = useParams();
  const {actions, user} = useAuth()
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4} m={2} borderRadius={'15px'}>
        <Flex h={14} alignItems={'center'} justifyContent={'space-between'}>
          <Stack h={'100%'} alignItems={'center'} direction={'row'} spacing={2}>
            <Image h={'60%'} src={useColorModeValue("/kiosk_pilot_logo_black.png", "/kiosk_pilot_logo_white.png")}/>
            <Text>Kiosk Pilot</Text>
          </Stack>
          <Box>
            <ConfigurationPickerComponent currentConfigurationId={params.configurationId} onChange={(configurationId) => navigate("cms/"+configurationId)}/>
          </Box>
          <Stack alignItems={'center'} direction={'row'} spacing={2}>
            <Button onClick={toggleColorMode}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Button onClick={actions.signOut}>Logout</Button>
          </Stack>
        </Flex>
      </Box>
    </>
  )
}