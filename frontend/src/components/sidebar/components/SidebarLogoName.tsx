import { Flex, useColorModeValue, } from '@chakra-ui/react';

import logo from '../../../img/logo.svg';
import { HSeparator, } from 'components/separator/Separator';
import Image from 'next/image';

export function SidebarLogoName() {
	let logoColor = useColorModeValue('navy.700', 'white');

	return (
		<Flex alignItems='center' flexDirection='column' style={{width: 'calc(100% - 20px)',}}>
			<Image
				priority
				src={logo}
				alt="Follow us on Twitter"
				style={{width: '200px', height: '200px',}}
			/>

			<HSeparator mb='20px' />
		</Flex>
	);
}

export default SidebarLogoName;
