import { Button } from "../../../shared";

type CheckoutButtonProps = {
  totalAmount: number;
  onCompleteOrder: () => void;
};

export function CheckoutButton({ totalAmount, onCompleteOrder }: CheckoutButtonProps) {
  return (
    <>
      <Button onClick={onCompleteOrder} size="lg" color="yellow" className="mt-4 w-full">
        {totalAmount.toLocaleString()}원 결제하기
      </Button>

      <div className="mt-3 text-center text-xs text-gray-500">
        <p>* 실제 결제는 이루어지지 않습니다</p>
      </div>
    </>
  );
}
