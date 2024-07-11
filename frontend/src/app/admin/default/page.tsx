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

import { Box, Icon, SimpleGrid, useColorModeValue, } from '@chakra-ui/react';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdBarChart, MdOutlinePercent, } from 'react-icons/md';
import { getDailyAttacksCount, getAttackTypePercentages, } from 'statisticsRequests';
import { useEffect, useState, } from 'react';
import AttacksInTheLast5Min from 'views/admin/default/components/AttacksInTheLast5Min';
import { AttackTypePercentages, } from 'types/statistics';
import MapChart from 'views/admin/default/components/MapChart';
import { WebsocketClient, } from 'socket';
import { AttackTypes, Prediction, } from 'types/predictions';
import PieCard from 'views/admin/default/components/PieCard';

export default function Default() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const [dailyAttackCounter, setDailyAttackCounter,] = useState<number>(0);
  const [dailyNonAttacksCounter, setDailyNonAttacksCounter,] = useState<number>(0);
  const [attackTypeCounter, setAttackTypeCounter,] = useState<Partial<AttackTypePercentages>>({});

  useEffect(() => {
    // getAttacksVSNonAttacksCount().then((a) => setAttacksVSNonAttacksCount(a));
    // getDailyAttacksCount().then((a) => setDailyAttacks(a));
    // getAttackTypePercentages().then((a) => setAttacktypepercentages(a));

    WebsocketClient.addListener((p: string) => {
			try {
				const {attackType, attack,}: Prediction = JSON.parse(p);
				if (attack) {
          setDailyAttackCounter((counter) => counter + 1)
          setAttackTypeCounter((p) => ({ ...p, [attackType]: (p[attackType] || 0) + 1, }))
        }
        else setDailyNonAttacksCounter((p) =>   p + 1);
			} catch (error) {
        
			}
		})
  }, []);


  const attacksVSNonAttacksCountChartOptions: any = {
    labels: ["Attacks", "Non Attacks",],
    colors: ["#4318FF", "#6AD2FF",],
    chart: {
      width: "50px",
      animations: {
			  enabled: false,
		  },
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
      colors: ["#4318FF", "#6AD2FF", "#EFF4FB",],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };

  const attacktypepercentagesChartOptions: any = {
    labels: AttackTypes,
    colors: ["#4318FF", "#6AD2FF",],
    chart: {
      width: "50px",
      animations: {
			  enabled: false,
		  },
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

  console.log(AttackTypes.map((t) => attackTypeCounter[t] || 0));
  
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px', }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 6, }}
        gap="20px"
        mb="20px"
      >
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
          value={dailyAttackCounter}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdOutlinePercent} color={brandColor} />
              }
            />
          }
          name="Malicious Traffic Today"
          value={(dailyAttackCounter / (dailyAttackCounter + dailyNonAttacksCounter) * 100).toFixed(2)}
        />
      </SimpleGrid>

      <MapChart />


      <SimpleGrid columns={{ base: 1, md: 2, xl: 2, }} gap="20px" mb="20px">
        <AttacksInTheLast5Min />
      </SimpleGrid>


      <SimpleGrid columns={{ base: 1, md: 1, xl: 2, }} gap="20px" mb="20px">
        <PieCard pieChartData={[dailyAttackCounter, dailyNonAttacksCounter,]} pieChartOptions={attacksVSNonAttacksCountChartOptions } title='Attacks VS Non Attacks' />
        <PieCard pieChartData={AttackTypes.map((t) => attackTypeCounter[t] || 0)} pieChartOptions={attacktypepercentagesChartOptions} title='Attacks by Type' />
      </SimpleGrid>

      <div id="predictions"></div>
    </Box>
  );
}
