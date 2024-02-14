import { Box, Flex } from "@chakra-ui/react";


export default function TestComponent({scaleFactor}) {
    const scaleFactorAsPercentage = (scaleFactor > 1 ? 1 : -1) * (scaleFactor * 100); 
    return (
        <>
            <Flex
                id="container_flex"
                h={'100%'}
                w={'100%'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <div  style={{transform: 'scale('+scaleFactor+') translate(0%, '+scaleFactorAsPercentage+'%)'}}> 
                    <span className="text">{2}</span>
                </div>
            </Flex>
        </>
    );
}