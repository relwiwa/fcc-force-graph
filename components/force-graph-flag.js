import React from 'react';

//  Sprite with flags taken from https://www.flag-sprites.com/
import '../sprites/flags.min.css';
import flagsSprite from '../sprites/flags.png';

const ForceGraphFlag = (props) => {
  const { nodeData, onMouseEnter, onMouseLeave } = props;

  return (
    <img
      style={{
        position: 'absolute',
        top: nodeData.y - 7.5,
        left: nodeData.x - 12.5,
        borderRadius: '100%',
        border: '1px solid #1779ba'
      }}
      width="25"
      height="15"
      className={'flag flag-' + nodeData.code}
      onMouseEnter={() => onMouseEnter(nodeData)}
      onMouseLeave={onMouseLeave}
    />
  )
}

export default ForceGraphFlag;
