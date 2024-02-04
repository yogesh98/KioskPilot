import {
    FormControl,
    FormLabel,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    useDisclosure,
    useMergeRefs,
  } from '@chakra-ui/react'
  import { forwardRef, useRef } from 'react'
  import { HiEye, HiEyeOff } from 'react-icons/hi'
  
  export const PasswordField = forwardRef(({isRepeat}, ref) => {
    const { isOpen, onToggle } = useDisclosure()
    const inputRef = useRef(null)
    const mergeRef = useMergeRefs(inputRef, ref)
    const onClickReveal = () => {
      onToggle()
      if (inputRef.current) {
        inputRef.current.focus({
          preventScroll: true,
        })
      }
    }
    return (
      <FormControl>
        <FormLabel htmlFor="password">{!isRepeat ? "Password" : "Repeat Password"}</FormLabel>
        <InputGroup>
          <Input
            ref={mergeRef}
            type={isOpen ? 'text' : 'password'}
            autoComplete="current-password"
            required
          />
          <InputRightElement>
            <IconButton
              variant="text"
              aria-label={isOpen ? 'Mask password' : 'Reveal password'}
              icon={isOpen ? <HiEyeOff /> : <HiEye />}
              onClick={onClickReveal}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
    )
  })
  PasswordField.displayName = 'PasswordField'