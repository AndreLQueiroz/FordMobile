// Tempo fixo da corrida
const FIXED_LAP_TIME = 50; // segundos

// Consumo médio simulado em litros por segundo
const FORD_CONSUMPTION_RATE = 0.08;
const CHEVROLET_CONSUMPTION_RATE = 0.12;

export const calculateEmissions = (completed) => {
  if (!completed) {
    return {
      f1Emission: 0,
      feEmission: 0,
      difference: 0,
    };
  }

  const fordGas = FIXED_LAP_TIME * FORD_CONSUMPTION_RATE;
  const chevroletGas = FIXED_LAP_TIME * CHEVROLET_CONSUMPTION_RATE;
  const savedGas = chevroletGas - fordGas;

  return {
    f1Emission: Number(fordGas.toFixed(2)),
    feEmission: Number(chevroletGas.toFixed(2)),
    difference: Number(savedGas.toFixed(2)),
  };
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
};

export const parseTime = (timeString) => {
  const [minutePart, secondPart] = timeString.split(':');
  const [seconds, milliseconds = '0'] = secondPart.split('.');

  const mins = parseInt(minutePart, 10);
  const secs = parseInt(seconds, 10);
  const ms = parseInt(milliseconds.padEnd(3, '0'), 10);

  return mins * 60 + secs + ms / 1000;
};

export const getEnvironmentalImpact = (laps) => {
  const fordGas = laps * FIXED_LAP_TIME * FORD_CONSUMPTION_RATE;
  const chevroletGas = laps * FIXED_LAP_TIME * CHEVROLET_CONSUMPTION_RATE;
  const savedGas = chevroletGas - fordGas;

  return `Com ${laps} ${
    laps === 1 ? 'corrida' : 'corridas'
  }, você economizou aproximadamente ${savedGas.toFixed(
    2
  )} L de gasolina ao utilizar um carro da Ford em comparação com um carro da Chevrolet.`;
};