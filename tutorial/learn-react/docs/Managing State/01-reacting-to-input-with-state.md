# 📘 State를 사용해 Input 다루기

React는 **선언형 방식**으로 UI를 조작하며, 사용자 입력에 따라 상태(`state`)를 갱신하고, 그에 따라 UI를 자동으로 갱신한다.

---

## 📌 학습 목표

- 명령형이 아닌 **선언형 UI 프로그래밍** 이해하기
- 컴포넌트의 다양한 **시각적 state 열거**
- 상태 전환을 **트리거하는 방식** 이해
- **불필요한 state 제거**를 통한 리팩토링
- **이벤트 핸들러**를 통한 상태 업데이트 연결

---

## 🆚 선언형 vs 명령형 UI

### 명령형 방식
- 사용자 입력마다 명시적으로 UI 조작
- DOM 조작이 많아지고, 복잡해질수록 **버그 발생 가능성 증가**
- 예시:
  ```js
  async function handleFormSubmit(e) {
    e.preventDefault();
    disable(textarea);
    disable(button);
    show(loadingMessage);
    try {
      await submitForm(textarea.value);
      show(successMessage);
      hide(form);
    } catch (err) {
      show(errorMessage);
    } finally {
      hide(loadingMessage);
      enable(textarea);
      enable(button);
    }
  }
  ```

### 선언형 방식 (React 스타일)
- **무엇을 보여줄지** 선언만 하면 됨
- 상태에 따라 UI 자동 업데이트
- 예시:
  ```jsx
  export default function Form({ status = 'empty' }) {
    if (status === 'success') {
      return <h1>That's right!</h1>
    }
    return (
      <>
        <h2>City quiz</h2>
        <form>
          <textarea disabled={status === 'submitting'} />
          <button disabled={status === 'empty' || status === 'submitting'}>Submit</button>
          {status === 'error' && <p className="Error">Try again!</p>}
        </form>
      </>
    )
  }
  ```

---

## 🎯 React에서 선언형 UI 구현 단계

### 1. 시각적 상태 정의
- Empty: 비활성화된 버튼
- Typing: 버튼 활성화
- Submitting: 버튼/폼 비활성화 + 스피너
- Success: “감사합니다” 메시지
- Error: 메시지 + 다시 입력

### 2. 상태 변화 트리거
- **휴먼 입력**: 타이핑, 클릭 등 → 상태 변경
- **컴퓨터 입력**: 네트워크 응답 등 → 상태 변경

### 3. useState로 상태 모델링
```jsx
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing' | 'submitting' | 'success'
```

### 4. 불필요한 상태 제거
- `isTyping`, `isEmpty` → `answer.length === 0` 으로 대체 가능
- `isError` → `error !== null` 으로 판단 가능
- 여러 boolean → `status` 하나로 통합

### 5. 이벤트 핸들러 연결
```jsx
function handleTextareaChange(e) {
  setAnswer(e.target.value);
}

function handleSubmit(e) {
  e.preventDefault();
  setStatus('submitting');
  submitForm(answer).then(() => {
    setStatus('success');
  }).catch(err => {
    setError(err);
    setStatus('typing');
  });
}
```

---

## ✅ 요약

- React는 **명령이 아닌 선언**을 통해 UI를 구성함
- 상태에 따라 UI가 **자동으로 리렌더링**
- 컴포넌트를 작성할 때 아래 절차 따르기:

  1. 모든 시각적 state 정의
  2. state 변화의 트리거 분석
  3. `useState`로 상태 모델링
  4. 불필요한 state 제거 (리팩토링)
  5. 이벤트 핸들러로 상태 전환 연결

---
# 챌린지 도전하기

## 1. CSS 클래스를 추가하고 제거하기

### 예제코드 문제점
- isActive는 어떤 요소가 active인지 모호
- 아래 상태 변화에 따른 backgroundClassName, pictureClassName은 랜더링 할때마다 수행되어 성능상 낭비 -> useEffect 사용

```
import { useState } from 'react'

export default function Picture() {
  const [activeTarget, setActiveTarget] = useState('background')
  
  return (
    <div 
      className={`background ${activeTarget === 'background' ? 'background--active': ''}`} 
      onClick={() => setActiveTarget('background')}>
      <img
        className={`picture ${activeTarget === 'picture' ? 'picture--active': ''}`}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={(e) => {
          e.stopPropagation()
          setActiveTarget('picture')}
        }
      />
    </div>
  );
}

```

```
import { useState } from 'react'

export default function Picture() {
  const [isPictureActive, setIsPictureActive] = useState(false)
  
  return (
    <div 
      className={`background ${isPictureActive ? '': 'background--active'}`}
      onClick={() => { 
        if (isPictureActive) {
          setIsPictureActive(false)
        }
      }}
      >
      <img
        className={`picture ${isPictureActive ? 'picture--active': ''}`}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={(e) => {
          e.stopPropagation()
          if (!isPictureActive) {
            setIsPictureActive(true)
          }
        }}
      />
    </div>
  );
}

```

## 2. 프로필 편집기
### 예제코드 문제점
- <p><i>Hello, {firstName} {lastName}!</i></p> -> 두 값이 모두 없는 경우 불필요하게 랜더링

```
import { useState } from 'react'

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      setIsEditing(!isEditing)
    }}>
      <label>
        First name:{' '}
        {isEditing ? <input onChange={(e) => setFirstName(e.target.value)} placeholder='Jane'/> : <b>{firstName}</b>}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? <input onChange={(e) => setLastName(e.target.value)} placeholder='Jacobs'/> : <b>{lastName}</b>}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      {(firstName || lastName) && <p><i>Hello, {firstName} {lastName} !</i></p>}
    </form>
  );
}
```

## 3. 명령형 코드를 React 없이 리팩토링하기

### 예제코드 문제점

- 템플릿 리터럴 미사용
helloText.textContent = (
    'Hello ' +
    firstName + ' ' +
    lastName + '!'
  );
