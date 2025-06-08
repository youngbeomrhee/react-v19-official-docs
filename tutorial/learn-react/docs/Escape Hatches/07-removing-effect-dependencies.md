
# Effect 의존성 제거 가이드

React `useEffect`에서 의존성을 적절히 다루는 방법과 무한 루프를 방지하고, 불필요한 리렌더링을 피하는 전략을 정리한 문서입니다.

---

## 📘 핵심 개념

- **반응형 값(Reactive Values)**: props, state, context, 렌더링 중 생성되는 함수나 객체
- **Effect는 항상 의존성 목록과 동기화**되어야 하며, 무시하거나 억제하는 것은 버그의 원인이 됨

---

## 🔁 무한 루프를 유발하는 잘못된 의존성

```js
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, []); // ❌ roomId가 누락됨
```

- `roomId`는 props이므로 의존성이 반드시 포함되어야 함
- 해결 방법:

```js
useEffect(() => {
  const connection = createConnection(serverUrl, roomId);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]); // ✅ 모든 의존성 포함
```

---

## 🧠 의존성을 제거하려면?

### 방법 1: 반응형 값을 외부로 이동

```js
const roomId = 'music'; // 컴포넌트 외부
```

### 방법 2: Effect 내부로 객체/함수 이동

```js
useEffect(() => {
  const options = { serverUrl, roomId };
  const connection = createConnection(options);
  ...
}, [roomId]); // ✅ roomId만 의존성
```

---

## 🚨 린터 억제는 위험하다

```js
// eslint-disable-next-line react-hooks/exhaustive-deps
```

- 직관적으로 디버깅하기 힘든 버그 유발
- 리렌더링 시 오래된 값 사용 가능성 존재

---

## 💡 리렌더링 없이 최신 값 읽기

- `useEffectEvent` (React 실험적 API)
- 예시:

```js
const onMessage = useEffectEvent((msg) => {
  if (!isMuted) playSound();
});
```

- Effect에서 읽는 대신, 이벤트 핸들러처럼 사용

---

## ⚠️ 객체/함수 의존성 조심

- 매 렌더링마다 새로운 참조값 생성됨
- 해결:
  - 컴포넌트 외부로 추출
  - 원시값만 사용
  - Effect 내부로 함수나 객체 정의 이동

---

## 📦 Effect가 너무 많은 작업을 할 때는 분리

### ❌ 하나의 Effect에서 모든 fetch 처리

```js
useEffect(() => {
  fetchCities(country);
  fetchAreas(city);
}, [country, city]);
```

### ✅ 두 개의 Effect로 분리

```js
useEffect(() => { fetchCities(country); }, [country]);
useEffect(() => { fetchAreas(city); }, [city]);
```

---

## ✅ 요약 체크리스트

- [x] 모든 반응형 값이 의존성에 포함되어야 함
- [x] Effect가 수행하는 작업 단위는 하나의 목적에 집중되어야 함
- [x] 객체/함수는 외부 또는 내부로 이동
- [x] 이벤트 기반 처리에는 이벤트 핸들러로 이동
- [x] 린터 억제 금지! 대신 의존성을 제거할 수 있는 구조로 변경

---

더 깊이 이해하고 싶으면 `useEffect`, `useCallback`, `useMemo`, `useRef`, `useEffectEvent`의 동작 차이를 함께 학습하면 좋아.

---

## 🧠 정리 요약

- 의존성은 항상 코드와 일치해야 합니다.
- 의존성이 마음에 들지 않으면 코드를 수정해야 합니다.
- 린터를 억제하면 매우 혼란스러운 버그가 발생하므로 항상 피해야 합니다.
- 의존성을 제거하려면 해당 의존성이 필요하지 않다는 것을 린터에게 “증명”해야 합니다.
- 특정 상호작용에 대한 응답으로 일부 코드가 실행되어야 하는 경우 해당 코드를 이벤트 핸들러로 이동하세요.
- Effect의 다른 부분이 다른 이유로 다시 실행되어야 하는 경우 여러 개의 Effect로 분할하세요.
- 이전 State를 기반으로 일부 State를 업데이트하려면 업데이터 함수를 전달하세요.
- ”반응”하지 않고 최신 값을 읽으려면 Effect에서 Effect 이벤트를 추출하세요.
- 자바스크립트에서 객체와 함수는 서로 다른 시간에 생성된 경우 서로 다른 것으로 간주됩니다.
- 객체와 함수의 의존성을 피하세요. 컴포넌트 외부나 Effect 내부로 이동하세요.
