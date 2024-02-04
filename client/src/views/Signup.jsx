import {
    Box,
    Button,
  //   Checkbox,
    Container,
    Divider,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Image,
    Input,
    Link,
    Stack,
    Text,
    useBreakpointValue,
    useColorModeValue,
  } from '@chakra-ui/react'
  
  import { PasswordField } from '../components/PasswordField/PasswordField'
  import { useRef, useState, useEffect } from 'react'
  import { useAuth, useClientContext } from '@yogeshp98/pocketbase-react';
  import { useNavigate } from "react-router-dom";
  
const Signup = () => {
      const logo = useColorModeValue("/kiosk_pilot_logo_black.png", "/kiosk_pilot_logo_white.png")
      const navigate = useNavigate()
      const usernameRef = useRef(null)
      const passwordRef = useRef(null)
      const passwordRef2 = useRef(null)
      const { actions, isSignedIn } = useAuth()
      const [loading, setLoading] = useState(false)
      const [error, setError] = useState("")
      const client = useClientContext()

      useEffect(() => {
        if(isSignedIn){
          navigate("/dashboard");
        }
      }, [isSignedIn])
  
      const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          setLoading(true)
          if(passwordRef?.current?.value !== passwordRef2?.current?.value) {
            setError("passwords do not match")
          } else {
            await client.collection('users').create({
              username: usernameRef?.current?.value,
              password: passwordRef?.current?.value,
              passwordConfirm: passwordRef2?.current?.value
            });
            navigate('/login')
          }
        } catch (error) {
          try {
            console.error(error)
            const name = Object.keys(error.data.data)[0]
            const message = error.data.data[name].message
            setError(name.charAt(0).toUpperCase() + name.slice(1)+": "+message)
          } catch (error2) {
            setError("Failed to create user. Contact server Owner.")
          }
        } finally {
          setLoading(false)
        }
      }
      return (
          <Container maxW="lg" py={{ base: '12', md: '24' }} px={{ base: '0', sm: '8' }}>
            <Stack spacing={8}>
              <Stack spacing="6">
                <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
                  <Flex alignItems={"center"} justifyContent="center">
                    <Image mr={'2'} maxH={'100px'} src={logo}/>
                    <Heading size={useBreakpointValue({ base: '2xl', md: '4xl' })}>
                        Kiosk Pilot
                    </Heading>
                  </Flex>
                  <Heading size={useBreakpointValue({ base: 'md', md: 'lg' })}>
                    Sign up for an account
                  </Heading>
                </Stack>
              </Stack>
              <Box
                py={{ base: '0', sm: '8' }}
                px={{ base: '4', sm: '10' }}
                bg={useBreakpointValue({ base: 'transparent', sm: 'bg-surface' })}
                boxShadow={{ base: 'none', sm: useColorModeValue('lg', 'dark-lg') }}
                borderRadius={{ base: 'none', sm: 'xl' }}
              >
                <Stack spacing="6">
                  {error ? <Text color="red.400">{error}</Text> : null}
                  <form onSubmit={handleSubmit}>
                    <Stack spacing="5">
                      <FormControl>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <Input id="username" type="username" ref={usernameRef} />
                      </FormControl>
                      <PasswordField ref={passwordRef} />
                      <PasswordField isRepeat={true} ref={passwordRef2} />
                      <Button type='submit' disabled={loading} variant="solid" onClick={handleSubmit}>Sign Up</Button>
                    </Stack>
                  </form>
                  <Stack spacing="6">
                    <HStack justify="center">
                        <Text>Have an account?</Text>
                        <Button variant="link" colorScheme="blue" onClick={() => navigate('/login')}>
                            Log In
                        </Button>
                    </HStack>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Container>
      )
  }
  
  export default Signup