# 📦 State 구조 설계 가이드

컴포넌트의 상태를 잘 구조화하면 유지보수성과 디버깅 효율이 크게 향상됨.  
다음은 state 구조화 시 고려해야 할 주요 원칙과 예시들.

---

## ✅ State 구조화 원칙

- **연관된 state는 그룹화하자**  
  항상 함께 변경되는 값은 하나의 객체로 묶기 (`x`, `y` → `{ x, y }`)

- **불가능한 state 방지하기**  
  `isSending` + `isSent`처럼 모순 가능성이 있는 구조 대신, `status: 'typing' | 'sending' | 'sent'` 등 단일 상태로 관리

- **불필요한 state 제거하기**  
  `fullName` = `firstName + ' ' + lastName`처럼 계산 가능한 값은 state로 두지 않기

- **중복된 state 피하기**  
  동일 정보를 두 군데(state + source)에서 관리하지 않기 (예: `selectedItem` 대신 `selectedId` 저장)

- **깊게 중첩된 구조 피하기**  
  중첩된 트리 구조 대신 평탄화(정규화)된 구조로 설계해 업데이트 용이성 확보

---

## ⚙️ 사례 요약

### 1. 연관된 state 그룹화

```tsx
// ❌ 나쁜 예
const [x, setX] = useState(0);
const [y, setY] = useState(0);

// ✅ 좋은 예
const [position, setPosition] = useState({ x: 0, y: 0 });
```

---

### 2. 불가능한 state 방지

```tsx
// ✅ status 단일 상태로 처리
const [status, setStatus] = useState('typing');

const isSending = status === 'sending';
const isSent = status === 'sent';
```

---

### 3. 불필요한 state 제거

```tsx
// ❌ fullName은 계산 가능한 값
const fullName = firstName + ' ' + lastName;
```

---

### 4. 중복된 state 제거

```tsx
// ❌ 중복: selectedItem 객체
const [selectedItem, setSelectedItem] = useState(items[0]);

// ✅ 대체: selectedId만 저장
const [selectedId, setSelectedId] = useState(0);
const selectedItem = items.find(i => i.id === selectedId);
```

---

### 5. 깊은 중첩 피하기 (정규화 예시)

```tsx
// ❌ 깊은 중첩 구조
place.childPlaces[...].childPlaces[...]

// ✅ 평탄화된 구조
{
  0: { id: 0, title: 'Root', childIds: [1, 2] },
  1: { id: 1, title: 'Earth', childIds: [3] },
  ...
}
```

---

## 🧠 기억하자

- 항상 함께 업데이트되는 값은 **하나로 묶기**
- 상태 간 불일치가 없도록 **단일 source of truth 유지**
- props는 state에 **불필요하게 복사하지 말 것**
- deeply nested 구조는 **업데이트 난이도 상승** → **정규화 권장**

## 2. 깨진 포장 목록 수정하기

### 예제코드 문제점
- useMemo 미적용 -> 배열의 크기가 클 경우 성능상 

```
import { useState, useMemo } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Warm socks', packed: true },
  { id: 1, title: 'Travel journal', packed: false },
  { id: 2, title: 'Watercolors', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);

  const total = useMemo(() => items.length, [ items ])
  const packed = useMemo(() => items.filter(e => e.packed).length, [ items ])
  
  function handleAddItem(title) {
    // setTotal(total + 1);
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    // if (nextItem.packed) {
    //   setPacked(packed + 1);
    // } else {
    //   setPacked(packed - 1);
    // }
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    // setTotal(total - 1);
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} out of {total} packed!</b>
    </>
  );
}
```
