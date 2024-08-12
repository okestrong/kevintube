import Transition from '@/components/Transition';
import { PropsWithChildren, ReactNode } from 'react';

interface Props extends PropsWithChildren {
   modal: ReactNode;
}

const IndexLayout = ({ children, modal }: Props) => {
   return (
      <div className="w-screen h-screen overflow-hidden">
         <Transition>{children}</Transition>
         {modal}
      </div>
   );
};

export default IndexLayout;
