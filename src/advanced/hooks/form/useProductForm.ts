import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import {
  productFormAtom,
  showProductFormAtom,
  editingProductAtom,
  handleProductFormSubmitAtom,
  startEditProductAtom,
  handleCancelProductAtom,
  resetEditingProductAtom,
  updateProductFormAtom,
  updateShowProductFormAtom,
} from '../../atoms/formAtoms';
import { ProductWithUI, ProductForm } from '../../types';

const useProductForm = () => {
  // atoms 구독
  const [productForm] = useAtom(productFormAtom);
  const [showProductForm] = useAtom(showProductFormAtom);
  const [editingProduct] = useAtom(editingProductAtom);

  // action atoms
  const handleProductFormSubmitAction = useSetAtom(handleProductFormSubmitAtom);
  const startEditProductAction = useSetAtom(startEditProductAtom);
  const handleCancelProductAction = useSetAtom(handleCancelProductAtom);
  const resetEditingProductAction = useSetAtom(resetEditingProductAtom);
  const updateProductFormAction = useSetAtom(updateProductFormAtom);
  const updateShowProductFormAction = useSetAtom(updateShowProductFormAtom);

  // wrapper 함수들
  const handleProductFormSubmit = useCallback(() => {
    handleProductFormSubmitAction();
  }, [handleProductFormSubmitAction]);

  const startEditProduct = useCallback(
    (product: ProductWithUI | string) => {
      startEditProductAction(product);
    },
    [startEditProductAction],
  );

  const handleCancelProduct = useCallback(() => {
    handleCancelProductAction();
  }, [handleCancelProductAction]);

  const resetEditingProduct = useCallback(() => {
    resetEditingProductAction();
  }, [resetEditingProductAction]);

  const updateProductForm = useCallback(
    (form: Partial<ProductForm>) => {
      updateProductFormAction(form);
    },
    [updateProductFormAction],
  );

  const updateShowProductForm = useCallback(
    (show: boolean) => {
      updateShowProductFormAction(show);
    },
    [updateShowProductFormAction],
  );

  return {
    productForm,
    showProductForm,
    editingProduct,
    handleProductFormSubmit,
    startEditProduct,
    handleCancelProduct,
    updateProductForm,
    updateShowProductForm,
    resetEditingProduct,
  };
};

export { useProductForm };
