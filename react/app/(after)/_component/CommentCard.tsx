import React, { createRef, Dispatch, FC, SetStateAction, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import ReactDomServer from 'react-dom/server';
import { SpeedDial, SpeedDialAction, TextareaAutosize } from '@mui/material';
import { useForm } from 'react-hook-form';
import Slidedown from 'react-slidedown';
import { Cancel, Delete, Edit, KeyboardArrowLeft, Save, TurnRight } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { GlobalContext } from '@/contexts/GlobalProvider';
import { IComment } from '@/types/common/comment-types';
import { IUser } from '@/types/common/auth-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useStore } from '@/libs/store';
import { dateUtil, showError } from '@/libs/utils';
import { twMerge } from 'tailwind-merge';
import gravatar from 'gravatar';
import { Icon } from '@iconify-icon/react';
import FormTextarea from '@/components/common/form/FormTextarea';
import { AxiosError } from 'axios';
import tokenApi from '@/libs/tokenApi';

interface CommentCardProps {
   videoId?: string;
   comment: IComment;
   me?: IUser;
   editNo: number;
   setEditNo: Dispatch<SetStateAction<number>>;
   refetchComments: () => void;
}

interface CommentProps {
   videoId: string;
   userId: number;
   content: string;
}

const CommentCard: FC<CommentCardProps> = ({ videoId, comment, editNo, setEditNo, refetchComments }) => {
   const { isMobile } = useContext(GlobalContext)!;
   const [editorValue, setEditorValue] = useState(comment.content);
   const { me, parentId, setParentId } = useStore();
   const [isOver, setIsOver] = useState(false);
   const client = useQueryClient();
   const refs = useMemo(() => Array.from({ length: 2 }, () => createRef()), []);
   const editorRef = refs[0] as any;
   const replyRef = refs[1] as any;

   const { register, handleSubmit, control, setValue, setFocus } = useForm<CommentProps>({
      mode: 'onChange',
      defaultValues: {
         userId: me?.id,
         videoId: comment.videoId,
      },
   });

   const { mutate: replyComment } = useMutation({
      mutationFn: (param: CommentProps) => tokenApi.post(`/comment-reply/${comment.id}`, param),
      onSuccess: _ => {
         refetchComments();
         setParentId(0);
      },
      onError: (e: AxiosError) => {
         showError(e);
         setParentId(0);
      },
   });

   const { mutate: update } = useMutation({
      mutationFn: (param: IComment) => tokenApi.put(`/comments/${comment.id}`, param),
      onSuccess: () => {
         client.invalidateQueries({
            queryKey: ['youtube', 'comments', videoId],
         });
         setEditNo(-1);
      },
   });

   useEffect(() => {
      if (me?.id) setValue('userId', me.id);
   }, [me]);

   const onReply = useCallback(() => {
      setParentId(comment.id);
      setTimeout(() => setFocus('content'), 300);
      setTimeout(() => replyRef.current.focus(), 300);
   }, [comment, replyRef]);

   const onCancelReply = useCallback(() => setParentId(0), []);

   const onSubmit = useCallback((model: CommentProps) => replyComment(model), []);

   const onEditComment = useCallback((entity: IComment) => () => setEditNo(entity.id), [comment]);

   const onDeleteComment = useCallback(
      (id: number) => () => {
         if (confirm('정말로 삭제하시겠습니까?')) {
            tokenApi
               .delete(`/comments/${id}`)
               .then(() => refetchComments() /*client.invalidateQueries(['comments', { id: debateId }])*/)
               .catch(showError);
         }
      },
      [videoId],
   );

   const onCancelComment = useCallback(() => {
      setEditorValue(comment.content);
      setEditNo(0);
   }, [comment]);

   const onSaveComment = useCallback(() => {
      if (!editorValue) {
         toast.warning('내용을 입력해주세요');
         return;
      }
      update({ ...comment, content: editorValue });
   }, [comment, editorValue]);

   return (
      <div className="w-full flex flex-col space-y-3" style={{ paddingLeft: Math.max(comment.lev - 1, 0) * (isMobile ? 30 : 60) }}>
         <div className="flex items-center space-x-4">
            {comment.lev > 0 && <TurnRight className={twMerge('scale-y-[-1]', comment.lev === 1 && 'ml-3')} />}
            <div className="flex-1 flex flex-col space-y-3">
               <div className="flex items-center space-x-3">
                  <img src={gravatar.url(comment.user?.email, { s: '30px', d: 'wavatar' })} alt={comment.user?.name} width={30} className="rounded-full" />
                  <div className="flex flex-col space-y-0.5">
                     <span className="text-neutral-700 dark:text-neutral-300 font-medium">{comment.user?.name}</span>
                     <span className="text-xs mt-2 text-neutral-600 dark:text-neutral-400">
                        {dateUtil.dateFormatFromNow(comment.createdAt, 'YYYY-MM-DD HH:mm:ss')}
                     </span>
                  </div>
                  {me?.id && (
                     <div className="h-full pt-4 flex items-end space-x-1 cursor-pointer" onClick={onReply}>
                        <Icon icon="flowbite:reply-outline" className="text-3xl" />
                        <span className="text-neutral-500 dark:text-neutral-400 text-xs -ml-1">Reply</span>
                     </div>
                  )}
               </div>
               <div
                  className="w-full h-auto min-h-[65px] max-h-[800px] overflow-y-auto border border-neutral-100 dark:border-neutral-800 rounded-lg p-3 relative group"
                  onMouseEnter={() => setIsOver(true)}
                  onMouseLeave={() => setIsOver(false)}
               >
                  {editNo !== comment.id && (
                     <div
                        className="prose w-full max-w-full break-all whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                           __html: comment.isdelete
                              ? ReactDomServer.renderToString(<span className="text-red-500">삭제된 코멘트 입니다.</span>)
                              : comment.content,
                        }}
                     />
                  )}
                  <div className={twMerge('w-full hidden', editNo === comment.id && 'block')}>
                     <TextareaAutosize
                        value={editorValue}
                        minRows={5}
                        className={twMerge('auto-textarea rounded-sm w-full')}
                        onChange={e => setEditorValue(e.target.value)}
                        ref={editorRef}
                     />
                  </div>
                  {!comment.isdelete &&
                     comment.user?.id === me?.id &&
                     (editNo === comment.id ? (
                        <SpeedDial
                           ariaLabel="코멘트 저장"
                           sx={{
                              position: 'absolute',
                              right: 20,
                              top: 8,
                              '& .MuiFab-primary': {
                                 // backgroundColor: blue[500],
                                 // color: amber[600],
                                 height: 36,
                                 width: 36,
                                 diaplay: 'flex',
                                 alignItems: 'center',
                              },
                           }}
                           icon={<KeyboardArrowLeft />}
                           direction="left"
                        >
                           <SpeedDialAction icon={<Cancel color="warning" />} tooltipTitle="취소" onClick={onCancelComment} />
                           <SpeedDialAction icon={<Save color="primary" />} tooltipTitle="저장" onClick={onSaveComment} />
                        </SpeedDial>
                     ) : (
                        <SpeedDial
                           ariaLabel="코멘트 편집"
                           sx={{
                              position: 'absolute',
                              display: isOver ? 'flex' : 'none',
                              right: 10,
                              top: 4,
                              '& .MuiFab-primary': {
                                 // backgroundColor: 'gold',
                                 // color: blue[600],
                                 height: 36,
                                 width: 36,
                                 diaplay: 'flex',
                                 alignItems: 'center',
                              },
                           }}
                           icon={<KeyboardArrowLeft />}
                           direction="left"
                        >
                           <SpeedDialAction icon={<Delete color="error" />} tooltipTitle="삭제" onClick={onDeleteComment(comment?.id)} />
                           <SpeedDialAction icon={<Edit color="primary" />} tooltipTitle="수정" onClick={onEditComment(comment)} />
                        </SpeedDial>
                     ))}
               </div>
            </div>
         </div>
         <Slidedown closed={parentId !== comment.id} className="w-full">
            <div className="w-full">
               <form className="flex flex-col items-stretch w-full" onSubmit={handleSubmit(onSubmit)}>
                  <input type="hidden" {...register('userId')} />
                  <input type="hidden" {...register('videoId')} />
                  <FormTextarea name="content" control={control} setValue={setValue} mode="add" minRows={5} ref={replyRef} />
                  <div className="flex items-center space-x-4 p-2 pt-0 mt-2">
                     <button type="submit" className="bg-indigo-600 text-white px-8 py-2 flex items-center space-x-2 hover:opacity-80">
                        등록
                     </button>
                     <button
                        type="reset"
                        className="border border-[#bcbcbc] px-8 py-2 flex items-center space-x-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                        onClick={onCancelReply}
                     >
                        취소
                     </button>
                  </div>
               </form>
            </div>
         </Slidedown>
      </div>
   );
};

export default CommentCard;
