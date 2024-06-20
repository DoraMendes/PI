// Chakra imports
import { Box, Button, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
import { DateTime } from 'luxon';
import { attacksLastMonthMock } from 'mocks/statistics';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { MdBarChart, MdOutlineCalendarToday } from 'react-icons/md';
// Assets
import { RiArrowUpSFill } from 'react-icons/ri';
import { getAttacksLastMonthCount } from 'statisticsRequests';
import { AttacksLastMonth, AttacksLastMonth } from 'types/statistics';
import { lineChartDataTotalSpent, lineChartOptionsTotalSpent } from 'variables/charts';

export default function AttacksLastMonth(props: { [x: string]: any }) {
	const { ...rest } = props;

	// Chakra Color Mode

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const iconColor = useColorModeValue('brand.500', 'white');
	const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const bgHover = useColorModeValue({ bg: 'secondaryGray.400' }, { bg: 'whiteAlpha.50' });
	const bgFocus = useColorModeValue({ bg: 'secondaryGray.300' }, { bg: 'whiteAlpha.100' });

	const [ mounted, setMounted ] = useState(false);
	const [attacks, setAttacks] = useState<AttacksLastMonth[]>([]);


	const lineChartOptions = {
		chart: {
		  toolbar: {
			show: false,
		  },
		  dropShadow: {
			enabled: true,
			top: 13,
			left: 0,
			blur: 10,
			opacity: 0.1,
			color: "#4318FF",
		  },
		},
		colors: ["#4318FF", "#39B8FF"],
		markers: {
		  size: 0,
		  colors: "white",
		  strokeColors: "#7551FF",
		  strokeWidth: 3,
		  strokeOpacity: 0.9,
		  strokeDashArray: 0,
		  fillOpacity: 1,
		  discrete: [],
		  shape: "circle",
		  radius: 2,
		  offsetX: 0,
		  offsetY: 0,
		  showNullDataPoints: true,
		},
		tooltip: {
		  theme: "dark",
		},
		dataLabels: {
		  enabled: false,
		},
		stroke: {
		  curve: "smooth",
		  // type: "line",
		},
		xaxis: {
		  // type: "numeric",
		  categories: attacks.map((a) => DateTime.fromJSDate(a.date).toFormat('dd')).sort(),
		  labels: {
			style: {
			  colors: "#A3AED0",
			  fontSize: "12px",
			  fontWeight: "500",
			},
		  },
		  axisBorder: {
			show: false,
		  },
		  axisTicks: {
			show: false,
		  },
		},
		yaxis: {
		  show: false,
		},
		legend: {
		  show: false,
		},
		grid: {
		  show: false,
		  column: {
			// color: ["#7551FF", "#39B8FF"],
			opacity: 0.5,
		  },
		},
		// color: ["#7551FF", "#39B8FF"],
	  };

	useEffect(() => {
		const timeout = setTimeout(() => {
			setMounted(true);
		}, 3000);
		return () => {
			clearTimeout(timeout);
		};
	}, []);

	useEffect(() => {
		getAttacksLastMonthCount().then((a) => setAttacks(a))
	}, [])

	console.log('attacks last month', attacks);
	
	const transformToChartData = () => {
		const aux: [{name: string | null, data: [AttacksLastMonth['count']] | null}] = [{data: null, name: null}];
		
		attacks.forEach((a) => {
			console.log('attacksattacks', a.count, a.date);
			
			aux.push({data: [a.count], name: a.date.toISOString()})
		})
		return aux;
	}

	const transformToChartData2 = () => {
		const aux = [];

		attacks.forEach((a) => {
			console.log('attacksattacks', a.count, a.date);
			
			aux.push(a.count);
		})
		return {name: 'attacks', data: aux};
	}

	console.log('transformToChartData2', transformToChartData2());
	
	const a = [
		{
		  name: "2024-05-28T01:14:57.529Z",
		  data: [0, 1, 2, 3, 4],
		},
		{
		  name: "2024-05-15T17:38:13.757Z",
		  data: [0, 1, 2, 3, 4],
		},
		{
		  name: "2024-05-23T04:43:00.237Z",
		  data: [0, 1, 2, 3, 4],
		}
	  ]

	return (
		<Card justifyContent='center' alignItems='center' flexDirection='column' w='100%' mb='0px' {...rest}>
			<Flex justify='space-between' ps='0px' pe='20px' pt='5px' w='100%' alignItems='center'>
				<Text
					me='auto'
					color={textColor}
					fontSize='xl'
					fontWeight='700'
					lineHeight='100%'
					whiteSpace='nowrap'
				>
					{`Attacks on ${DateTime.now().toFormat('MMMM')}`}
				</Text>
				<Flex align='center' w='100%' justify='end' >
					<Button bg={boxBg} fontSize='sm' fontWeight='500' color={textColorSecondary} borderRadius='7px'>
						<Icon as={MdOutlineCalendarToday} color={textColorSecondary} me='4px' />
						This month
					</Button>
					<Button
						ms='auto'
						alignItems='center'
						justifyContent='center'
						bg={bgButton}
						_hover={bgHover}
						_focus={bgFocus}
						_active={bgFocus}
						w='37px'
						h='37px'
						lineHeight='100%'
						borderRadius='10px'
						{...rest}
						marginLeft={10}
						
						>
						<Icon as={MdBarChart} color={iconColor} w='24px' h='24px' />
					</Button>
				</Flex>
			</Flex>
			<Flex w='100%' flexDirection={{ base: 'column', lg: 'row' }}>
				<Flex flexDirection='column' me='20px' mt='28px'>
					<Flex align='center' mb='20px'>
						<Flex align='center'>
							{/* <Icon as={RiArrowUpSFill} color='green.500' me='2px' mt='2px' /> */}
							{/* <Text color='green.500' fontSize='sm' fontWeight='700' lineHeight='100%'>
								+2.45%
							</Text> */}
						</Flex>
					</Flex>

				</Flex>
				<Box minH='260px' minW='75%' w='100%' mt='auto'>
					<LineChart chartData={[transformToChartData2()]} chartOptions={lineChartOptions} />
				</Box>
			</Flex>
		</Card>
	);
}
