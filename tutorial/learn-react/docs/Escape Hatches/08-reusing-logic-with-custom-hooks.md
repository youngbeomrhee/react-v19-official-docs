
# 커스텀 Hook 가이드

React에서 로직을 재사용하고 컴포넌트를 더 간결하게 만드는 커스텀 Hook에 대해 정리한 문서야.

---

## 🎯 커스텀 Hook이란?

- `useState`, `useEffect` 등과 같은 내장 Hook 외에, 반복되는 로직을 추출하여 재사용 가능한 함수를 만드는 것
- `use`로 시작하는 이름을 갖고, 내부에서 Hook을 사용할 수 있음

---

## 📦 로직 재사용: useOnlineStatus 예제

### 중복된 로직 (예시)

```js
const [isOnline, setIsOnline] = useState(true);
useEffect(() => {
  function handleOnline() { setIsOnline(true); }
  function handleOffline() { setIsOnline(false); }
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```

### 커스텀 Hook 추출

```js
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() { setIsOnline(true); }
    function handleOffline() { setIsOnline(false); }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

---

## 🧠 커스텀 Hook의 특징

- Hook은 로직을 공유하지 state를 공유하진 않아
- 동일한 Hook을 여러 번 호출해도 서로 다른 state를 갖게 됨
- 의존성 변경 감지에 따라 내부 Effect가 다시 동작함

---

## 🛠 Hook 이름 짓기 규칙

- Hook 이름은 `use`로 시작해야 함
- 내부에 React Hook을 사용하지 않으면 `use`를 붙이지 말 것

---

## 📌 커스텀 Hook을 사용하는 이유

- Effect 사용을 추상화하고 간결하게 함
- 복잡한 외부 API 동기화를 캡슐화
- 향후 React API가 업데이트되어도 한 곳에서 수정 가능

---

## 🧩 고급 예시

- `useData(url)`: fetch 처리 추상화
- `useChatRoom({ roomId, serverUrl, onReceiveMessage })`: 채팅 연결 로직 캡슐화
- `useFadeIn(ref, duration)`: 애니메이션 로직 분리

---

## ⚠️ 피해야 할 커스텀 Hook 예시

- 생명주기를 감싸는 추상적 Hook (예: `useMount`, `useEffectOnce`)
- 너무 추상적인 Hook: 목적이 불명확하거나 남용될 수 있음

---

## ✅ 요약 체크리스트

- [x] Hook 이름은 `use`로 시작할 것
- [x] 커스텀 Hook은 state를 공유하는 것이 아니라 저장 방식을 공유
- [x] 컴포넌트 목적을 더 명확히 표현하게 해야 함
- [x] 외부 API와의 통신은 Effect가 아닌 Hook으로 감싸자
- [x] 복잡도에 따라 Hook을 계층적으로 추출하자

---

React 앱을 잘 설계하려면 커스텀 Hook은 필수 도구야. 이걸 잘 활용하면 코드 가독성과 유지보수성이 훨씬 좋아져.

---

## 🧠 정리 요약

- 커스텀 Hook을 사용하면 컴포넌트 간 로직을 공유할 수 있습니다.
- 커스텀 Hook의 이름은 use 뒤에 대문자로 시작되어야 합니다.
- 커스텀 Hook은 state 자체가 아닌 state 저장 로직만 공유합니다.
- 하나의 Hook에서 다른 Hook으로 반응형 값을 전달할 수 있고, 값은 최신 상태로 유지됩니다.
- 모든 Hook은 컴포넌트가 재렌더링될 때 마다 재실행됩니다.
- 커스텀 Hook의 코드는 컴포넌트 코드처럼 순수해야 합니다.
- 커스텀 Hook을 통해 받는 이벤트 핸들러는 Effect로 감싸야 합니다.
- useMount같은 커스텀 Hook을 생성하면 안 됩니다. 용도를 명확히 하세요.
- 코드의 경계를 선택하는 방법과 위치는 여러분이 결정할 수 있습니다.
