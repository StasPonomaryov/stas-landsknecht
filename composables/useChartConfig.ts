export function useChartConfig() {
  const chartSize = { width: 300, height: 300 };
  const chartMargin = { top: 20, right: 20, bottom: 20, left: 20 };
  const tooltipConfig = {
    borderColor: "#48CAE4",
    defaultColors: {
      primary: '#0077b6',
      secondary: 'red'
    }
  };

  return {
    chartSize,
    chartMargin,
    tooltipConfig
  };
}