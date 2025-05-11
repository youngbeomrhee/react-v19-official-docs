# 🔗 컴포넌트 간 State 공유하기

두 컴포넌트의 상태가 함께 동기화되어야 할 때, state를 공통 부모로 끌어올려 props로 전달하는 방식이 필요함. 이를 **State 끌어올리기 (Lifting State Up)** 라고 함.

---

## ✅ 핵심 개념 요약

- **State 끌어올리기**: 공통 부모 컴포넌트로 state를 옮기고, 하위 컴포넌트에 props로 전달
- **제어 컴포넌트**: 부모 컴포넌트가 상태를 props로 전달하여 제어
- **비제어 컴포넌트**: 자체 state를 가지고 독립적으로 동작

---

## 📚 끌어올리기 단계

### Step 1: 자식에서 state 제거

```tsx
// 기존 Panel (비제어 컴포넌트)
function Panel({ title, children }) {
  const [isActive, setIsActive] = useState(false);
  ...
}

// 수정된 Panel (제어 컴포넌트)
function Panel({ title, children, isActive }) {
  ...
}
```

---

### Step 2: 부모에서 하드 코딩된 값 전달

```tsx
<Panel title="About" isActive={true}>...</Panel>
<Panel title="Etymology" isActive={false}>...</Panel>
```

---

### Step 3: 부모에 state 추가 및 핸들러 전달

```tsx
function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >...</Panel>

      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >...</Panel>
    </>
  );
}

function Panel({ title, children, isActive, onShow }) {
  return (
    <section>
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>Show</button>
      )}
    </section>
  );
}
```

---

## 🎛 제어 vs 비제어 컴포넌트

| 유형 | 정의 | 예시 |
|------|------|------|
| 제어 컴포넌트 | props로 상태를 받아 부모가 제어함 | `<input value={text} onChange={...} />` |
| 비제어 컴포넌트 | 자체 state로 독립적으로 동작 | `<input defaultValue="hello" />` |

- 제어 컴포넌트: 더 많은 설정 가능성과 동기화
- 비제어 컴포넌트: 간단하고 독립적

---

## 📌 단일 진리의 원천 (Single Source of Truth)

- 상태는 가능한 중복 없이 **단일 컴포넌트에 존재**해야 함
- 상태를 공유할 필요가 있을 경우 **공통 부모로 끌어올리고** props를 통해 전달
- 애플리케이션이 커질수록 **상태 위치를 유연하게 조정하는 리팩토링**은 자연스러운 과정

---

## 📝 요약

- 두 컴포넌트를 조정하려면 **state를 공통 부모로 끌어올린다**
- **props로 값을 전달하고**, **이벤트 핸들러로 자식 → 부모 상호작용을 설계**
- 상태를 어디에 둘지는 **단일 진리의 원천** 관점에서 고민하자
- 컴포넌트를 **제어형으로 만들지, 비제어형으로 둘지** 고려하면 설계에 도움이 됨
