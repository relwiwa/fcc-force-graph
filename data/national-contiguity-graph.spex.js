const SPEX = {
  chart: {
    breakpoints: {
      small: 640,
      medium: 1024,
    },
    ratioFactorHorizontal: 0.7,
    ratioFactorVertical: {
      small: 2.2,
      medium: 1.2,
      large: 1.2
    }
  },
  simulation: {
    forceCharge: {
      basicFactors: {
        strength: -1200,
        distanceMin: 15,
        distanceMax: 60
      },
      resizeFactors: {
        strength: 0.00065,
        distanceMax: 0.001
      }
    },
    restartTimeout: 200,
    stati: {
      notStarted: 'not-started',
      calculationOngoing: 'calculation-ongoing',
      calculationEnded: 'calculation-ended',
      stopped: 'stopped'
    },
    updateFactor: 5
  }
};

export default SPEX;
