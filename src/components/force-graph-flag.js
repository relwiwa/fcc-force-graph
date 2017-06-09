import React from 'react';

//  Sprite with flags taken from https://www.flag-sprites.com/
import '../sprites/flags.min.css';
import flagsSprite from '../sprites/flags.png';

const ForceGraphFlag = (props) => {
  const { nodeData } = props;

  return (
    <img
      style={{
        position: 'absolute',
        top: nodeData.y - 5,
        left: nodeData.x - 8
      }}
      width="16"
      height="10"
      className={'flag flag-' + nodeData.code}
    />
  )
}

export default ForceGraphFlag;
