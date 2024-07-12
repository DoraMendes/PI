// Chakra imports
import { Box, Button, Flex, Icon, Text, useColorModeValue, } from '@chakra-ui/react';
// Custom components
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
import { DateTime, } from 'luxon';
import { useEffect, useRef, useState, } from 'react';
import { MdBarChart, MdOutlineCalendarToday, } from 'react-icons/md';
import { WebsocketClient, } from 'socket';
// Assets
import { Prediction, } from 'types/predictions';
import { interval, } from 'utils/timer';

const abort = new AbortController();

export default function AttacksLast5Minutes(props: { [x: string]: any }) {
	const { ...rest } = props;

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const iconColor = useColorModeValue('brand.500', 'white');
	const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const bgHover = useColorModeValue({ bg: 'secondaryGray.400', }, { bg: 'whiteAlpha.50', });
	const bgFocus = useColorModeValue({ bg: 'secondaryGray.300', }, { bg: 'whiteAlpha.100', });
	const [attacks, setAttacks,] = useState<{ [P in Prediction['attackType']]: number[] }>({
		APACHE_KILLER: new Array(30 * 5).fill(0), ARP_SPOOFING: new Array(30 * 5).fill(0), CAM_OVERFLOW: new Array(30 * 5).fill(0), MQTT_MALARIA: new Array(30 * 5).fill(0), 
		NETWORK_SCAN: new Array(30 * 5).fill(0), RUDY: new Array(30 * 5).fill(0), SLOW_LORIS: new Array(30 * 5).fill(0), SLOW_READ: new Array(30 * 5).fill(0), UNKNOWN: new Array(30 * 5).fill(0),
	});

	const a = useRef<{ [P in Prediction['attackType']]: number }>({
		APACHE_KILLER: 0, ARP_SPOOFING: 0, CAM_OVERFLOW: 0, MQTT_MALARIA: 0, NETWORK_SCAN: 0, RUDY: 0, SLOW_LORIS: 0,
		SLOW_READ: 0, UNKNOWN: 0,
	});

	const lineChartOptions = {
		colors: ["#4318FF", "#39B8FF",],
		chart: {
		  toolbar: {
			show: false,
		  },
		  dropShadow: {	enabled: true,	top: 13, left: 0,	blur: 10,	opacity: 0.1,	color: "#4318FF", },
		  animations: {
			enabled: false,
		  },
		},
		stroke: {
		  curve: "smooth",
		  // type: "line",
		},
		grid: {
		  show: false,
		},
		xaxis: {
		  // type: "numeric",
		  tickAmount: 4,
		  categories: (attacks.APACHE_KILLER || []).map((_, i) => i),
		  labels: {
		  	rotate: 0,
			style: {  colors: "#A3AED0",  fontSize: "12px",  fontWeight: "500",},
			formatter: function(value: string) {
				return DateTime.now().minus({ seconds: ((5 * 30) - +(value || 0)) * 2, }).toRelative()
			},
		  },
		  axisBorder: { show: false, },
		  axisTicks: {	show: false,  },
		},
		// color: ["#7551FF", "#39B8FF"],
	};

	useEffect(() => {
		// getAttacksLast5MinutesCount().then((a) => setAttacks(a));

		WebsocketClient.addListener((p: string) => {
			try {
				const prediction: Prediction = JSON.parse(p);
				a.current[prediction.attackType]++;
			} catch (error) {

			}
		})

		interval(2000, abort.signal, () => {
			console.log(a.current);
			const aux = { ...a.current,}
			setAttacks((b) => Object.fromEntries(Object.entries(b).map(([n, [, ...d],]) => [n , [...d, aux[n as Prediction['attackType']], ],])) as any)
			a.current = Object.fromEntries(Object.entries(a.current).map(([n,]) => [n, 0,])) as { [P in Prediction['attackType']]: number };
		});

		return () => abort.abort();
	}, []);

	const transformToChartData = () => {
		return Object.entries(attacks).map(([name, data,]) => ({ name, data, }));
	}

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
					Attacks in the last 5 minutes
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
			<Flex w='100%' flexDirection={{ base: 'column', lg: 'row', }}>
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
				<Box minH='260px' w='1500px' mt='auto'>
					<LineChart chartData={transformToChartData()} chartOptions={lineChartOptions} />
				</Box>
			</Flex>
		</Card>
	);
}
