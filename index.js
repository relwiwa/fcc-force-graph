import React from 'react';
import { render } from 'react-dom';

import '../../../styles/global-styles.scss';
import NationalContiguityGraph from './components/national-contiguity-graph';

render(
  <NationalContiguityGraph />,
  document.getElementById('root')
);
