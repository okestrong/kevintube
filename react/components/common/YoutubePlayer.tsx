import { FC } from 'react';

interface Props {
   id: string;
   title: string;
}

const YoutubePlayer: FC<Props> = ({ id, title }) => {
   return (
      <>
         <div className="youtube">
            <iframe
               src={`https://www.youtube.com/embed/${id}`}
               width="100%"
               className="aspect-video"
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
               title={title}
            />
         </div>
         <style jsx>{`
            .youtube {
               width: 100%;
               overflow: hidden;
               padding-bottom: 56.25%;
               position: relative;
               height: 0;
            }

            .youtube > iframe {
               left: 0;
               top: 0;
               height: 100%;
               width: 100%;
               position: absolute;
            }
         `}</style>
      </>
   );
};

export default YoutubePlayer;
