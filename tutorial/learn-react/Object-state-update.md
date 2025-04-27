# React - 객체 State 업데이트하기 요약

## 핵심 개념

- **State는 객체를 포함해 어떤 값이든 가질 수 있다.**
- **객체를 직접 수정(mutation)하면 안 된다.**
- **항상 새로운 객체를 만들어서 교체해야 한다.** (불변성 유지)

---

## 예시 코드 - 잘못된 방법

```jsx
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div
      onPointerMove={e => {
        position.x = e.clientX; // ❌ 직접 수정
        position.y = e.clientY; // ❌ 직접 수정
      }}
      style={{ width: '100vw', height: '100vh', position: 'relative' }}
    >
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'red',
          borderRadius: '50%',
          transform: `translate(${position.x}px, ${position.y}px)`,
          left: -10,
          top: -10,
          width: 20,
          height: 20,
        }}
      />
    </div>
  );
}
```

- 문제점: React는 `position` 객체가 변경됐는지 모른다.
- 결과: 리렌더링이 발생하지 않는다.

---

## 예시 코드 - 올바른 방법

```jsx
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY,
  });
}}
```

- 새로운 객체를 만들어 `setPosition` 호출
- React가 변화를 감지하고 리렌더링한다.

---

## 왜 불변성이 중요한가?

- **React는 객체의 내부 변경을 감지할 수 없다.**
- **객체의 "주소(reference)"가 바뀌어야** React가 업데이트를 인식할 수 있다.
- 직접 수정은 예기치 않은 버그를 초래할 수 있다.

---

## 중첩 객체를 업데이트할 때

- **얕은 복사(shallow copy)** 후 필요한 부분만 수정해야 한다.

```jsx
setPosition(prev => ({
  ...prev,
  x: prev.x + 10,
}));
```

- `...prev`로 기존 값을 복사하고,
- 필요한 `x`만 수정하는 방식.

---

## 반복적인 복사가 많을 때 - Immer 사용

- Immer 라이브러리를 쓰면 편하게 불변성 유지가 가능하다.

```jsx
import { useImmer } from 'use-immer';

const [position, updatePosition] = useImmer({ x: 0, y: 0 });

updatePosition(draft => {
  draft.x += 10;
});
```

- draft 객체를 직접 수정하는 것처럼 보이지만,
- 실제로는 불변성을 지키는 새로운 객체를 생성해준다.

---

## 요약

| 구분 | 설명 |
|:---|:---|
| 직접 수정 | ❌ 리렌더링되지 않음, 버그 위험 |
| 새로운 객체 생성 | ✅ 안전하고 React가 인식 가능 |
| 중첩 객체 | 얕은 복사 후 일부 수정 |
| 복잡할 때 | Immer 사용 추천 |

