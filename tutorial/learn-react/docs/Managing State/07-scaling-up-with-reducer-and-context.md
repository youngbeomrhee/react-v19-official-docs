# 📌 리듀서와 컨텍스트를 활용한 상태 관리 확장

## 🧠 개요

- `useReducer`는 컴포넌트의 상태 업데이트 로직을 통합할 수 있게 해줘.
- `Context`는 컴포넌트 트리 깊숙한 곳까지 데이터를 전달할 수 있게 해줘.
- 이 둘을 결합하면 복잡한 화면의 상태를 효율적으로 관리할 수 있어.

## 🔧 구현 단계

### 1단계: 컨텍스트 생성

상태와 디스패치 함수를 각각의 컨텍스트로 생성해.

```jsx
import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);
```

### 2단계: 상태와 디스패치 함수를 컨텍스트에 제공

`useReducer`를 사용하여 상태와 디스패치 함수를 생성하고, 이를 컨텍스트 프로바이더를 통해 하위 컴포넌트에 제공해.

```jsx
import { useReducer } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {/* 하위 컴포넌트들 */}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}
```

### 3단계: 하위 컴포넌트에서 컨텍스트 사용

하위 컴포넌트에서는 `useContext`를 사용하여 상태와 디스패치 함수를 사용할 수 있어.

```jsx
import { useContext } from 'react';
import { TasksContext, TasksDispatchContext } from './TasksContext.js';

function TaskList() {
  const tasks = useContext(TasksContext);
  const dispatch = useContext(TasksDispatchContext);

  // tasks를 렌더링하고, dispatch를 사용하여 상태 업데이트
}
```

## 🧹 컴포넌트 정리

컨텍스트와 리듀서를 한 파일로 정리하여 컴포넌트를 깔끔하게 유지할 수 있어.

```jsx
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
```


이렇게 하면 `TaskApp` 컴포넌트는 더 간결해져.

```jsx
import { TasksProvider } from './TasksContext.js';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

## ✅ 요약

- `useReducer`와 `Context`를 함께 사용하면 복잡한 상태를 효율적으로 관리할 수 있어.
- 상태와 디스패치 함수를 각각의 컨텍스트로 분리하여 필요한 컴포넌트에서만 사용하도록 할 수 있어.
- 이러한 패턴은 상태 관리의 명확성과 유지보수성을 향상시켜.
