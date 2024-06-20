// Chakra imports
import { Box, Flex, Text, Select, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import PieChart from 'components/charts/PieChart';
import { VSeparator } from 'components/separator/Separator';
export default function Conversion(props: { [x: string]: any }) {
	const { pieChartData, pieChartOptions, title, ...rest } = props;

	// Chakra Color Mode
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const cardColor = useColorModeValue('white', 'navy.700');
	const cardShadow = useColorModeValue('0px 18px 40px rgba(112, 144, 176, 0.12)', 'unset');
	
	return (
		<Card p='20px' alignItems='center' flexDirection='column' w='100%' {...rest}>
			<Flex
				px={{ base: '0px', '2xl': '10px' }}
				justifyContent='space-between'
				alignItems='center'
				w='100%'
				mb='8px'>
				<Text color={textColor} fontSize='md' fontWeight='600' mt='4px'>
					{title}
				</Text>
				
				{/* TODO: ver se faço isto */}
				<Select fontSize='sm' variant='subtle' defaultValue='monthly' width='unset' fontWeight='700'>
					<option value='daily'>Daily</option>
					<option value='monthly'>Monthly</option>
					<option value='yearly'>Yearly</option>
				</Select>

			</Flex>

			<PieChart h='100%' w='100%' chartData={pieChartData} chartOptions={pieChartOptions} />
			<Card
				bg={cardColor}
				flexDirection='row'
				boxShadow={cardShadow}
				w='100%'
				p='15px'
				px='20px'
				mt='15px'
				mx='auto'>

				{pieChartOptions.labels.map((label, index) => {
					return (
						<>
							<Flex direction='column' py='5px' key="">
								<Flex align='center'>
									<Box h='8px' w='8px' bg='brand.500' borderRadius='50%' me='4px' />
									<Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px' whiteSpace='nowrap'>
										{label}
									</Text>
								</Flex>
								<Text fontSize='lg' color={textColor} fontWeight='700'>
									{pieChartData[index]}
								</Text>
							</Flex>
							{index !== pieChartOptions.labels.length && (<VSeparator mx={{ base: '60px', xl: '60px', '2xl': '60px' }} />)}
						</>
					)
				})}
			</Card>
		</Card>
	);
}
