import { Box, Flex, Progress, Select, Table, Tbody, Td, Text, Th, Thead, Tr, useColorModeValue } from '@chakra-ui/react';
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
import * as React from 'react';
import { FiltersHistory, Prediction } from 'types/predictions';
import { getFilteredPredictions, getPredictions } from 'predictionsRequests';
import { getAttackName } from 'utils/utils';
import MiniCalendar from 'components/calendar/MiniCalendar';
import MultipleSelect from './MultipleSelect';

const columnHelper = createColumnHelper<Prediction>();

declare module '@tanstack/react-table' {
  //allows us to define custom properties for our columns
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: 'text' | 'range' | 'select'
  }
}

export default function ComplexTable(props: { tableData: any }) {
	const { tableData } = props;
	const [ sorting, setSorting ] = React.useState<SortingState>([{id: "createdDate", desc: true}]);
	const textColor = useColorModeValue('secondaryGray.900', 'white');
	const iconColor = useColorModeValue('secondaryGray.500', 'white');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
	let defaultData = tableData;
	
	const [predictions, setPredictions,] = React.useState<Prediction[]>([]);

	React.useEffect(() => {
		getFilteredPredictions().then((a) => setPredictions(a));
	}, [])
	console.log('predictions', predictions);
	
	console.log(predictions.map((a) => a.attack));
	
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
					{info.getValue()}
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

	const [selectedAttack, setSelectedAttack] = React.useState('');
	const [selectedProtocol, setSelectedProtocol] = React.useState('');
	const [selectedSourceIP, setSelectedSourceIP] = React.useState('');
	const [selectedDestinationIP, setSelectedDestinationIP] = React.useState('');
	const [selectedAttackType, setSelectedAttackType] = React.useState('');
	const [isOpenCalendar, setIsOpenCalendar] = React.useState(false);

	const [filters, setFilters] = React.useState<FiltersHistory | null>(null);
	
	const handleChangeAttack = (event) => {
		const { selectedAttack }= event.target;
		setSelectedAttack(selectedAttack);
	}

	const handleChangeProtocol = (event) => {
		const { selectedProtocol }= event.target;
		setSelectedProtocol(selectedProtocol);
	}

	const handleChangeSourceIP = (event) => {
		const { selectedSourceIP }= event.target;
		setSelectedSourceIP(selectedSourceIP);
	}

	const handleChangeDestinationIP = (event) => {
		const { selectedDestinationIP }= event.target;
		setSelectedDestinationIP(selectedDestinationIP);
	}

	const handleChangeAttackType = (event) => {
		const { selectedAttackType }= event.target;
		setSelectedAttackType(selectedAttackType);
	}
	
	const handleOnFilter = () => {
		// const filtersToSend = [...]
	}

	const renderFilters = () => {
		return (
			<div className='filters'>
				<div className='filters__row'>
					<p>Traffic</p>
					{/* <MultipleSelect /> */}
					<select
						name="attack"
						id='attack'
						value={selectedAttack}
						onChange={() => setFilters({...filters, selectedAttack: e.target})}
						>
						<option value="all">All</option>
						<option value="malicious">Malicious</option>
						<option value="normal">Normal</option>
					</select>
				</div>
				<div className='filters__row'>
					<p>Date</p>
					<button
						type='button'
						onClick={() => setIsOpenCalendar(!isOpenCalendar)}
					>
						Abrir
					</button>
					
					{isOpenCalendar && (
						<MiniCalendar 
							selectRange
						/>
					)}
				</div>
				<div className='filters__row'>
					<p>Protocol</p>
					<select
						name="protocol"
						id='protocol'
						value={selectedProtocol}
						onChange={handleChangeProtocol}
						>
						<option value="all">All</option>
						<option value="a">A</option>
						<option value="b">B</option>
					</select>
				</div>
				<div className='filters__row'>
					<p>Source IP</p>
					<input
						value={selectedSourceIP}
						onChange={handleChangeSourceIP}
						name='source-ip'
					/>
				</div>
				<div className='filters__row'>
					<p>Destination IP</p>
					<input
						value={selectedDestinationIP}
						onChange={handleChangeDestinationIP}
						name='destination-ip'
					/>
				</div>
				<div className='filters__row'>
					<p>Attack Type</p>
					<select
						name="attack-type"
						id='attack-type'
						value={selectedAttackType}
						onChange={handleChangeAttackType}
						>
						<option value="all">All</option>
						<option value="1">1</option>
						<option value="2">2</option>
					</select>
				</div>
				<button type='button' onClick={handleOnFilter}>
					Filter
				</button>
			</div>
		)
	}
	
	// function Filter({ column }: { column: Column<any, unknown> }) {
	// 	const columnFilterValue = column.getFilterValue()
	// 	const { filterVariant } = column.columnDef.meta ?? {}
	// 	const { id } = column.columnDef ?? {}

	// 	return filterVariant === 'range' ? (
	// 		<div>
	// 		<div className="flex space-x-2">
	// 			{/* See faceted column filters example for min max values functionality */}
	// 			<DebouncedInput
	// 			type="number"
	// 			value={(columnFilterValue as [number, number])?.[0] ?? ''}
	// 			onChange={value =>
	// 				column.setFilterValue((old: [number, number]) => [value, old?.[1]])
	// 			}
	// 			placeholder={`Min`}
	// 			className="w-24 border shadow rounded"
	// 			/>
	// 			<DebouncedInput
	// 			type="number"
	// 			value={(columnFilterValue as [number, number])?.[1] ?? ''}
	// 			onChange={value =>
	// 				column.setFilterValue((old: [number, number]) => [old?.[0], value])
	// 			}
	// 			placeholder={`Max`}
	// 			className="w-24 border shadow rounded"
	// 			/>
	// 		</div>
	// 		<div className="h-1" />
	// 		</div>
	// 	) : filterVariant === 'select' ? (
	// 		{id === 'attack' && (
	// 			<select
	// 				onChange={e => column.setFilterValue(e.target.value)}
	// 				value={columnFilterValue?.toString()}
	// 				>
	// 				{/* See faceted column filters example for dynamic select options */}
	// 				<option value="">All</option>
	// 				<option value="complicated">complicated</option>
	// 				<option value="relationship">relationship</option>
	// 				<option value="single">single</option>
	// 			</select>
	// 		)}
	// 		<select
	// 		onChange={e => column.setFilterValue(e.target.value)}
	// 		value={columnFilterValue?.toString()}
	// 		>
	// 		{/* See faceted column filters example for dynamic select options */}
	// 		<option value="">All</option>
	// 		<option value="complicated">complicated</option>
	// 		<option value="relationship">relationship</option>
	// 		<option value="single">single</option>
	// 		</select>
	// 	) : (
	// 		<DebouncedInput
	// 		className="w-36 border shadow rounded"
	// 		onChange={value => column.setFilterValue(value)}
	// 		placeholder={`Search...`}
	// 		type="text"
	// 		value={(columnFilterValue ?? '') as string}
	// 		/>
	// 		// See faceted column filters example for datalist search suggestions
	// 	)
	// }
	

	// function DebouncedInput({
	// 	value: initialValue,
	// 	onChange,
	// 	debounce = 500,
	// 	...props
	// 	}: {
	// 	value: string | number
	// 	onChange: (value: string | number) => void
	// 	debounce?: number
	// 	} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
	// 	const [value, setValue] = React.useState(initialValue)

	// 	React.useEffect(() => {
	// 		setValue(initialValue)
	// 	}, [initialValue])

	// 	React.useEffect(() => {
	// 		const timeout = setTimeout(() => {
	// 		onChange(value)
	// 		}, debounce)

	// 		return () => clearTimeout(timeout)
	// 	}, [value])

	// 	return (
	// 		<input {...props} value={value} onChange={e => setValue(e.target.value)} />
	// 	)
	// }

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
		<Card flexDirection='column' w='100%' px='0px' overflowX={{ sm: 'scroll', lg: 'hidden' }}>
			<Flex px='25px' mb="8px" justifyContent='space-between' align='center'>
				<Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
					Historic Values
				</Text>
				{renderFilters()}
			</Flex>
			<Box>
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
	);
}
