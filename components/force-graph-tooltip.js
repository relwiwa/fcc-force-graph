import React from 'react';

import { colors } from '../../../config/styles';

import '../sprites/flags.min.css';
import flagsSprite from '../sprites/flags.png';

const ForceGraphTooltip = (props) => {
  const { chartWidth, currNode } = props;
  const tooltipWidth = 120;
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
        fontSize: '12px',
        top: tooltipPositionY,
        left: tooltipPositionX,
        width: tooltipWidth + 'px',
        padding: tooltipPadding + 'px',
        zIndex: 500,
        color: colors.primary,
        fontWeight: 'bold',
        background: 'rgba(190, 190, 190, 0.7)',
      }}
    >
      <img
        width="25"
        height="15"
        className={'flag flag-' + currNode.code} /><br />
      {currNode.country}
    </div>
  )
}

export default ForceGraphTooltip;
