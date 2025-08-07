import React from 'react';
import { Button } from '../../../ui';

interface AddProductButtonProps {
  onClick: () => void;
}

export const AddProductButton: React.FC<AddProductButtonProps> = ({
  onClick,
}) => {
  return (
    <Button onClick={onClick} variant='gray'>
      새 상품 추가
    </Button>
  );
};
