import { Box, Flex, Text, Select, useColorModeValue, } from '@chakra-ui/react';
import Card from 'components/card/Card';
import PieChart from 'components/charts/PieChart';
import { VSeparator, } from 'components/separator/Separator';

export default function PieCard(props: { [x: string]: any }) {
	const { pieChartData, pieChartOptions, title, ...rest } = props;

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const cardColor = useColorModeValue('white', 'navy.700');
	const colorsLegend = pieChartOptions.colors.map((c: any) => c);

	return (
		<Card p='20px' alignItems='center' flexDirection='column' w='100%' h='fit-content' {...rest}>
			<Flex
				px={{ base: '0px', '2xl': '10px', }}
				justifyContent='space-between'
				alignItems='center'
				w='100%'
				mb='8px'
			>
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
			<div>
				<PieChart h='100%' w='100%' chartData={pieChartData} chartOptions={pieChartOptions} />
				<Card
					bg={cardColor}
					flexDirection='row'
					w='100%'
					p='15px'
					px='20px'
					mt='15px'
					mx='auto'
					display='grid' gridTemplateColumns='repeat(3, auto)' justifyContent='space-between'
				>
					{pieChartOptions.labels.map((label: any, index: number) => {
						return (
							<Flex direction='column' py='5px' key={label} >
								<Flex align='center'>
									<Box h='8px' w='8px' bg='brand.500' borderRadius='50%' me='4px' background={colorsLegend[index]} />
									<Text fontSize='xs' color='secondaryGray.600' fontWeight='700' mb='5px' whiteSpace='nowrap'>
										{label}
									</Text>
								</Flex>
								<Text fontSize='lg' color={textColor} fontWeight='700'>
									{pieChartData[index]}
								</Text>
								{index !== pieChartOptions.labels.length && (<VSeparator mx={{ base: '60px', xl: '60px', '2xl': '60px', }} />)}
							</Flex>
						)
					})}
				</Card>
			</div>
		</Card>
	);
}
