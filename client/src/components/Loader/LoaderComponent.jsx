import { Spinner, Flex } from '@chakra-ui/react'

const LoaderComponent = () => {
    return (
        <Flex justifyContent="center" alignItems="center" height="100%">
            <Spinner size="xl" />
        </Flex>
    );
};

export default LoaderComponent;