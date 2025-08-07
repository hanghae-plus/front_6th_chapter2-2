module.exports = {
  // 들여쓰기에 탭 대신 공백을 사용합니다.
  useTabs: false,
  // 들여쓰기 시 탭 너비를 2칸으로 설정합니다.
  tabWidth: 2,
  // 모든 구문의 끝에 세미콜론을 추가합니다.
  semi: true,
  // 객체 리터럴에서 대괄호 사이에 공백을 추가합니다. (예: { foo: bar })
  bracketSpacing: true,
  // 작은따옴표(') 대신 큰따옴표(")를 사용합니다.
  singleQuote: false,
  // 객체 속성(property)의 따옴표 사용 방식을 "필요할 때만"으로 설정합니다.
  quoteProps: "as-needed",
  // JSX에서 작은따옴표(') 대신 큰따옴표(")를 사용합니다.
  jsxSingleQuote: false,
  // JSX의 >를 마지막 속성 옆 줄에 배치합니다.
  jsxBracketSameLine: false,
  // JSX 태그를 여러 줄로 나눌 때, 마지막 줄에 >를 단독으로 둡니다. (Prettier 2.4.0 이후로 이 옵션은 jsxBracketSameLine과 함께 사용됩니다.)
  // Note: 이 옵션은 최신 Prettier 버전(2.4.0 이후)에서 Deprecated되었으며, arrowParens와 함께 기본값으로 대체되었습니다.
  // 이 옵션은 이제 "semi"와 "arrowParens"의 영향을 받지 않습니다.
  jsxParens: true,
  // Markdown 파일의 줄바꿈 방식을 "never" (줄바꿈하지 않음)로 설정합니다.
  proseWrap: "never",
  // 객체, 배열 등에서 항상 마지막 요소 뒤에 쉼표를 추가합니다.
  trailingComma: "all",
  // 화살표 함수의 매개변수가 하나일 때도 항상 괄호를 사용합니다. (예: (x) => x)
  arrowParens: "always",
  // 파일의 끝 라인 방식을 "auto"로 설정하여, git과 같은 도구의 기본 설정에 맞춰 자동으로 결정합니다.
  endOfLine: "auto",
};