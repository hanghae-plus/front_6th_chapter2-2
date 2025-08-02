// @ts-nocheck
import AdminPage from '@/basic/pages/admin/page';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import '../../setupTests';

describe('쇼핑몰 앱 통합 테스트 - 쇼핑 페이지', () => {
  beforeEach(() => {
    // localStorage 초기화
    localStorage.clear();
    // console 경고 무시
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('관리자 기능', () => {
    beforeEach(() => {
      render(<AdminPage />);
    });

    test('새 상품을 추가할 수 있다', () => {
      // 새 상품 추가 버튼 클릭
      fireEvent.click(screen.getByText('새 상품 추가'));

      // 폼 입력 - 상품명 입력
      const labels = screen.getAllByText('상품명');
      const nameLabel = labels.find(el => el.tagName === 'LABEL');
      const nameInput = nameLabel.closest('div').querySelector('input');
      fireEvent.change(nameInput, { target: { value: '테스트 상품' } });

      const priceInput = screen.getAllByPlaceholderText('숫자만 입력')[0];
      fireEvent.change(priceInput, { target: { value: '25000' } });

      const stockInput = screen.getAllByPlaceholderText('숫자만 입력')[1];
      fireEvent.change(stockInput, { target: { value: '50' } });

      const descLabels = screen.getAllByText('설명');
      const descLabel = descLabels.find(el => el.tagName === 'LABEL');
      const descInput = descLabel.closest('div').querySelector('input');
      fireEvent.change(descInput, { target: { value: '테스트 설명' } });

      // 저장
      fireEvent.click(screen.getByText('추가'));

      // 추가된 상품 확인
      expect(screen.getByText('테스트 상품')).toBeInTheDocument();
      expect(screen.getByText('25,000원')).toBeInTheDocument();
    });

    test('쿠폰 탭으로 전환하고 새 쿠폰을 추가할 수 있다', () => {
      // 쿠폰 관리 탭으로 전환
      fireEvent.click(screen.getByText('쿠폰 관리'));

      // 새 쿠폰 추가 버튼 클릭
      const addCouponButton = screen.getByText('새 쿠폰 추가');
      fireEvent.click(addCouponButton);

      // 쿠폰 정보 입력
      fireEvent.change(screen.getByPlaceholderText('신규 가입 쿠폰'), {
        target: { value: '테스트 쿠폰' },
      });
      fireEvent.change(screen.getByPlaceholderText('WELCOME2024'), {
        target: { value: 'TEST2024' },
      });

      const discountInput = screen.getByPlaceholderText('5000');
      fireEvent.change(discountInput, { target: { value: '7000' } });

      // 쿠폰 생성
      fireEvent.click(screen.getByText('쿠폰 생성'));

      // 생성된 쿠폰 확인
      expect(screen.getByText('테스트 쿠폰')).toBeInTheDocument();
      expect(screen.getByText('TEST2024')).toBeInTheDocument();
      expect(screen.getByText('7,000원 할인')).toBeInTheDocument();
    });

    test('상품의 가격 입력 시 숫자만 허용된다', async () => {
      // 상품 수정
      fireEvent.click(screen.getAllByText('수정')[0]);

      const priceInput = screen.getAllByPlaceholderText('숫자만 입력')[0];

      // 문자와 숫자 혼합 입력 시도 - 숫자만 남음
      fireEvent.change(priceInput, { target: { value: 'abc123def' } });
      expect(priceInput.value).toBe('10000'); // 유효하지 않은 입력은 무시됨

      // 숫자만 입력
      fireEvent.change(priceInput, { target: { value: '123' } });
      expect(priceInput.value).toBe('123');

      // 음수 입력 시도 - regex가 매치되지 않아 값이 변경되지 않음
      fireEvent.change(priceInput, { target: { value: '-100' } });
      expect(priceInput.value).toBe('123'); // 이전 값 유지

      // 유효한 음수 입력하기 위해 먼저 1 입력 후 앞에 - 추가는 불가능
      // 대신 blur 이벤트를 통해 음수 검증을 테스트
      // parseInt()는 실제로 음수를 파싱할 수 있으므로 다른 방법으로 테스트

      // 공백 입력 시도
      fireEvent.change(priceInput, { target: { value: '  ' } });
      expect(priceInput.value).toBe('123'); // 유효하지 않은 입력은 무시됨
    });

    test('쿠폰 할인율 검증이 작동한다', async () => {
      // 쿠폰 관리 탭으로 전환
      fireEvent.click(screen.getByText('쿠폰 관리'));

      // 새 쿠폰 추가
      fireEvent.click(screen.getByText('새 쿠폰 추가'));

      // 퍼센트 타입으로 변경 - 쿠폰 폼 내의 select 찾기
      const couponFormSelects = screen.getAllByRole('combobox');
      const typeSelect = couponFormSelects[couponFormSelects.length - 1]; // 마지막 select가 타입 선택
      fireEvent.change(typeSelect, { target: { value: 'percentage' } });

      // 100% 초과 할인율 입력
      const discountInput = screen.getByPlaceholderText('10');
      fireEvent.change(discountInput, { target: { value: '150' } });
      fireEvent.blur(discountInput);

      // 에러 메시지 확인
      await waitFor(() => {
        expect(
          screen.getByText('할인율은 100%를 초과할 수 없습니다')
        ).toBeInTheDocument();
      });
    });

    test('상품을 삭제할 수 있다', () => {
      // 초기 상품명들 확인 (테이블에서)
      const productTable = screen.getByRole('table');
      expect(within(productTable).getByText('상품1')).toBeInTheDocument();

      // 삭제 버튼들 찾기
      const deleteButtons = within(productTable)
        .getAllByRole('button')
        .filter(button => button.textContent === '삭제');

      // 첫 번째 상품 삭제
      fireEvent.click(deleteButtons[0]);

      // 상품1이 삭제되었는지 확인
      expect(within(productTable).queryByText('상품1')).not.toBeInTheDocument();
      expect(within(productTable).getByText('상품2')).toBeInTheDocument();
    });

    test('쿠폰을 삭제할 수 있다', () => {
      // 쿠폰 관리 탭으로 전환
      fireEvent.click(screen.getByText('쿠폰 관리'));

      // 초기 쿠폰들 확인 (h3 제목에서)
      const couponTitles = screen.getAllByRole('heading', { level: 3 });
      const coupon5000 = couponTitles.find(
        el => el.textContent === '5000원 할인'
      );
      const coupon10 = couponTitles.find(el => el.textContent === '10% 할인');
      expect(coupon5000).toBeInTheDocument();
      expect(coupon10).toBeInTheDocument();

      // 삭제 버튼 찾기 (SVG 아이콘을 포함한 버튼)
      const deleteButtons = screen.getAllByRole('button').filter(button => {
        return (
          button.querySelector('svg') &&
          button.querySelector('path[d*="M19 7l"]')
        ); // 삭제 아이콘 path
      });

      // 첫 번째 쿠폰 삭제
      fireEvent.click(deleteButtons[0]);

      // 쿠폰이 삭제되었는지 확인
      expect(screen.queryByText('5000원 할인')).not.toBeInTheDocument();
    });
  });

  describe('로컬스토리지 동기화', () => {
    test('상품, 장바구니, 쿠폰이 localStorage에 저장된다', () => {
      render(<AdminPage />);

      // 상품을 장바구니에 추가
      fireEvent.click(screen.getAllByText('장바구니 담기')[0]);

      // localStorage 확인
      expect(localStorage.getItem('cart')).toBeTruthy();
      expect(JSON.parse(localStorage.getItem('cart'))).toHaveLength(1);

      // 관리자 모드로 전환하여 새 상품 추가
      fireEvent.click(screen.getByText('관리자 페이지로'));
      fireEvent.click(screen.getByText('새 상품 추가'));

      const labels = screen.getAllByText('상품명');
      const nameLabel = labels.find(el => el.tagName === 'LABEL');
      const nameInput = nameLabel.closest('div').querySelector('input');
      fireEvent.change(nameInput, { target: { value: '저장 테스트' } });

      const priceInput = screen.getAllByPlaceholderText('숫자만 입력')[0];
      fireEvent.change(priceInput, { target: { value: '10000' } });

      const stockInput = screen.getAllByPlaceholderText('숫자만 입력')[1];
      fireEvent.change(stockInput, { target: { value: '10' } });

      fireEvent.click(screen.getByText('추가'));

      // localStorage에 products가 저장되었는지 확인
      expect(localStorage.getItem('products')).toBeTruthy();
      const products = JSON.parse(localStorage.getItem('products'));
      expect(products.some(p => p.name === '저장 테스트')).toBe(true);
    });

    test('페이지 새로고침 후에도 데이터가 유지된다', () => {
      const { unmount } = render(<AdminPage />);

      // 장바구니에 상품 추가
      fireEvent.click(screen.getAllByText('장바구니 담기')[0]);
      fireEvent.click(screen.getAllByText('장바구니 담기')[1]);

      // 컴포넌트 unmount
      unmount();

      // 다시 mount
      render(<AdminPage />);

      // 장바구니 아이템이 유지되는지 확인
      const cartSection = screen.getByText('장바구니').closest('section');
      expect(within(cartSection).getByText('상품1')).toBeInTheDocument();
      expect(within(cartSection).getByText('상품2')).toBeInTheDocument();
    });
  });

  describe('UI 상태 관리', () => {
    test('할인이 있을 때 할인율이 표시된다', async () => {
      render(<AdminPage />);

      // 상품을 10개 담아서 할인 발생
      const addButton = screen.getAllByText('장바구니 담기')[0];
      for (let i = 0; i < 10; i++) {
        fireEvent.click(addButton);
      }

      // 할인율 표시 확인 - 대량 구매로 15% 할인
      await waitFor(() => {
        expect(screen.getByText('-15%')).toBeInTheDocument();
      });
    });

    test('장바구니 아이템 개수가 헤더에 표시된다', () => {
      render(<AdminPage />);

      // 상품 추가
      fireEvent.click(screen.getAllByText('장바구니 담기')[0]);
      fireEvent.click(screen.getAllByText('장바구니 담기')[0]);
      fireEvent.click(screen.getAllByText('장바구니 담기')[1]);

      // 헤더의 장바구니 아이콘 옆 숫자 확인
      const cartCount = screen.getByText('3');
      expect(cartCount).toBeInTheDocument();
    });

    test('검색을 초기화할 수 있다', async () => {
      render(<AdminPage />);

      // 검색어 입력
      const searchInput = screen.getByPlaceholderText('상품 검색...');
      fireEvent.change(searchInput, { target: { value: '프리미엄' } });

      // 검색 결과 확인
      await waitFor(() => {
        expect(
          screen.getByText('최고급 품질의 프리미엄 상품입니다.')
        ).toBeInTheDocument();
        // 다른 상품들은 보이지 않음
        expect(
          screen.queryByText('다양한 기능을 갖춘 실용적인 상품입니다.')
        ).not.toBeInTheDocument();
      });

      // 검색어 초기화
      fireEvent.change(searchInput, { target: { value: '' } });

      // 모든 상품이 다시 표시됨
      await waitFor(() => {
        expect(
          screen.getByText('최고급 품질의 프리미엄 상품입니다.')
        ).toBeInTheDocument();
        expect(
          screen.getByText('다양한 기능을 갖춘 실용적인 상품입니다.')
        ).toBeInTheDocument();
        expect(
          screen.getByText('대용량과 고성능을 자랑하는 상품입니다.')
        ).toBeInTheDocument();
      });
    });

    test('알림 메시지가 자동으로 사라진다', async () => {
      render(<AdminPage />);

      // 상품 추가하여 알림 발생
      fireEvent.click(screen.getAllByText('장바구니 담기')[0]);

      // 알림 메시지 확인
      expect(screen.getByText('장바구니에 담았습니다')).toBeInTheDocument();

      // 3초 후 알림이 사라짐
      await waitFor(
        () => {
          expect(
            screen.queryByText('장바구니에 담았습니다')
          ).not.toBeInTheDocument();
        },
        { timeout: 4000 }
      );
    });
  });
});
