'use client';

import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TransitionProps {
   children: ReactNode | ReactNode[];
}

const Transition: FC<TransitionProps> = ({ children }) => {
   return (
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ease: 'easeInOut', duration: 0.75 }} className="w-full h-full">
         {children}
      </motion.div>
   );
};

export default Transition;
