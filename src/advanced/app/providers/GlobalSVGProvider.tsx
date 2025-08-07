import { createPortal } from 'react-dom';

import { iconNames } from '../../shared/icon';

const svgMap = (
  <svg xmlns='http://www.w3.org/2000/svg'>
    <symbol
      id={iconNames.x}
      className='w-4 h-4'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
    </symbol>
    <symbol
      id={iconNames.trash}
      className='w-5 h-5'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
      />
    </symbol>
    <symbol
      id={iconNames.plus}
      className='w-8 h-8'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
    </symbol>
    <symbol
      id={iconNames.cart}
      className='w-6 h-6 text-gray-700'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
      />
    </symbol>
    <symbol
      id={iconNames.noImage}
      className='w-24 h-24 text-gray-300'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1}
        d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
      />
    </symbol>
    <symbol
      id={iconNames.cartBagRegular}
      className='w-5 h-5 mr-2'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
      />
    </symbol>
    <symbol
      id={iconNames.cartBagThin}
      className='w-16 h-16 text-gray-300 mx-auto mb-4'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={1}
        d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
      />
    </symbol>
  </svg>
);

// App 내부에서 선언되어 최초 생성된는 DOM에 추가됩니다.
export function GlobalSVGProvider() {
  return createPortal(svgMap, document.body);
}
