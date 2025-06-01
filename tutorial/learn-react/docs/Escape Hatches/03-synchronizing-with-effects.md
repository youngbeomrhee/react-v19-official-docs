## ✅ 1. Effect란?
- 컴포넌트 렌더링에 의해 실행되는 **비동기 부수 효과(side effects)**를 다루는 방식.
- DOM 업데이트, 네트워크 요청, 타이머, 외부 라이브러리 연동 등에 사용.
- `useEffect()` 훅을 통해 사용하며, 렌더링 후 실행됨.

---

## ✅ 2. 이벤트 vs. Effect

| 항목 | 이벤트 핸들러 | useEffect |
|------|----------------|------------|
| 실행 시점 | 사용자 인터랙션 후 | 컴포넌트 렌더링 후 |
| 목적 | 상태 변경 / 즉각 반응 | 외부 시스템과 동기화 (ex. fetch, animation 등) |
| 내부 상태 접근 | 즉시 가능 | 렌더링 후 접근 가능 (DOM 존재 보장됨) |

---

## ✅ 3. useEffect 기본 구조

```tsx
useEffect(() => {
  // 1. Effect 실행 (마운트 또는 의존성 변경 시)
  return () => {
    // 2. Cleanup 함수 (언마운트 또는 다음 effect 실행 전)
  };
}, [deps]);
```

- `[]` → 마운트 시 한 번만 실행
- `[값]` → 해당 값이 변경될 때만 실행
- 생략 → 매 렌더링마다 실행

---

## ✅ 4. 클린업(Cleanup) 함수란?

- 컴포넌트가 언마운트되거나 다음 Effect 실행 전에 **정리 동작 수행**
- 메모리 누수 방지 및 이전 상태 제거에 필요

### 예시

```tsx
useEffect(() => {
  const id = setInterval(doSomething, 1000);
  return () => clearInterval(id); // 타이머 제거
}, []);
```

---

## ✅ 5. 대표적인 사용 사례

### 5.1 DOM 조작

```tsx
useEffect(() => {
  elementRef.current.scrollIntoView();
}, []);
```

### 5.2 서버 요청

```tsx
useEffect(() => {
  fetch("/api/data").then(setData);
}, []);
```

### 5.3 외부 라이브러리(tweening 등)

```tsx
useEffect(() => {
  const tl = gsap.timeline();
  tl.to(".box", { x: 100 });

  return () => {
    tl.kill();             // 타임라인 제거
    gsap.set(".box", { x: 0 }); // 초기화
  };
}, []);
```

---

## ✅ 6. 리액트의 Strict Mode와 Effect

- 개발 환경에선 **Effect가 두 번 실행됨** → 정리 함수와 동작 확인 용도
- 실제 앱에서는 한 번만 실행됨

---

## ✅ 7. 참고 패턴들

### 7.1 비동기 데이터 패치

```tsx
useEffect(() => {
  let ignore = false;
  fetchData().then(data => {
    if (!ignore) setState(data);
  });
  return () => { ignore = true; };
}, []);
```

### 7.2 이벤트 리스너 등록 및 해제

```tsx
useEffect(() => {
  const handleResize = () => console.log(window.innerWidth);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

---

## ✅ 8. 정리 요약

- 이벤트와 달리 Effect는 특정 상호작용이 아닌 렌더링 자체에 의해 발생합니다.
- Effect를 사용하면 컴포넌트를 외부 시스템(타사 API, 네트워크 등)과 동기화할 수 있습니다.
- 기본적으로 Effect는 모든 렌더링(초기 렌더링 포함) 후에 실행됩니다.
- React는 모든 의존성이 마지막 렌더링과 동일한 값을 가지면 Effect를 건너뜁니다.
- 의존성을 “선택”할 수 없습니다. 의존성은 Effect 내부의 코드에 의해 결정됩니다.
- 빈 의존성 배열([])은 컴포넌트 “마운팅”(화면에 추가됨)을 의미합니다.
- Strict Mode에서 React는 컴포넌트를 두 번 마운트합니다(개발 환경에서만!) 이는 Effect의 스트레스 테스트를 위한 것입니다.
- Effect가 다시 마운트로 인해 중단된 경우 클린업 함수를 구현해야 합니다.
- React는 Effect가 다음에 실행되기 전에 정리 함수를 호출하며, 마운트 해제 중에도 호출합니다.
