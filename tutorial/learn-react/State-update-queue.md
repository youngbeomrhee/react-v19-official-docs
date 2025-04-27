# React - 여러 개의 State 업데이트 큐잉 요약

## 핵심 개념

- **State 설정 시**: `setState`를 호출하면 바로 리렌더링되는 것이 아니라, **다음 렌더링을 위해 큐에 등록**된다.
- **Batching(배칭)**: React는 이벤트 핸들러 코드 실행이 끝날 때까지 기다렸다가 여러 개의 `setState` 호출을 **한 번에 처리**한다.
  - 예시: 버튼 클릭 시 `setState`를 여러 번 호출해도, 이벤트 핸들러 끝나고 한 번에 렌더링.

---

## 예시 코드

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 1);
        setNumber(number + 1);
        setNumber(number + 1);
      }}>
        +3
      </button>
    </>
  );
}
```

- 위 코드에서 버튼 클릭 시 `number`는 **1만 증가**한다.
- 이유: 각 `setNumber(number + 1)` 호출 시 `number` 값이 여전히 **0**이기 때문.

---

## 왜 이런 동작을 할까?

- **웨이터 비유**: 주문을 하나하나 주방에 가져가는 게 아니라, 다 듣고 한 번에 가져간다.
- 이 방식 덕분에:
  - **렌더링 최적화** (과도한 리렌더링 방지)
  - **UI 일관성 유지** (중간 상태 노출 방지)

---

## 동일한 State를 여러 번 업데이트하고 싶을 때

- **이전 State를 기반으로 업데이트하는 방법**을 사용해야 함.

```jsx
setNumber(n => n + 1);
setNumber(n => n + 1);
setNumber(n => n + 1);
```

- 이렇게 하면 `number`가 **3만큼 증가**한다.
- `n`은 **업데이트 직전의 최신 state 값**을 의미함.

---

## 요약

| 구분 | 동작 |
|:---|:---|
| 값 기반 `setState` | 항상 현재 렌더링의 값을 사용 |
| 함수 기반 `setState` | 이전 업데이트 결과를 반영 가능 |
| Batching | 이벤트 핸들러 안의 여러 `setState`를 한 번에 처리 |

