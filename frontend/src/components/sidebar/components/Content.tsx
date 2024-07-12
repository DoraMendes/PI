import { Box, Flex, Stack } from '@chakra-ui/react';
import MiniCalendar from 'components/calendar/MiniCalendar';
import SidebarLogoName from 'components/sidebar/components/SidebarLogoName';
import Links from 'components/sidebar/components/Links';
import { IRoute } from 'types/navigation';

interface Props {
	routes: IRoute[];
}

function SidebarContent(props: Props) {
	const { routes } = props;

	return (
		<Flex direction='column' height='100%' pt='25px' borderRadius='30px'>
			<SidebarLogoName />
			<Stack direction='column' mt='8px' mb='auto'>
				<Box ps='20px' pe={{ lg: '16px', '2xl': '16px' }}>
					<Links routes={routes} />
				</Box>
			</Stack>

			{/* <Box ps='20px' pe={{ lg: '16px', '2xl': '20px' }} mt='60px' mb='40px' borderRadius='30px'>
				<MiniCalendar h="100%" minW="100%" selectRange={false} />
			</Box> */}
		</Flex>
	);
}

export default SidebarContent;
