# 📌 Extracting State Logic into a Reducer

컴포넌트 내부의 상태 업데이트 로직이 여러 이벤트 핸들러에 분산될 경우, 코드는 금방 복잡해져. 이런 경우에는 상태 로직을 하나의 **reducer 함수**로 통합하면 코드가 더 명확하고 관리하기 쉬워져.

---

## 🧠 학습 목표

- reducer 함수의 개념 이해
- useState → useReducer 리팩터링 방법
- 언제 reducer를 사용하는 게 좋은지
- 잘 설계된 reducer 작성법

---

## ⚙️ useState → useReducer 전환 3단계

### 1단계: setState → dispatch로 전환

```jsx
function handleAddTask(text) {
  dispatch({
    type: 'added',
    id: nextId++,
    text
  });
}
```

- 상태를 직접 설정하는 대신 `dispatch(action)`을 호출해서 업데이트를 위임해.
- 액션 객체는 일반 JS 객체이며 최소한의 정보만 포함하면 돼.

---

### 2단계: reducer 함수 작성

```jsx
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, { id: action.id, text: action.text, done: false }];
    }
    case 'changed': {
      return tasks.map(t => t.id === action.task.id ? action.task : t);
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw new Error('Unknown action: ' + action.type);
    }
  }
}
```

- reducer는 **순수 함수**로 작성해야 하며, 현재 상태와 액션을 받아서 새로운 상태를 반환해야 해.

---

### 3단계: 컴포넌트에 useReducer 적용

```jsx
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

- `useReducer`는 `[state, dispatch]`를 반환하고, 상태 로직을 reducer에 위임해.

---

## 🔍 useState vs useReducer 비교

| 항목            | useState                               | useReducer                             |
|-----------------|-----------------------------------------|-----------------------------------------|
| 코드 길이        | 짧음                                    | 길어질 수 있음                           |
| 가독성          | 단순한 경우 좋음                         | 복잡한 로직에 적합                        |
| 디버깅          | 추적 어려움                             | 액션 기반 추적 용이                      |
| 테스트 용이성   | 컴포넌트 종속                           | 순수 함수라 단독 테스트 가능              |
| 상태 구조화     | 간단한 값에 적합                         | 구조화된 복잡한 상태에 유리              |

---

## 🧪 reducer 작성 팁

1. **순수 함수**로 작성할 것 (부작용 금지)
2. 액션은 **단일 사용자 행동**을 나타내야 함
3. `switch` 문에서는 `{}` 블록 사용 권장
4. 리듀서는 상태 트랜지션 로직만 포함하고, API 호출이나 타이머 설정은 하지 않도록!

---

## 🪄 Immer로 간결한 reducer 작성

```bash
npm install immer use-immer
```

```js
import { useImmerReducer } from 'use-immer';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added':
      draft.push({ id: action.id, text: action.text, done: false });
      break;
    case 'changed':
      const index = draft.findIndex(t => t.id === action.task.id);
      draft[index] = action.task;
      break;
    case 'deleted':
      return draft.filter(t => t.id !== action.id);
  }
}
```

- `useImmerReducer`를 쓰면 `draft`를 직접 변경할 수 있고, 내부적으로 불변성을 유지해줘.

---

## 🔁 리팩터링 요약

- `useState` → `dispatch(action)`으로 전환
- 로직을 하나의 `reducer(state, action)` 함수로 집중
- reducer는 상태 구조를 명확하게 만들고, 디버깅과 테스트에 유리해
- 필요한 경우 Immer를 활용해 간결한 코드 작성 가능

---

## 📚 참고 링크

- [공식 문서: Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer)
