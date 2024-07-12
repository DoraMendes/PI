'use client';
import { useState } from 'react';
import Calendar, { OnChangeDateRangeCallback } from 'react-calendar';
import { Text, Icon } from '@chakra-ui/react';
import 'react-calendar/dist/Calendar.css';
// Chakra imports
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
// Custom components
import Card from 'components/card/Card';

export default function MiniCalendar(props: {
  selectRange: boolean;
  onChange(values: [Date] | [Date, Date]): void;
  [x: string]: any;
}) {
  const { selectRange, onChange: onChangeParent, ...rest } = props;
  const [value, onChange] = useState(new Date());
  return (
    <Card
      alignItems="center"
      flexDirection="column"
      w="100%"
      maxW="max-content"
      p="20px 15px"
      h="max-content"
      {...rest}
    >
      <Calendar
        onChange={(a: [Date] | [Date, Date]) => { onChange(a as any); onChangeParent(a); }}
        value={value}
        selectRange={selectRange}
        view={'month'}
        formatShortWeekday={(locale, date) => [ `S`, `M`, `T`, `W`, `T`, `F`, `S` ][date.getDay()]}
        tileContent={<Text color="brand.500" />}
        prevLabel={<Icon as={MdChevronLeft} w="24px" h="24px" mt="4px" />}
        nextLabel={<Icon as={MdChevronRight} w="24px" h="24px" mt="4px" />}
      />
    </Card>
  );
}
