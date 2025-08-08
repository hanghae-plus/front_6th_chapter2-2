# 과제 셀프회고

## 과제를 하면서 내가 제일 신경 쓴 부분은 무엇인가요?

1. Entity와 View의 분리.

2. custom hook으로 묶을 수 있는 state와 상태 변경 함수를 판단하기.

3. 컴포넌트를 Atomic하게 쪼개기 vs 적당히 가독성 측면에서 쪼개기

## 과제를 다시 해보면 더 잘 할 수 있었겠다 아쉬운 점이 있다면 무엇인가요?

1. 기본과제를 진행하면서 처음 나눴던 Header, AdminPage, CartPage 단위에 공통으로 내려야하는 props들이 있다보니, 해당 상태로부터 파생되는 여러 props들이 drilling을 발생시켰다. props drilling자체를 막을 수는 없지만, 상태를 최대한 지역화해서 깔끔하게 다시 짜보고싶기는하다.

2. 처음에는 Context API를 활용하여 심화과제를 진행하다가 원복하고 JoTai를 사용하여 심화과제를 진행했지만, 마지막에 시간에 쫓껴서 완성할 수 없었다. 다시 돌아가면 처음부터 하나만 제대로 해보고싶다. 그래도 전역상태 관리, Context를 사용하니 props drilling을 방지할 수 있었고 props를 내리는 과정에서 누락하는 실수를 줄일 수 있다는 것을 다시금 느꼈다.

3. 이번 과제를 하면서 느끼는 나의 고질적인 문제는, 항상 정답이 있다고 가정하고 과제를 대하고 있다. 나의 코드를 작성하지 못하고, 계속 정답일것 같은 코드만 찾다보니, 개발도 못하고 나중에 시간에 쫓겨 대충대충 진행하게 된다. 코딩은 정답을 찾는 과정이 아니라, 문제를 해결하는 과정이라는 것을 여전히 받아드리지 못했나보다.

## 리뷰 받고 싶은 내용이나 궁금한 것에 대한 질문

1. 컴포넌트를 나누는 과정에서 Atomic에 너무 집중하다보면 너무 많이 쪼개진 컴포넌트들로 오히려 가독성이 떨어진다고 생각합니다. 컴포넌트를 나누는 기준이야 천차만별이지만 조금의 팁이 있을까요?

2. 전역상태 관리 라이브러리를 단지 Props drilling 방지를 위해 사용하는 것에 대해 어떻게 생각하시나요?. 그렇다면 전역 상태로 보관해야할 상태와, 지역에 useState등으로 보관해야할 상태의 기준이 어떻게 될까요? "props로 몇 depth 이상 내리면 차라리 전역변수로 관리한다." 이런 기준들은 조금 모호하다고 생각해서 들었던 의문입니다.

3. 전역상태 라이브러리와 Context Api를 사용하는 기준이 각각 어떻게 될까요?

## 그 외 기록

### 1. test에서의 실수

```tsx
import { Provider } from 'jotai';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
);
```

처음에 jotai Provider를 이렇게 묶었는데 테스트 실패 원인을 찾을 수가 없어서 고생했다.

원인은

```tsx
beforeEach(() => {
  render(<App />);
  // 관리자 모드로 전환
  fireEvent.click(screen.getByText('관리자 페이지로'));
});
```

App부터 렌더링하기 때문에 main.tsx에서 Provider는 반영되지 않는다.

- 기존 코드는 당연히 잘 돌아갈거라고 생각하고 수정한 부분에서만 원인을 찾는 안 좋은 버릇이 있다. 추가, 수정 후에는 기존 코드와의 연계도 생각을 하면서 이슈를 찾아야지.

### 2. GPT-5 사용기

- 8월 8일 아침, gpt-5를 vscode copilot에서 사용할 수 있게 됐다. 딸깍 코딩의 맛을 보기 위해, 코드 리팩토링을 agent에게 부탁했는데, 체감상 sonnet 4 보다 전체 코드의 맥락을 잘 파악하고 내가 원하는 대로 척척 나눠줬다... 뭔가 의존하고 싶어지는 듬직한 녀석이지만 정신 차리고 도구로써 잘 쓰기를...
