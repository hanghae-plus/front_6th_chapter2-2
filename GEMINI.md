# Gemini Code Assist Memos

이 파일은 Gemini Code Assist와의 상호작용을 통해 얻은 프로젝트 관련 정보, 결정 사항, 유용한 팁 등을 기록하는 공간입니다.

# 작업 절대 원칙

작업 시 다음 원칙을 반드시 준수해야 합니다.

- **기능 불변성 유지**: 기존 애플리케이션의 기능적 동작은 마이그레이션 전후로 완벽하게 동일해야 합니다. 기능 변경은 허용되지 않습니다.
- **동작 일관성 보장**: 사용자 인터페이스(UI) 및 사용자 경험(UX)은 마이그레이션 전과 동일하게 유지되어야 합니다.
- **TypeScript 우선**: 모든 마이그레이션된 코드 및 새로 작성되는 코드는 TypeScript로 작성되어야 하며, 명확하고 정확한 타입 정의를 포함해야 합니다. `any` 타입 사용은 최소화해야 합니다.
- **React 관용적 코드**: React의 컴포넌트 기반 아키텍처, Hooks, 상태 관리 패턴을 사용하여 코드를 작성해야 합니다. 직접적인 DOM 조작은 React의 라이프사이클 및 렌더링 원칙에 따라 재구성되어야 합니다.
- **기존 Clean Code 규칙 준수**: `MANDATORY CODE WRITING RULES` 섹션에 명시된 모든 Clean Code 원칙(DRY, KISS, YAGNI, 단일 책임, 코드 조직화, 명명 규칙, 추상화)을 React 및 TypeScript 환경에 맞게 적용해야 합니다.
- **점진적 마이그레이션**: 작업을 가능한 한 작은 단위로 나누어 진행하고, 각 단위 작업 완료 후 커밋을 통해 변경 사항을 명확히 기록해야 합니다.
- **불필요한 라이브러리 추가 금지**: 마이그레이션 과정에서 새로운 외부 라이브러리 추가는 사용자 승인 없이는 금지됩니다. 기존 프로젝트의 의존성을 최대한 활용합니다.
- **React.FC 사용 금지**: `React.FC` 타입은 `children`을 암묵적으로 포함하고, 기본 Props 타입 추론을 제한하는 등 타입 안정성을 저하시킬 수 있습니다.
  - 대신 `React.FunctionComponent` 대신 명시적인 Props 타입 정의를 사용해야 합니다.

# 절대 반드시 지켜야만 하는 절대적 원칙 (안지키면 다시해야함)

- 코드의 동작이나 구현이 바뀌면 안되고 반드시 구조 변경(리팩토링)만 해야해야만해
- 공통으로 쓰이는 파일만 공통 폴더에 넣어두고, 비즈니스 로직이 담긴 경우, 관심사끼리 묶어 폴더로 관리해야해
- src/basic/tests/basic.test.js, src/advanced/tests/advanced.test.js 테스트 코드가 모두 하나도 빠짐없이 통과해야해 (테스트는 npx vitest run 으로 watch 가 발생하지 않도록 해)
- 테스트 코드 검증 여부는 basic 및 advanced 폴더를 기준으로 검사해야만해. origin 파일은 의미없어.

-> 작업 후 마지막으로 절대 원칙이 지켜졌는지 한번 더 컴토 후 올바르게 고치고 알려줘

# Clean Code Writing Rules

## MANDATORY CODE WRITING RULES

You MUST follow these rules when writing any code:

### CORE DESIGN PRINCIPLES

- **DRY**: NEVER repeat the same code
- **KISS**: Write code as simply as possible
- **YAGNI**: Do NOT write unnecessary code
- **Single Responsibility**: Functions MUST be under 20 lines and have ONE clear responsibility

### CODE ORGANIZATION RULES

Apply these 4 organization principles:

- **Proximity**: Group related elements with blank lines
- **Commonality**: Group related functionality into functions
- **Similarity**: Use similar names and positions for similar roles
- **Continuity**: Arrange code in dependency order

### NAMING REQUIREMENTS

#### Naming Principles (ALL MUST BE FOLLOWED)

1. **Predictable**: Name must allow prediction of value, type, and return value
2. **Contextual**: Add descriptive adjectives or nouns for context
3. **Clear**: Remove unnecessary words while maintaining clear meaning
4. **Concise**: Brief yet clearly convey role and purpose
5. **Consistent**: Use identical terms for identical intentions across entire codebase

#### REQUIRED Naming Patterns

**Action Functions - USE THESE PATTERNS:**

```
// Creation: create~(), add~(), push~(), insert~(), new~(), append~(), spawn~(), make~(), build~(), generate~()
// Retrieval: get~(), fetch~(), query~()
// Transformation: parse~(), split~(), transform~(), serialize~()
// Modification: update~(), mutation~()
// Deletion: delete~(), remove~()
// Communication: put~(), send~(), dispatch~(), receive~()
// Validation: validate~(), check~()
// Calculation: calc~(), compute~()
// Control: init~(), configure~(), start~(), stop~()
// Storage: save~(), store~()
// Logging: log~(), record~()
```

**Data Variables - USE THESE PATTERNS:**

```
// Quantities: count~, sum~, num~, min~, max~, total
// State: is~, has~, current~, selected~
// Progressive/Past: ~ing, ~ed
// Information: ~name, ~title, ~desc, ~text, ~data
// Identifiers: ~ID, ~code, ~index, ~key
// Time: ~at, ~date
// Type: ~type
// Collections: ~s
// Others: item, temp, params, error
// Conversion: from(), of()
```

### ABSTRACTION RULES

- **Data Abstraction**: Simplify data structure and processing methods
- **Process Abstraction**: Encapsulate complex logic into simple interfaces
- **Appropriate Level**: Do NOT over-abstract or under-abstract

### MANDATORY CHECKLIST

Before finalizing ANY code, you MUST verify:

1. ✅ **Applied standard naming patterns** from above
2. ✅ **Organized code using 4 organization principles**
3. ✅ **Split complex logic into small functions**
4. ✅ **Code expresses intent without comments** (comments only when absolutely necessary)
5. ✅ **Maintained consistent formatting**

### FORBIDDEN PRACTICES

- ❌ Do NOT mix similar terms (`display` vs `show`)
- ❌ Do NOT write functions longer than 20 lines
- ❌ Do NOT repeat code patterns
- ❌ Do NOT use unclear or ambiguous names
- ❌ Do NOT violate naming consistency across codebase

## COMPLIANCE REQUIREMENT

ALL code output MUST comply with these rules. No exceptions.
