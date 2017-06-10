import React from 'react';

const ForceGraphTooltip = (props) => {
  const { chartWidth, currNode } = props;
  const tooltipWidth = 100;
  const tooltipPadding = 4;
  const tooltipOffsetX = 20;
  const tooltipOffsetY = 10;
  const tooltipPositionY = currNode.y - tooltipOffsetY;

  const calculateTooltipPositionX = () => {
    let positionX = currNode.x + tooltipOffsetX;
    const overflowX = chartWidth - currNode.x - tooltipOffsetX - tooltipWidth;
    if (overflowX <= 0) {
      positionX = currNode.x - (tooltipOffsetX + tooltipWidth);
    }
    return positionX;
  };

  const tooltipPositionX = calculateTooltipPositionX();

  return (
    <div
      style={{
        position: 'absolute',
        fontSize: '10px',
        top: tooltipPositionY,
        left: tooltipPositionX,
        width: tooltipWidth + 'px',
        padding: tooltipPadding + 'px',
        zIndex: 500,
        color: '#1779ba',
        fontWeight: 'bold',
        background: 'rgba(190, 190, 190, 0.7)',
      }}
    >
      {currNode.country}
    </div>
  )
}

export default ForceGraphTooltip;
