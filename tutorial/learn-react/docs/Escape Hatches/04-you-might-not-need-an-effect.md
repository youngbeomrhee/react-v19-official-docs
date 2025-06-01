# Effect가 필요하지 않은 경우

## 📌 핵심 요점

- Effect는 외부 시스템과 동기화할 때 사용하는 **React의 탈출구**다.
- 순수한 렌더링 로직, 이벤트 응답, 내부 state 계산에는 **Effect가 불필요**하다.
- 불필요한 Effect는 성능 저하와 버그의 원인이 될 수 있다.

---

## ✅ Effect가 필요 없는 경우

### 1. 렌더링 중 데이터 계산
```js
const fullName = firstName + ' ' + lastName;
```
렌더링 중 계산으로 충분하며, Effect와 중복 state는 피해야 한다.

### 2. 값비싼 계산 캐싱 (useMemo 사용)
```js
const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
```
필요할 때만 다시 계산하도록 최적화.

### 3. props 변경 시 state 초기화 (key 사용)
```jsx
<Profile userId={userId} key={userId} />
```
key 변경으로 컴포넌트와 state를 재설정.

### 4. props 변경 시 state 조정 (렌더링 중 조건문)
```js
if (items !== prevItems) {
  setPrevItems(items);
  setSelection(null);
}
```

### 5. 이벤트 핸들러 간 로직 공유
```js
function buyProduct() {
  addToCart(product);
  showNotification(...);
}
```
공통 함수 추출 → 이벤트 핸들러에서 호출.

### 6. 이벤트 기반 POST 요청
```js
function handleSubmit() {
  post('/api/register', { firstName, lastName });
}
```
Effect 대신 이벤트 핸들러에서 요청.

### 7. 연쇄 계산 (하나의 이벤트 핸들러 내 처리)
```js
function handlePlaceCard() {
  setGoldCardCount(goldCardCount + 1);
  setRound(round + 1);
}
```

### 8. 앱 최초 로딩 시 초기화 (Effect 외부 또는 단일 실행 조건 추가)
```js
if (typeof window !== 'undefined') {
  checkAuthToken();
}
```

### 9. 부모에게 state 변경 알리기 (이벤트 내에서 직접 처리)
```js
function updateToggle(next) {
  setIsOn(next);
  onChange(next);
}
```

### 10. 부모에게 데이터 전달 (부모에서 fetch 후 전달)
```js
const data = useSomeAPI();
return <Child data={data} />;
```

---

## ✅ 외부 시스템과 동기화할 때는 Effect 사용

### 11. 외부 저장소 구독 (useSyncExternalStore 사용 권장)
```js
useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
```

### 12. 데이터 가져오기
```js
useEffect(() => {
  let ignore = false;
  fetchResults().then(json => {
    if (!ignore) setResults(json);
  });
  return () => { ignore = true; };
}, [query, page]);
```
정리 함수로 경쟁 조건 방지.

---

## 📚 요약

- 렌더링 중에 무언가를 계산할 수 있다면 Effect가 필요하지 않습니다.
- 비용이 많이 드는 계산을 캐시하려면 useEffect 대신 useMemo를 추가하세요.
- 전체 컴포넌트 트리의 state를 초기화하려면 다른 key를 전달하세요.
- prop 변경에 대한 응답으로 특정 state bit를 초기화하려면 렌더링 중에 설정하세요.
- 컴포넌트가 표시되어 실행되는 코드는 Effect에 있어야 하고 나머지는 이벤트에 있어야 합니다.
- 여러 컴포넌트의 state를 업데이트해야 하는 경우 단일 이벤트 중에 수행하는 것이 좋습니다.
- 다른 컴포넌트의 state 변수를 동기화하려고 할 때마다 state 끌어올리기를 고려하세요.
- Effect로 데이터를 가져올 수 있지만 경쟁 조건을 피하기 위해 정리를 구현해야 합니다.
