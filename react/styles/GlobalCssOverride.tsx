'use client';

import { createGlobalStyle } from 'styled-components';
import Colors from '@/libs/color';

const GlobalCssOverride = createGlobalStyle`
    /* Youtube Player */
    .youtube {
        overflow: hidden;
        padding-bottom: 56.25%;
        position: relative;
        height: 0;
    }

    .youtube iframe {
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        position: absolute;
    }
    
    /* Curved Header */
    .app-bar{
        position: relative;
        top: 0;
        width:100vw;
        height: 200px;
        display:flex;
        justify-content:space-between;
        align-items:center;
        overflow:hidden;
    }
    .app-bar:before{
        content:'';
        position:absolute;
        top:0;
        left:0;
        height:100%;
        width:100%;
        background: ${Colors.blue[400]};  /* fallback for old browsers */
        background: linear-gradient(to right, ${Colors.teal[400]}, #015871); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        border-radius:0 0 50% 50%/0 0 100% 100%;
        transform:scaleX(1.5);
    }

    /* Wave */
    .ocean {
        height: 5%;
        width: 100%;
        position: absolute;
        bottom: -10px;
        left: 0;
        background: transparent;
        //background: #015871;
    }
    .wave {
        background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/85486/wave.svg) repeat-x;
        position: absolute;
        top: -198px;
        width: 6400px;
        height: 198px;
        animation: wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
        transform: translate3d(0, 0, 0);
    }
    .wave:nth-of-type(2) {
        top: -175px;
        animation:
                wave 7s cubic-bezier(0.36, 0.45, 0.63, 0.53) -0.125s infinite,
                swell 7s ease -1.25s infinite;
        opacity: 1;
    }

    @keyframes wave {
        0% {
            margin-left: 0;
        }
        100% {
            margin-left: -1600px;
        }
    }

    @keyframes swell {
        0%,
        100% {
            transform: translate3d(0, -25px, 0);
        }
        50% {
            transform: translate3d(0, 5px, 0);
        }
    }
`;

export default GlobalCssOverride;
