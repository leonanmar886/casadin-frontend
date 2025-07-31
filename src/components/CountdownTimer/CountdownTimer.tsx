import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

interface CountdownTimerProps {
  targetDate: string; // Data no formato "29 de Abril de 2026 às 16h"
  size?: 'small' | 'medium' | 'large';
}

interface TimeLeft {
  days: number;
  months: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate, 
  size = 'medium' 
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    months: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Função para converter a data brasileira para Date
  const parseBrazilianDate = (dateString: string): Date => {
    const months: { [key: string]: number } = {
      'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
      'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
      'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
    };

    // Extrair informações da string "29 de Abril de 2026 às 16h"
    const match = dateString.match(/(\d+)\s+de\s+(\w+)\s+de\s+(\d+)\s+às\s+(\d+)h/);
    
    if (match) {
      const [, day, month, year, hour] = match;
      const monthIndex = months[month.toLowerCase()];
      
      if (monthIndex !== undefined) {
        return new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hour), 0, 0);
      }
    }
    
    // Fallback: retorna data atual + 1 ano se não conseguir parsear
    const fallbackDate = new Date();
    fallbackDate.setFullYear(fallbackDate.getFullYear() + 1);
    return fallbackDate;
  };

  // Função para calcular a diferença de tempo
  const calculateTimeLeft = (target: Date): TimeLeft => {
    const now = new Date();
    const difference = target.getTime() - now.getTime();

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return {
        days: remainingDays,
        months,
        hours,
        minutes,
        seconds
      };
    }

    return {
      days: 0,
      months: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
  };

  useEffect(() => {
    const targetDateObj = parseBrazilianDate(targetDate);
    
    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft(targetDateObj));
    };

    // Atualizar imediatamente
    updateTimer();

    // Atualizar a cada segundo
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Configurações de tamanho
  const sizeConfig = {
    small: {
      fontSize: 16,
      fontWeight: 600,
      numberSize: 24,
      gap: 12
    },
    medium: {
      fontSize: 18,
      fontWeight: 600,
      numberSize: 28,
      gap: 16
    },
    large: {
      fontSize: 22,
      fontWeight: 600,
      numberSize: 32,
      gap: 20
    }
  };

  const config = sizeConfig[size];

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ 
        fontSize: config.fontSize, 
        fontWeight: config.fontWeight, 
        marginBottom: 5 
      }}>
        CONTAGEM REGRESSIVA
      </Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: config.gap 
      }}>
        <Box>
          <Box sx={{ fontSize: config.numberSize, fontWeight: 700 }}>
            {timeLeft.months.toString().padStart(2, '0')}
          </Box>
          <Box>Meses</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: config.numberSize, fontWeight: 700 }}>
            {timeLeft.days.toString().padStart(2, '0')}
          </Box>
          <Box>Dias</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: config.numberSize, fontWeight: 700 }}>
            {timeLeft.hours.toString().padStart(2, '0')}
          </Box>
          <Box>Horas</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: config.numberSize, fontWeight: 700 }}>
            {timeLeft.minutes.toString().padStart(2, '0')}
          </Box>
          <Box>Minutos</Box>
        </Box>
        <Box>
          <Box sx={{ fontSize: config.numberSize, fontWeight: 700 }}>
            {timeLeft.seconds.toString().padStart(2, '0')}
          </Box>
          <Box>Segundos</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CountdownTimer; 