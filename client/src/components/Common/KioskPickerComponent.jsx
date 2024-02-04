import { useEffect, useState} from 'react'
import {
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    Modal,
    ModalBody,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    Flex,
    Spacer,
    Box,
} from '@chakra-ui/react'
  
import { ChevronDownIcon, AddIcon } from '@chakra-ui/icons'
import { useAppContent } from '@yogeshp98/pocketbase-react'
import { useParams } from 'react-router-dom';
  
  
export default function KioskPickerComponent({
    currentKioskId,
    onChange,
}) {
    const [currentKiosk, setCurrentKiosk] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { records: kiosks, actions } = useAppContent('kiosks', true);
    actions.subscribe();
    const params = useParams();

    useEffect(() => {
        console.log(params);
        console.log(kiosks);
        setCurrentKiosk(kiosks.find((kiosks) => kiosks.id === currentKioskId))
    },[kiosks, currentKioskId]);

    const createKiosk = async (e) => {
        e.preventDefault();
        const name = document.getElementById('nameInput').value;
        const record = await actions.create({"name": name});
        onClose();
        if(onChange && record) onChange(record.id);
    }


    return (
      <>
        <Menu placement='bottom'>
            <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                minW="200px"
                px={4}
                py={2}
                transition='all 0.2s'
                borderRadius='md'
                borderWidth='1px'
                _hover={{ bg: 'gray.400' }}
                _expanded={{ bg: 'blue.400' }}
                _focus={{ boxShadow: 'outline' }}
            >

                {currentKiosk ? currentKiosk.name : "Pick a Kiosk"}
            </MenuButton>
            <MenuList>
                {kiosks.map((kiosk) => <MenuItem onClick={() => onChange(kiosk.id)}>{kiosk.name}</MenuItem>)}
                <MenuDivider />
                <MenuItem onClick={onOpen}> <AddIcon mr={2}/> Create</MenuItem>
            </MenuList>
        </Menu>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a new Kiosk</ModalHeader>
                <ModalCloseButton />
                <form>
                    <ModalBody>
                        <FormControl isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input id='nameInput' />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button type='submit' colorScheme='blue' onClick={createKiosk}>
                            Create
                        </Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
      </>
    )
  }