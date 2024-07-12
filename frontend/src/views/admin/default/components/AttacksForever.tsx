'use client';

import { Box, Button, Flex, Icon, Text, useColorModeValue, } from '@chakra-ui/react';
import Card from 'components/card/Card';
import LineChart from 'components/charts/LineChart';
import { DateTime, } from 'luxon';
import { useEffect, useRef, useState } from 'react';
import { MdBarChart, MdOutlineCalendarToday, } from 'react-icons/md';
import { Prediction, } from 'types/predictions';
import { getTranslation } from 'utils/utils';

export default function AttacksForever(props: { [x: string]: any } & { predictions: Prediction[] }) {
	const { predictions, ...rest } = props;

	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const textColorSecondary = useColorModeValue('secondaryGray.600', 'white');
	const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const iconColor = useColorModeValue('brand.500', 'white');
	const bgButton = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
	const bgHover = useColorModeValue({ bg: 'secondaryGray.400', }, { bg: 'whiteAlpha.50', });
	const bgFocus = useColorModeValue({ bg: 'secondaryGray.300', }, { bg: 'whiteAlpha.100', });
	
	const workerRef = useRef(new Worker("/workerAttackTypeSecondsGroupped.js")); 
	const [data, setData] = useState<{name: string, data: number[]}[]>([]);

	useEffect(() => {
		workerRef.current.postMessage(predictions);
		workerRef.current.onmessage = ({ data }) => setData(
			data.map(([attackType, seconds]: [string, number[][]]) => ({ name: attackType, data: seconds.map((s) => s.length), }))
		);
	}, [predictions])

	const lineChartOptions = {
		colors: ["#4318FF", "#39B8FF", "#08fe71", "#aed124", "#48d0b4", "#2c476e", "#dd3938", "#cf00d0", "#8b1d46"],
		chart: {
		  type: "line",
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
		  tickAmount: 8,
		  categories: data.map((_, i) => i),
		  labels: {
		  	rotate: 0,
			style: {  colors: "#A3AED0",  fontSize: "12px",  fontWeight: "500",},
			formatter: function(value: string) {
				return DateTime.fromISO(predictions.at(-1).createdDate).minus({ seconds: (data[0].data.length - +(value || 0)), }).toRelative()
			},
		  },
		  axisBorder: { show: false, },
		  axisTicks: {	show: false,  },
		},
		// color: ["#7551FF", "#39B8FF"],
	};
	
	return (
		<Card justifyContent='center' alignItems='center' flexDirection='column' w='100%' mb='0px'>
			<Flex justify='space-between' ps='0px' pe='20px' pt='5px' w='100%' alignItems='center'>
				<Text
					me='auto'
					color={textColor}
					fontSize='xl'
					fontWeight='700'
					lineHeight='100%'
					whiteSpace='nowrap'
				>
					Attacks Timeline
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
				<Box minH='260px' w='100%' mt='auto'>
					<LineChart chartData={data.map(({data, name}) => ({ data, name: getTranslation(name) }))} chartOptions={lineChartOptions} />
				</Box>
			</Flex>
		</Card>
	);
}
