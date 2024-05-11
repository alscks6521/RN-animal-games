import profile from "./profileContainer";

/// 폴더 내에 index.tsx 파일이 존재하면,
// 다른 파일에서 해당 폴더를 임포트할 때 파일 이름을 명시하지 않고 폴더 이름만으로 임포트할 수 있다

// 즉, index.tsx 파일이 있다면,
// import Profile from './screens/profile' 과 같이 폴더명만으로 간단하게 임포트할 수 있다.
export default profile;
