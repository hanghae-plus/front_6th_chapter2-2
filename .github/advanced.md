# 1. 준비

[GitHub - hanghae-plus/front_6th_chapter2-2: Chapter 2-2. 디자인 패턴과 함수형 프로그래밍](https://github.com/hanghae-plus/front_6th_chapter2-2)

```bash
# origin 테스트 코드 실행
pnpm test:origin

# origin 어플리케이션 실행
pnpm start:origin

# basic 테스트 코드 실행
pnpm test:basic

# advanced 어플리케이션 실행
pnpm start:advanced
```

# 2. 목표

**이번 심화과제는 Context나 Jotai를 사용해서 Props drilling을 없애기 입니다.**

- basic에서 열심히 컴포넌트를 분리해주었겠죠?
- 아마 그 과정에서 container - presenter 패턴으로 만들어졌기에 props drilling이 상당히 불편했을거에요.
- 그래서 심화과제에서는 props drilling을 제거하는 작업을 할거에요.
  - 전역상태관리가 아직 낯설다 - jotai를 선택해주세요. (참고자료 참고)
  - 나는 깊이를 공부해보고 싶다. - context를 선택해서 상태관리를 해보세요.
