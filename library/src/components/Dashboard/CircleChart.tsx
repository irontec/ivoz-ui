interface CircleData {
  key?: string;
  percentage: string;
  color: string;
}

export interface CircleProps {
  offsetX?: number;
  offsetY?: number;
  radio?: number;
  width?: number;
  height?: number;
  data: Array<CircleData>;
}

export const CircleChart = (props: CircleProps) => {
  const {
    data,
    width = 250,
    height = 250,
    offsetX = 125,
    offsetY = 125,
    radio = 110,
  } = props;

  const circumference = Math.PI * 2 * radio;

  return (
    <svg width={width} height={height} style={{ display: 'flex' }}>
      {data.map((circleData, index) => {
        const circlePercentage = parseFloat(
          circleData.percentage.replace('%', '') as string
        );
        const segmentLength = (circumference * circlePercentage) / 100;

        return (
          <circle
            key={`${circleData.color}-${index}`}
            cx={offsetX}
            cy={offsetY}
            r={radio}
            fill='transparent'
            stroke={circleData.color}
            strokeWidth='25'
            strokeDasharray={`${segmentLength} ${
              circumference - segmentLength
            }`}
            strokeDashoffset={`-${index * segmentLength}`}
          />
        );
      })}
    </svg>
  );
};
