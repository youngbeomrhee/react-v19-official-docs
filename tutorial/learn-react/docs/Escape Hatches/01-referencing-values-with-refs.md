# Ref로 값 참조하기

컴포넌트가 일부 정보를 “기억”하고 싶지만, 해당 정보가 **렌더링을 유발하지 않도록** 하려면 `Ref`를 사용하자.

---

## 📚 학습 내용

- 컴포넌트에 Ref를 어떻게 추가하는가  
- Ref의 값이 어떻게 업데이트되는가  
- Ref가 State와 어떻게 다른가  
- Ref를 어떻게 안전하게 사용할까  

---

## 🛠 컴포넌트에 Ref 추가하기

```tsx
import { useRef } from 'react';

export default function Counter() {
  const ref = useRef(0);

  function handleClick() {
    ref.current += 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```

- `useRef(initialValue)`는 `{ current: initialValue }` 형태의 객체를 반환함  
- `ref.current` 값을 읽거나 쓸 수 있음  
- 변경해도 렌더링이 발생하지 않음  

---

## 🕒 예시: 스톱워치 만들기

### State만 사용한 예시

```tsx
import { useState } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  const secondsPassed = startTime && now ? (now - startTime) / 1000 : 0;

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>Start</button>
    </>
  );
}
```

### Ref로 Interval ID 저장한 예시

```tsx
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  const secondsPassed = startTime && now ? (now - startTime) / 1000 : 0;

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </>
  );
}
```

---

## 🔍 Ref와 State의 차이

| 구분 | Ref | State |
|------|-----|-------|
| 선언 방식 | `useRef(initialValue)` | `useState(initialValue)` |
| 반환 형태 | `{ current: value }` | `[value, setValue]` |
| 리렌더 유발 | ❌ 변경해도 리렌더 없음 | ✅ 변경 시 리렌더 발생 |
| 변경 방식 | 직접 `ref.current` 수정 | `setValue()` 사용 |
| 렌더링 중 사용 | ❌ current 값 읽기/쓰기 피해야 함 | ✅ 안전하게 사용 가능 |
| 용도 | 외부 값 저장 (예: ID, DOM 등) | UI와 연관된 상태 |

---

## 💡 Ref를 사용할 시기

Ref는 다음과 같은 상황에서 유용하게 사용됨:

- **Timeout / Interval ID 저장**
- **DOM 엘리먼트에 직접 접근**
- **렌더링에 필요 없는 객체 저장**

Ref는 **React의 단방향 데이터 흐름에서 벗어나야 할 때** 유용한 탈출구이지만, 필요할 때만 사용하는 것이 좋음.

---

## ❗ Ref로 상태를 관리하면 발생하는 문제 예시

```tsx
import { useRef } from 'react';

export default function Counter() {
  const countRef = useRef(0);

  function handleClick() {
    countRef.current += 1;
  }

  return (
    <button onClick={handleClick}>
      You clicked {countRef.current} times
    </button>
  );
}
```

- 버튼을 클릭해도 화면이 업데이트되지 않음  
- `countRef.current`를 직접 수정했지만, 리렌더가 발생하지 않기 때문임  
- 이럴 땐 **State**를 사용해야 함

---

## ✅ 정리

- 렌더링이 필요 없는 값을 저장: `useRef`  
- 렌더링이 필요한 상태값 관리: `useState`  
- Ref는 탈출구이며, DOM 조작 또는 외부 값 저장에 사용  
- 리렌더링되지 않는다는 점을 명확히 이해하고 써야 함  

---

- 최신 State 읽기
아래와 같이 구현하면 충분하다
```
import { useState, useRef } from 'react';

export default function Chat() {
    const inputRef = useRef('')

    function handleSend() {
        setTimeout(() => {
            alert('Sending: ' + inputRef.current.value);
        }, 3000);
    }
 
    return (
        <>
            <input
                ref={inputRef}
                onChange={e => {inputRef.current.value = e.target.value}}
            />
            <button
                onClick={handleSend}>
                Send
            </button>
        </>
    );
}
