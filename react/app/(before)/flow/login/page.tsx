import { NextPage } from 'next';
import LoginModal from '@/app/(before)/_component/LoginModal';
import Main from '@/app/(before)/_component/Main';

const LoginPage: NextPage = () => {
   return (
      <div className="h-screen w-full overflow-hidden">
         <Main />
         <LoginModal open />
      </div>
   );
};

export default LoginPage;
