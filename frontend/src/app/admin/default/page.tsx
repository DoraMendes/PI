'use client';
/*!
  _   _  ___  ____  ___ ________  _   _   _   _ ___   
 | | | |/ _ \|  _ \|_ _|__  / _ \| \ | | | | | |_ _| 
 | |_| | | | | |_) || |  / / | | |  \| | | | | || | 
 |  _  | |_| |  _ < | | / /| |_| | |\  | | |_| || |
 |_| |_|\___/|_| \_\___/____\___/|_| \_|  \___/|___|
                                                                                                                                                                                                                                                                                                                                       
=========================================================
* Horizon UI - v1.1.0
=========================================================

* Product Page: https://www.horizon-ui.com/
* Copyright 2022 Horizon UI (https://www.horizon-ui.com/)

* Designed and Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import {
  Box,
  Flex,
  FormLabel,
  Image,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
// Custom components
// import MiniCalendar from 'components/calendar/MiniCalendar';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from 'react-icons/md';
import CheckTable from 'views/admin/default/components/CheckTable';
import ComplexTable from 'views/admin/default/components/ComplexTable';
import DailyTraffic from 'views/admin/default/components/DailyTraffic';
import PieCard from 'views/admin/default/components/PieCard';
import Tasks from 'views/admin/default/components/Tasks';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import tableDataCheck from 'views/admin/default/variables/tableDataCheck';
import tableDataComplex from 'views/admin/default/variables/tableDataComplex';
// Assets
import Usa from 'img/dashboards/usa.png';
import { getAttacksVSNonAttacksCount, getDailyAttacksCount, getAttackTypePercentages } from 'statisticsRequests';
import { useEffect, useState } from 'react';
import AttacksLastMonth from 'views/admin/default/components/AttacksLastMonth';
import { AttackTypePercentages, AttackVSNonAttack } from 'types/statistics';
import MapChart from 'views/admin/default/components/MapChart';

export default function Default() {
  // Chakra Color Mode

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const [attacksVSNonAttacksCount, setAttacksVSNonAttacksCount] = useState<AttackVSNonAttack | null>(null);
  const [dailyAttacks, setDailyAttacks] = useState(0);
  const [attacktypepercentages, setAttacktypepercentages] = useState<AttackTypePercentages[]>([]);

  useEffect(() => {
    getAttacksVSNonAttacksCount().then((a) => setAttacksVSNonAttacksCount(a));
    getDailyAttacksCount().then((a) => setDailyAttacks(a));
    getAttackTypePercentages().then((a) => setAttacktypepercentages(a));
  }, [])
  
  console.log('attacksVSNonAttacksCount', attacksVSNonAttacksCount);
  console.log('dailyAttacks', dailyAttacks);
  console.log('attacktypepercentages', attacktypepercentages);

  const attacksVSNonAttacksCountChartData = [attacksVSNonAttacksCount ? attacksVSNonAttacksCount.attacks : 0, attacksVSNonAttacksCount ? attacksVSNonAttacksCount.nonAttacks : 0];
  
  const attacktypepercentagesChartData = () => {
		const aux = [];

		attacktypepercentages.forEach((a) => {
			aux.push(a.count);
		})
		return aux;
	}

  const attacksVSNonAttacksCountChartOptions = {
    labels: ["Attacks", "Non Attacks"],
    colors: ["#4318FF", "#6AD2FF"],
    chart: {
      width: "50px",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: ["#4318FF", "#6AD2FF", "#EFF4FB"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };

  const attacktypepercentagesChartOptions = {
    labels: attacktypepercentages.map((a) => a.type),
    colors: ["#4318FF", "#6AD2FF"],
    chart: {
      width: "50px",
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      donut: {
        expandOnClick: false,
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: ["#4318FF", "#6AD2FF", "#EFF4FB", "#b2df8a", "#fb9a99", "#fdbf6f", "#cab2d6", "#6a3d9a", "#99ffcc", "#cc99ff", "#ffffcc", "#99ffcc"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }}
        gap="20px"
        mb="20px"
      >
        {/* dailyattackcounts - number -> card */}
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
              }
            />
          }
          name="Attacks today"
          value={dailyAttacks}
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <AttacksLastMonth />
      </SimpleGrid>

      <p>olssss</p>
      <MapChart />
      
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <PieCard pieChartData={attacksVSNonAttacksCountChartData} pieChartOptions={attacksVSNonAttacksCountChartOptions} title='Attacks VS Non Attacks' />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <PieCard pieChartData={attacktypepercentagesChartData()} pieChartOptions={attacktypepercentagesChartOptions} title='Attacks by Type' />
        </SimpleGrid>

      </SimpleGrid>
    </Box>
  );
}
