import { getRandomDelay, randomDuration } from '~/helpers/utils';

export const DEFAULT_LABEL_WIDTH = 140;

export const APPBAR_HEIGHT = 70;

export const YOUTUBE_PLAY_URL = 'https://www.youtube.com/watch?v=';

export const shakeVariants = {
   start: (i: number) => ({
      rotate: i % 2 === 0 ? [-1, 1.3, 0] : [1, -1.4, 0],
      transition: {
         delay: getRandomDelay(),
         repeat: Infinity,
         duration: randomDuration(),
      },
   }),
   reset: {
      rotate: 0,
   },
};

export const shakeScaleVariants = {
   start: (i: number) => ({
      rotate: i % 2 === 0 ? [-1, 1.3, 0] : [1, -1.4, 0],
      scale: i % 2 === 0 ? 1.2 : 1,
      transition: {
         delay: getRandomDelay(),
         repeat: Infinity,
         duration: randomDuration(),
      },
   }),
   reset: {
      rotate: 0,
      scale: 1,
   },
};
