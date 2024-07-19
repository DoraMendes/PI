'use client';

import React from 'react';
import { Box, Flex, Input, Progress, Spinner, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
import {
	Column,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	RowData,
	SortingState,
	useReactTable
} from '@tanstack/react-table';
import Card from 'components/card/Card';
import Menu from 'components/menu/MainMenu';
import { AndroidLogo, AppleLogo, WindowsLogo } from 'components/icons/Icons';
import { AttackTypes, FiltersHistory, Prediction, Protocols } from 'types/predictions';
import { getFilteredPredictions, getPredictions } from 'predictionsRequests';
import { getAttackName, getTranslation } from 'utils/utils';
import MiniCalendar from 'components/calendar/MiniCalendar';
import axios from 'axios';
import { filteredPredictionsURL } from 'services/predictions';
import MultiSelectMenu from 'components/muliSelect';
import { DateTime } from 'luxon';


export default function DataTables() {
	const columnHelper = createColumnHelper<Prediction>();

	const [ sorting, setSorting ] = React.useState<SortingState>([{id: "createdDate", desc: true}]);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const iconColor = useColorModeValue('secondaryGray.500', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

	const [predictions, setPredictions,] = React.useState<Prediction[]>([]);

	React.useEffect(() => {
		getFilteredPredictions().then((a) => setPredictions(a));
	}, []);
	
	const columns = [
		columnHelper.accessor('attackType', {
			id: 'attackType',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					ATTACK TYPE
				</Text>
			),
			meta: {
				filterVariant: 'select',
			},
			cell: (info: any) => (
				<Flex align='center'>
					<Text color={textColor} fontSize='sm' fontWeight='700'>
						{getAttackName(info.getValue())}
					</Text>
				</Flex>
			)
		}),
		columnHelper.accessor('protocol', {
			id: 'protocol',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					PROTOCOL
				</Text>
			),
			cell: (info) => (
				<Flex align='center'>
					{info.getValue()}
				</Flex>
			),
			meta: {
				filterVariant: 'select',
			},
		}),
		columnHelper.accessor('createdDate', {
			id: 'createdDate',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					DATE
				</Text>
			),
			cell: (info) => (
				<Text color={textColor} fontSize='sm' fontWeight='700'>
					{DateTime.fromISO(info.getValue()).toRelative()}
				</Text>
			)
		}),
		columnHelper.accessor('sourceIp', {
			id: 'sourceIp',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					SOURCE IP
				</Text>
			),
			cell: (info) => (
				<Flex align='center'>
					<Text me='10px' color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue()}
					</Text>
				</Flex>
			)
		}),
		columnHelper.accessor('destinationIp', {
			id: 'destinationIp',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					DESTINATION IP
				</Text>
			),
			cell: (info) => (
				<Flex align='center'>
					<Text me='10px' color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue()}
					</Text>
				</Flex>
			)
		}),
		columnHelper.accessor('attack', {
			id: 'attack',
			header: () => (
				<Text
					justifyContent='space-between'
					align='center'
					fontSize={{ sm: '10px', lg: '12px' }}
					color='gray.400'>
					ATTACK
				</Text>
			),
			cell: (info) => (
				<Flex align='center'>
					<Text me='10px' color={textColor} fontSize='sm' fontWeight='700'>
						{info.getValue() === true ? '✅' : '❌'}
					</Text>
				</Flex>
			),
			meta: {
				filterVariant: 'select',
			},
		})
	];

	// const theme = useTheme();
	// function getStyles(name: string, personName: readonly string[], theme: Theme) {
	// return {
	// 	fontWeight:
	// 	personName?.indexOf(name) === -1
	// 		? theme.typography.fontWeightRegular
	// 		: theme.typography.fontWeightMedium,
	// };
	// }
	// const MenuProps = {
	// PaperProps: {
	// 	style: {
	// 	maxHeight: 48 * 4.5 + 4,
	// 	width: 250,
	// 	},
	// },
	// };


	const [isOpenCalendar, setIsOpenCalendar] = React.useState(false);

	const previousFilters = React.useRef<Partial<FiltersHistory>>({});
	const [filters, setFilters] = React.useState<Partial<FiltersHistory>>({});
	const [isFetching, setIsFetching] = React.useState<boolean>(false);

	const handleOnFilter = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const { selectedDateRange, selectedAttack, selectedAttackType, selectedDestinationIP, selectedProtocol, selectedSourceIP} = filters
		setIsFetching(true);
		previousFilters.current = filters;

		getFilteredPredictions({
			attackType: selectedAttackType, 
			protocol: selectedProtocol,
			isAttack: selectedAttack, 
			sourceIpStartsWith: selectedSourceIP, 
			destinationIpStartsWith: selectedDestinationIP,  
			dateMin: selectedDateRange?.start, 
			dateMax: selectedDateRange?.end
		}).then((p) => {
			setPredictions(p);
			setIsFetching(false);
		})
	}

	const renderFilters = () => {
		return (
			<form className='filters' onSubmit={(e) => handleOnFilter(e)}>
				<div className='filters__row'>
					<p>Traffic Type</p>
					{/* <MultipleSelect /> */}
					{/* <select
						name="attack"
						id='attack'
						value={selectedAttack}
						onChange={(e) => setFilters({...filters, selectedAttack: e.currentTarget.value === 'true' ? true : false})}
					>
						<option value="all">All</option>
						<option value="true">Malicious</option>
						<option value="false">Normal</option>
					</select> */}
					<Stack spacing={4}>
						<MultiSelectMenu onChange={(values) => setFilters({...filters, selectedAttack: values as unknown as boolean[]})} label={filters.selectedAttack?.map((a) => getTranslation(String(a))).join(', ') || "Both"} options={['false', 'true']} />
					</Stack>
				</div>
				<div className='filters__row filters__row--date'>
					<p>Date</p>
					<button
						type='button'
						onClick={() => setIsOpenCalendar(!isOpenCalendar)}
					>
						<Stack spacing={4}>
							<Flex gap="20px">
								<Input variant='outline' placeholder='Start' value={filters.selectedDateRange?.start && DateTime.fromISO(filters.selectedDateRange.start).toRelative()}/>
								<Input variant='outline' placeholder='End' value={filters.selectedDateRange?.end && DateTime.fromISO(filters.selectedDateRange.end	).toRelative()} />
							</Flex>
						</Stack>
					</button>
					{isOpenCalendar && (
						<MiniCalendar
							onChange={([a, b]) => setFilters({ ...filters, selectedDateRange: b ? { end: b.toISOString(), start: a.toISOString()} : { end: a.toISOString(), start: a.toISOString() } })} 
							selectRange
						/>
					)}
				</div>
				<div className='filters__row'>
					<p>Protocol</p>
					<Stack spacing={4}>
						<MultiSelectMenu onChange={(values) => setFilters({...filters, selectedProtocol: values})} label={filters.selectedProtocol?.join(', ') || 'All'} options={Protocols} />
					</Stack>

				</div>
				<div className='filters__row'>
					<p>Source IP</p>
					{/* <input
						value={selectedSourceIP}
						onChange={(e) => setFilters({...filters, selectedSourceIP: e.target.value})}
						name='source-ip'
					/> */}
					<Stack spacing={3}>
						<Input variant='outline' placeholder='0.0.0.0' value={filters.selectedSourceIP} onChange={(e) => setFilters({...filters, selectedSourceIP: e.target.value})} />
					</Stack>
				</div>
				<div className='filters__row'>
					<p>Destination IP</p>
					{/* <input
						value={selectedDestinationIP}
						onChange={(e) => setFilters({...filters, selectedDestinationIP: e.target.value})}
						name='destination-ip'
					/> */}
					<Stack spacing={3}>
						<Input variant='outline' placeholder='0.0.0.0'  value={filters.selectedDestinationIP} onChange={(e) => setFilters({...filters, selectedDestinationIP: e.target.value})}/>
					</Stack>
				</div>
				<div className='filters__row'>
					<p>Attack Type</p>
					{/* <select
						name="attack-type"
						id='attack-type'
						value={selectedAttackType}
						onChange={(e) => setFilters({...filters, selectedAttackType: [e.currentTarget.value] as (typeof AttackTypes)[number][]})}
					>
						<option value="all">All</option>
						<option value="UNKNOWN">Unknown</option>
						<option value="APACHE_KILLER">Apache Killer</option>
						<option value="RUDY">Rudy</option>
						<option value="SLOW_READ">Slow Read</option>
						<option value="SLOW_LORIS">Slow Loris</option>
						<option value="ARP_SPOOFING">ARP Spoofing</option>
						<option value="CAM_OVERFLOW">CAM Overflow</option>
						<option value="MQTT_MALARIA">MQTT Malaria</option>
						<option value="NETWORK_SCAN">Network Scan</option>
					</select> */}
					<Stack spacing={4}>
						<MultiSelectMenu onChange={(values) => setFilters({...filters, selectedAttackType: values as typeof AttackTypes[number][]})} label={filters.selectedAttackType?.map(getTranslation).join(', ') || 'All'} options={[...AttackTypes]} />
					</Stack>
				</div>
				<button type='submit' style={{
					background: JSON.stringify(previousFilters.current) === JSON.stringify(filters) ? '' : 'blue'
				}}>
					Filter
				</button>
			</form>
		)
	}

	const table = useReactTable({
			data: predictions,
			columns,
			state: {
				sorting,
				// columnFilters
			},
			onSortingChange: setSorting,
			getCoreRowModel: getCoreRowModel(),
			getSortedRowModel: getSortedRowModel(),
			// onColumnFiltersChange: setColumnFilters,
			// getFilteredRowModel: getFilteredRowModel(),
			debugTable: true,
	});

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        {/* <DevelopmentTable tableData={tableDataDevelopment} /> */}

		<Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
			<Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
				<Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
					Historic Values
				</Text>
				{renderFilters()}
			</Flex>
			<Box style={{ position: "relative", opacity: isFetching ? .5 : 1 }}>
				{isFetching && <Spinner style={{ position: "absolute", left: "50%", top: "50%" }} zIndex={1000000} />}
				<Table variant='simple' color='gray.500' mb='24px' mt="12px">
					<Thead>
						{table.getHeaderGroups().map((headerGroup) => (
							<Tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<>


										<Th
											key={header.id}
											colSpan={header.colSpan}
											pe='10px'
											borderColor={borderColor}
											cursor='pointer'
											onClick={header.column.getToggleSortingHandler()}
											>
											<Flex
												justifyContent='space-between'
												align='center'
												fontSize={{ sm: '10px', lg: '12px' }}
												color='gray.400'
												>
												{flexRender(header.column.columnDef.header, header.getContext())}{{
													asc: ' 🔼',
													desc: ' 🔽',
												}[header.column.getIsSorted() as string] ?? null}
											</Flex>
											{/* {header.column.getCanFilter() ? (
											<div>
												<Filter column={header.column} />
											</div>
											) : null} */}
										</Th>
										</>
									);
								})}
							</Tr>
						))}
					</Thead>
					<Tbody>
						{table.getRowModel().rows.slice(0, 11).map((row) => {
							return (
								<>
								<Tr key={row.id}>
									{row.getVisibleCells().map((cell) => {
										return (
											<Td
												key={cell.id}
												fontSize={{ sm: '14px' }}
												minW={{ sm: '150px', md: '200px', lg: 'auto' }}
												borderColor='transparent'>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</Td>
										);
									})}
								</Tr>
								</>
							);
						})}
					</Tbody>
				</Table>
			</Box>
		</Card>

    </Box>
  );
}
