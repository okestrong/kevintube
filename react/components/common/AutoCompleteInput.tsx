import React, { FC, MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Icon } from '@iconify-icon/react';
import ClickAwayListener from 'react-click-away-listener';
import { usePersist } from '@/libs/store';

interface Props {
   autoFocus?: boolean;
   containerClassname?: string;
   onSearch: (term: string) => void;
   defaultValue?: string;
}

const AutoCompleteInput: FC<Props> = ({ autoFocus, containerClassname, defaultValue, onSearch }) => {
   const [term, setTerm] = useState(defaultValue || '');
   const [hasText, setHasText] = useState(false);
   const [focused, setFocused] = useState(false);
   const [show, setShow] = useState(false);
   const [curIdx, setCurIdx] = useState(-1);
   const { items, addItem } = usePersist();
   const searchRef = useRef<HTMLInputElement>(null);

   const options = useMemo(() => items?.filter(it => it.includes(term)) || [], [term, items]);

   useEffect(() => {
      if (defaultValue) {
         setTerm(defaultValue);
      }
   }, [defaultValue]);

   const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setTerm(e.target.value);
      setCurIdx(-1);
   }, []);

   const onKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
         if (e.key === 'Enter' && !!term) {
            e.preventDefault();
            setShow(false);
            if (curIdx > -1) {
               const keyword = options[curIdx];
               addItem(keyword);
               onSearch(keyword);
            } else if (!e.nativeEvent.isComposing) {
               addItem(term);
               onSearch(term);
            }
         } else if (e.key === 'Escape') {
            setShow(false);
         } else if (e.key === 'ArrowDown') {
            setCurIdx(prev => Math.min(prev + 1, options.length - 1));
         } else if (e.key === 'ArrowUp') {
            setCurIdx(prev => Math.max(prev - 1, 0));
         }
      },
      [term, options, curIdx],
   );

   useEffect(() => {
      if (autoFocus) {
         setTimeout(() => searchRef.current?.focus(), 300);
      }
   }, []);

   useEffect(() => {
      setHasText(!!term);
   }, [term]);

   useEffect(() => {
      setShow(focused && hasText && options.length > 0);
   }, [hasText, options, focused]);

   const handleSearch = useCallback(
      (keyword: string) => () => {
         if (term) {
            addItem(keyword);
            onSearch(keyword);
         }
      },
      [],
   );

   return (
      <div className={twMerge('w-full relative', containerClassname || '')}>
         <div
            className={twMerge(
               'relative rounded-full w-2/3 translate-x-1/3 border border-neutral-400 py-4 px-2 dark:bg-neutral-700 transition-all',
               focused && 'shadow-neon w-full translate-x-0',
            )}
         >
            <input
               type="text"
               ref={searchRef}
               onKeyDown={onKeyDown}
               onChange={onChange}
               value={term}
               className="border-none outline-0 shadow-none w-full pl-[40px] bg-transparent"
               onFocus={() => {
                  setFocused(true);
                  if (term) {
                     setHasText(true);
                     setShow(options.length > 0);
                  }
               }}
               onBlur={() => setTimeout(() => setFocused(false), 300)}
            />
            <Icon icon="material-symbols:search" className="text-neutral-500 dark:text-neutral-400 text-2xl absolute left-5 top-1/2 -translate-y-1/2" />
         </div>

         {show && (
            <ClickAwayListener
               onClickAway={e => {
                  if (!focused) {
                     setShow(false);
                     setCurIdx(-1);
                  }
               }}
            >
               <ul className="max-h-[400px] bg-white dark:bg-neutral-600 border dark:border-neutral-600 mx-8 shadow-xl overflow-y-auto rounded-b-lg mt-0.5 absolute top-[44px] inset-x-8 block z-[5001]">
                  {options.map((it, idx) => (
                     <li
                        key={it}
                        className={twMerge(
                           'border-b border-neutral-100 dark:border-neutral-600 p-4 flex justify-center items-center hover:bg-blue-300 dark:hover:bg-blue-600 hover:cursor-pointer',
                           curIdx === idx && 'bg-blue-300 dark:bg-blue-600',
                        )}
                        onClick={handleSearch(it)}
                     >
                        {it}
                     </li>
                  ))}
               </ul>
            </ClickAwayListener>
         )}
      </div>
   );
};

export default AutoCompleteInput;
