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
} from '@chakra-ui/react'
  
import { ChevronDownIcon, AddIcon } from '@chakra-ui/icons'
import { useAppContent } from '@yogeshp98/pocketbase-react'

/*
    TODO:
    Figure out why subscribe adds so many records to the array.
    Instead of by kiosk do by configuration and push it to the kiosk
*/
  
export default function ConfigurationPickerComponent({
    currentConfigurationId,
    onChange,
}) {
    const [currentConfiguration, setCurrentConfiguration] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { records: configurations, actions, isSubscribed } = useAppContent('configurations');
    useEffect(() => {
        if(!isSubscribed){
            console.count("subscribe")
            actions.subscribe();
        }
        return () => {
            console.count("unsubscribe")
            actions.unsubscribe()
        }
    },[]);

    useEffect(() => {
        setCurrentConfiguration(configurations?.find((configurations) => configurations.id === currentConfigurationId))
    },[configurations, currentConfigurationId]);

    const createKiosk = async (e) => {
        e.preventDefault();
        const name = document.getElementById('nameInput').value;
        const height = document.getElementById('heightInput').value;
        const width = document.getElementById('widthInput').value;
        
        const record = await actions.create({"name": name, "height": height, "width": width});
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

                {currentConfiguration ? currentConfiguration.name + " (" + currentConfiguration.width + "x" + currentConfiguration.height + ")" : "Pick a configuration"}
            </MenuButton>
            <MenuList overflowY={'scroll'}>
                {configurations?.map((configuration) => <MenuItem key={configuration.id} onClick={() => onChange(configuration.id)}>{configuration.name + " (" + configuration.width + "x" + configuration.height + ")"}</MenuItem>)}
                <MenuDivider />
                <MenuItem onClick={onOpen}> <AddIcon mr={2}/> Create</MenuItem>
            </MenuList>
        </Menu>
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create a new Configuration</ModalHeader>
                <ModalCloseButton />
                <form>
                    <ModalBody>
                        <FormControl mb={2} isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input id='nameInput' />
                        </FormControl>
                        <FormControl mb={2} isRequired>
                            <FormLabel>Width</FormLabel>
                            <Input id='widthInput' />
                        </FormControl>
                        <FormControl mb={2} isRequired>
                            <FormLabel>Height</FormLabel>
                            <Input id='heightInput' />
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