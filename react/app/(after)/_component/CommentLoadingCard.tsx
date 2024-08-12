import { FC } from 'react';
import { Avatar, Card, CardContent, CardHeader, Skeleton } from '@mui/material';

const CommentLoadingCard: FC = () => {
   return (
      <Card variant="elevation" elevation={3}>
         <CardHeader
            avatar={<Avatar src="/images/user_empty.png" />}
            title={<Skeleton variant="text" width="50%" animation="wave" height={15} />}
            subheader={<Skeleton variant="text" width="20%" animation="wave" height={15} />}
         />
         <CardContent>
            <div className="h-48 w-full flex flex-col space-y-2 mt-3">
               <Skeleton height={20} animation="wave" width="80%" />
               <Skeleton height={20} animation="wave" width="70%" />
               <Skeleton height={20} animation="wave" width="60%" />
            </div>
         </CardContent>
      </Card>
   );
};

export default CommentLoadingCard;
