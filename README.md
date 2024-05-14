### 반려동물 키우기 앱

이 앱은 반려동물 소유주들이 자신의 반려동물을 가상의 캐릭터로 키우고 관리할 수 있는 모바일 애플리케이션입니다.  
사용자는 반려동물의 종류를 선택하여 가상의 캐릭터를 생성할 수 있고, 해당 캐릭터의 선택한 동물의 레벨업과 애니메이션을 제공하는 앱 입니다.

---

#### 기술 스택

**Frontend:** React Native

**Backend:** Firebase (Authentication, Firestore, Storage)

**상태 관리:** React Hooks (useState, useEffect, useCallback, useMemo, useRef)

**애니메이션:** React Native Animated API

**스타일링:** Styled Components

---

#### 데이터베이스 구조

이 앱은 Firebase의 Firestore를 데이터베이스로 사용합니다.

**users 컬렉션**.

사용자 정보를 저장

```
users
├── userId
│ ├── selectedAnimalId: string
│ └── ... (기타 사용자 정보)
```

**user_animals 컬렉션**

사용자가 선택한 반려동물 캐릭터의 정보를 저장.

```
user_animals
├── userId_animalId
│ ├── animalId: string
│ ├── userId: String
│ ├── experience: number
└ └── level: number
```

---

#### 모델링

**Animal 타입**

```typescript
typescriptCopy codetype Animal = {
id: string;
type: string;
level: number;
imageUrl: string;
moveGifUrl: string;
};
```

- **id:** 캐릭터의 고유 식별자
- **type:** 반려동물의 종류 (예: 강아지, 고양이 등)
- **level:** 캐릭터의 레벨
- **imageUrl:** 캐릭터 이미지의 URL
- **moveGifUrl:** 캐릭터 움직임 애니메이션 GIF 파일의 URL

---

#### 주요 기능

1. Animal

- 반려동물 종류 선택
- 가상 반려동물 캐릭터 생성
- 반려동물 레벨업
- 반려동물 애니메이션 (움직임, 반전 등)
- 동물 이미지 및 애니메이션 파일 캐싱.

2. User

- 사용자간의 반려동물 게시 공유
- ***

#### 이미지 작업

디자인 사용된 이미지들 출처 - Ai 이미지 제작 요청 및 수정

---

## 프로젝트 파일 내의 Firebase 설정

Firebase를 설정하려면 다음 단계를 따르세요:

1. 템플릿 파일 `firebaseConfig.template.tsx`를 `firebaseConfig.tsx`로 복사합니다.
2. 값을 실제 Firebase 구성 값으로 바꿉니다.
