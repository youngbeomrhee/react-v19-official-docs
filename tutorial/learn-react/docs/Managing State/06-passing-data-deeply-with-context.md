# 📌 Passing Data Deeply with Context

React에서는 일반적으로 부모 컴포넌트가 자식 컴포넌트에 데이터를 `props`로 전달해. 하지만 많은 컴포넌트를 거쳐 데이터를 전달해야 할 때는 **prop drilling** 문제가 발생할 수 있어.

## 🤯 Prop Drilling 문제란?

- 여러 컴포넌트를 거쳐서 동일한 데이터를 전달할 때, 중간 컴포넌트들이 해당 데이터를 사용하지 않더라도 props를 계속 전달해야 하는 상황이야.
- 이로 인해 컴포넌트가 복잡해지고 유지보수가 어려워져.

## 🧰 해결 방법: Context API

`Context`를 사용하면 **데이터를 컴포넌트 트리 깊숙한 곳까지 전달**할 수 있어. 중간 컴포넌트를 거치지 않아도 돼.

---

## 🛠️ Context 사용 단계

### 1. Context 생성

```js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

- 기본값을 설정할 수 있음 (`1`은 `<h1>`처럼 해딩 레벨로 사용)

---

### 2. Context 사용

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  return <h{level}>{children}</h{level}>;
}
```

- `useContext(LevelContext)`를 통해 가장 가까운 Provider 값을 가져와 사용할 수 있어.

---

### 3. Context 제공

```js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section>
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

- `Section` 컴포넌트가 `LevelContext`를 제공하고, 하위 컴포넌트들이 해당 값을 사용할 수 있어.

---

## ⛓️ 깊은 트리 구조에서도 작동

```jsx
<Section level={1}>
  <Heading>Title</Heading>
  <Section level={2}>
    <Heading>Heading</Heading>
    <Section level={3}>
      <Heading>Sub-heading</Heading>
    </Section>
  </Section>
</Section>
```

- 각 `Section`은 자신만의 `LevelContext`를 제공하고, `Heading`은 가장 가까운 값을 자동으로 받아 사용해.

---

## ⚡ 자동으로 레벨 계산하기

```js
export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section>
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

- 부모의 level 값을 읽고 +1 하여 하위 섹션에 제공함.
- 이제 level props를 직접 넘길 필요 없이 계층 구조로 자동 반영돼.

---

## 📚 Context 활용 예시

- **다크 모드** 테마 전환
- **로그인 유저 정보** 공유
- **라우팅 상태** 유지
- **다국어 설정** 등

---

## 🚨 Context 사용 시 주의사항

- 모든 데이터를 Context로 관리할 필요는 없어.
- 먼저 props로 충분히 해결되는지 고민해 보고, 반복적 전달이 심한 경우 Context를 고려해.
- 불필요한 Context 사용은 리렌더링 성능 이슈를 유발할 수 있어.

---

## 🧭 요약

| 기능 | 설명 |
|------|------|
| `createContext(defaultValue)` | Context 객체 생성 |
| `Context.Provider` | 값을 하위에 전달 |
| `useContext(Context)` | Context 값 읽기 |
| 중첩 Provider | 가장 가까운 값을 우선 사용 |
| 자동 레벨 계산 | context + useContext 조합 가능 |
