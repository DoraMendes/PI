'use client';
import dynamic from 'next/dynamic';
// import Chart from 'react-apexcharts';
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const LineChart = (props: any) => {
  const { chartData, chartOptions, type } = props;

  return (
    <Chart
      options={chartOptions}
      type={type || "line"}
      width="100%"
      height="100%"
      series={chartData}
    />
  );
};

export default LineChart;
