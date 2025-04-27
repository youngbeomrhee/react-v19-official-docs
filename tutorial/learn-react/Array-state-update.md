# React - 배열 State 업데이트하기 요약

## 핵심 개념

- **JavaScript 배열은 변경 가능하지만**, React state에서는 **배열을 직접 변경하면 안 된다.**
- **항상 새로운 배열을 만들어서 교체해야 한다.**
- `filter()`, `map()`, `slice()` 같은 **불변 함수**를 사용하자.

---

## 배열 업데이트할 때 추천 방법

| 비선호 (배열 변경) | 선호 (새 배열 반환) |
|:---|:---|
| `push`, `unshift` | `concat`, `[...arr]` |
| `pop`, `shift`, `splice` | `filter`, `slice` |
| `splice`, `arr[i] = ...` | `map` |
| `reverse`, `sort` | 복사 후 정렬 |

- `slice`는 복사 (O)
- `splice`는 원본 변경 (X)

**→ `slice`를 주로 쓰자.**

---

## 배열에 항목 추가하기

잘못된 예시 (직접 변경):

```jsx
<button onClick={() => {
  artists.push({ id: nextId++, name: name }); // ❌
}}>Add</button>
```

올바른 예시 (새 배열 생성):

```jsx
<button onClick={() => {
  setArtists([
    ...artists,
    { id: nextId++, name: name }
  ]);
}}>Add</button>
```

- 기존 `artists` 배열을 전개하고,
- 새 객체를 추가한 **새 배열**을 만들어 `setArtists` 호출.

---

## 배열에서 항목 제거하기

특정 항목 삭제:

```jsx
setArtists(artists.filter(artist => artist.id !== id));
```

- 조건을 만족하지 않는 항목만 남겨서 새 배열을 만든다.

---

## 배열의 항목 수정하기

특정 항목 변경:

```jsx
setArtists(artists.map(artist => {
  if (artist.id === id) {
    return { ...artist, name: newName };
  } else {
    return artist;
  }
}));
```

- `map()`을 사용해 특정 항목만 변경.
- 나머지 항목은 그대로 반환.

---

## 배열 정렬하기

- `sort()`는 원본 배열을 변경함 → 복사본에 적용해야 함.

```jsx
const nextArtists = [...artists];
nextArtists.sort((a, b) => a.name.localeCompare(b.name));
setArtists(nextArtists);
```

---

## Immer를 사용하면?

- Immer를 쓰면 배열이나 객체를 "수정"하는 듯한 코드 작성 가능.
- 실제로는 불변성을 유지하는 새 객체를 만들어줌.

```jsx
import { useImmer } from 'use-immer';

const [artists, updateArtists] = useImmer([]);

updateArtists(draft => {
  draft.push({ id: nextId++, name: name });
});
```

---

## 요약

| 구분 | 설명 |
|:---|:---|
| 항목 추가 | 전개 연산자 `...` 또는 `concat` 사용 |
| 항목 삭제 | `filter` 사용 |
| 항목 수정 | `map` 사용 |
| 정렬 | 복사 후 `sort` 적용 |
| 복잡할 때 | Immer 사용 고려 |
