
# React의 이벤트 핸들러와 Effect 이해 및 useEffectEvent 활용 가이드

## ✅ 개념 정리

### 1. 이벤트 핸들러 vs Effect

| 구분 | 이벤트 핸들러 | Effect |
|------|----------------|--------|
| 트리거 | 특정 상호작용 (클릭 등) | 렌더링 시점에서 상태나 prop 변화 |
| 반응성 | ❌ 비반응형 | ✅ 반응형 |
| 실행 이유 | 사용자 인터랙션 | 동기화 목적 |
| 예시 | 메시지 전송 | 서버 연결 유지 |

---

## ✅ 반응형과 비반응형 코드 구분

### 반응형 값
- `props`, `state`, `context` 등 렌더링에 영향을 주는 값

### 비반응형 값
- 외부 상수, DOM 이벤트 리스너 등

---

## ✅ 잘못된 코드 사례

```js
useEffect(() => {
  window.addEventListener('pointermove', handleMove);
  return () => window.removeEventListener('pointermove', handleMove);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

- `handleMove`는 `canMove`에 의존하지만, 의존성 배열이 비어 있어 최신 상태를 반영하지 않음.

---

## ✅ 해결책

### 🔹 useRef 사용

```js
const canMoveRef = useRef(canMove);
useEffect(() => {
  canMoveRef.current = canMove;
}, [canMove]);

useEffect(() => {
  const handleMove = (e) => {
    if (canMoveRef.current) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  };
  window.addEventListener('pointermove', handleMove);
  return () => window.removeEventListener('pointermove', handleMove);
}, []);
```

### 🔹 useCallback + 의존성 명시

```js
const handleMove = useCallback((e) => {
  if (canMove) {
    setPosition({ x: e.clientX, y: e.clientY });
  }
}, [canMove]);
```

### 🔹 experimental_useEffectEvent 사용 (비반응형 로직 분리)

```js
import { experimental_useEffectEvent as useEffectEvent } from 'react';

const onMove = useEffectEvent(e => {
  if (canMove) {
    setPosition({ x: e.clientX, y: e.clientY });
  }
});

useEffect(() => {
  window.addEventListener('pointermove', onMove);
  return () => window.removeEventListener('pointermove', onMove);
}, []);
```

---

## ✅ Effect 이벤트란?

- Effect 안에서만 호출 가능
- 최신 props/state에 접근 가능
- 의존성 배열에서 제외 가능
- `useEffectEvent`는 실험적 기능이며 안정화 버전은 아님

---

## 🚫 잘못된 예시: 외부 hook에 전달

```js
const onTick = useEffectEvent(() => {
  setCount(count + 1);
});

useTimer(onTick, 1000); // ❌ 금지: 외부로 전달
```

✅ 바른 사용:

```js
function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => onTick(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

---

## 🧠 정리 요약

- 이벤트 핸들러는 특정 상호작용에 대한 응답으로 실행됩니다.
- Effect는 동기화가 필요할 때마다 실행됩니다.
- 이벤트 핸들러 내부의 로직은 반응형이 아닙니다.
- Effect 내부의 로직은 반응형입니다.
- Effect의 비반응형 로직은 Effect 이벤트로 옮길 수 있습니다.
- Effect 이벤트는 Effect 내부에서만 호출하세요.
- Effect 이벤트를 다른 컴포넌트나 Hook에 전달하지 마세요.

---

# 챌린지 1. 업데이트되지 않는 변수 고치기
```
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        카운터: {count}
        <button onClick={() => setCount(0)}>재설정</button>
      </h1>
      <hr />
      <p>
        초당 증가량:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}

```
