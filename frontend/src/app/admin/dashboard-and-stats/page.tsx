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
  Icon,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdBarChart } from 'react-icons/md';
import { useEffect, useRef, useState, } from 'react';
import AttacksForever from 'views/admin/default/components/AttacksForever';
import AttackVsNonAttacksForever from 'views/admin/default/components/AttacksVsNonAttacksPercentageForever';
import MapChartForever from 'views/admin/default/components/MapChartForever';
import { AttackTypes, Prediction } from 'types/predictions';
import { getAllPredictions, getAttackTypePercentages } from 'statisticsRequests';
import { DateTime } from 'luxon';
import PieCard from 'views/admin/default/components/PieCard';
import { AttackTypePercentages } from 'types/statistics';
import { getTranslation } from 'utils/utils';

export default function Default() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const attacksCount = useRef(0);
  const nonAttacksCount = useRef(0);
  const highestDate = useRef<DateTime>(DateTime.now());
  const attackTypeCount = useRef<Record<typeof AttackTypes[number], number>>({
    APACHE_KILLER: 0, ARP_SPOOFING: 0, CAM_OVERFLOW: 0, MQTT_MALARIA: 0, NETWORK_SCAN: 0, RUDY: 0, SLOW_LORIS: 0,
		SLOW_READ: 0, UNKNOWN: 0,
  });
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  
  useEffect(() => {
      getAllPredictions().then((newPredictions) => {
          const createdDateCountMap = new Map<string, number>();
          newPredictions
            .forEach(({ createdDate }) => createdDateCountMap.set(createdDate, (createdDateCountMap.get(createdDate) || 0) + 1));

          const auxMap = new Map<string, number>();
          newPredictions
            .forEach(({ attackType }) => auxMap.set(attackType, (auxMap.get(attackType) || 0) + 1));
          
          attackTypeCount.current = [...auxMap.entries()].reduce((acc, [k, v]) => ({...acc, [k]: v}), {}) as Record<typeof AttackTypes[number], number>;
          highestDate.current = DateTime.fromISO([...createdDateCountMap.keys()].reduce((a,b) => auxMap.get(a) > auxMap.get(b) ? a : b));
          attacksCount.current = newPredictions.filter((a) => a.attack).length;
          nonAttacksCount.current = newPredictions.length -  attacksCount.current;
          setPredictions(newPredictions);
      });
  }, []);

  const attacksVSNonAttacksCountChartOptions: any = {
    labels: ["Attacks", "Non Attacks",],
    colors: ["#4318FF", "#6AD2FF",],
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
    hover: { mode: null, },
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
      colors: ["#4318FF", "#6AD2FF",],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };

  const attacktypepercentagesChartOptions: any = {
    labels: AttackTypes.map((a) => getTranslation(a)),
    colors: ["#4318FF", "#6AD2FF", "#EFF4FB", "#b2df8a", "#fb9a99", "#fdbf6f", "#cab2d6", "#6a3d9a", "#99ffcc", "#cc99ff", "#ffffcc", "#99ffcc",],
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
    hover: { mode: null, },
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
      colors: ["#4318FF", "#6AD2FF", "#EFF4FB", "#b2df8a", "#fb9a99", "#fdbf6f", "#cab2d6", "#6a3d9a", "#99ffcc", "#cc99ff", "#ffffcc", "#99ffcc",],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }} display="grid" gap="40px">
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 4, }}
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
          name="Attacks"
          value={attacksCount.current}
        />
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
          name="Percentage of Bad Traffic"
          value={((attacksCount.current / (attacksCount.current + nonAttacksCount.current)) * 100).toFixed(2)}
        />
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
          name="Highest Day of Attacks"
          value={highestDate.current.setLocale("pt").toLocaleString(DateTime.DATE_MED)}
        />
      </SimpleGrid>

      <MapChartForever predictions={predictions || []} />

      <AttacksForever predictions={predictions || []} />
      <AttackVsNonAttacksForever predictions={predictions || []} />

      <SimpleGrid columns={{ base: 1, md: 1, xl: 2, }} gap="20px" mb="20px">
        <PieCard pieChartData={[attacksCount.current, nonAttacksCount.current]} pieChartOptions={attacksVSNonAttacksCountChartOptions} title='Attacks VS Non Attacks' />
        <PieCard pieChartData={AttackTypes.map((a) => attackTypeCount.current[a] || 0)} pieChartOptions={attacktypepercentagesChartOptions} title='Attacks by Type' />
      </SimpleGrid>
    </Box>
  );
}
