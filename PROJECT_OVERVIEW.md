# CP Dashboard Project Overview

## 1. 프로젝트 개요

이 프로젝트는 `Spring Boot + React` 구조로 만든 CP 대시보드 시스템이다.

역할 분리는 다음과 같다.

- `Spring Boot`
  - SSO 인증 처리
  - 세션 관리
  - DB 조회/저장
  - 권한 체크
  - API 제공
- `React`
  - 화면 렌더링
  - 대시보드/관리자/상세 페이지 UI
  - 사용자 이벤트 처리
  - 백엔드 API 호출 결과 표시

즉, 화면은 React가 만들고 실제 데이터/인증/권한은 Spring Boot가 처리하는 구조다.

---

## 2. 현재 기술 스택

### Backend

- Java `17`
- Spring Boot `3.5.15`
- Spring Dependency Management `1.1.7`
- MyBatis Spring Boot Starter `3.0.5`
- Oracle JDBC `ojdbc11`

### Frontend

- React `19.2.7`
- React DOM `19.2.7`
- Vite `8.1.0`
- TypeScript `6.0.2`

### DB / Infra

- Oracle DB
- Linux 서버 배포 예정
- SSO 연동 예정

---

## 3. 왜 Spring Boot + React를 같이 쓰는가

이 프로젝트는 대시보드, 섹터 배치 편집, 관리자 화면, 상세 화면처럼 동적인 UI가 많다.

그래서 다음처럼 분리하는 것이 유리하다.

- `React`는 복잡한 화면 상태와 사용자 인터랙션 처리에 강하다.
- `Spring Boot`는 인증, 세션, DB, 파일 처리, 권한 제어에 강하다.
- 둘을 `API`로 연결하면 역할이 명확하고 유지보수가 쉬워진다.

실무적으로도 매우 일반적인 구조다.

---

## 4. 전체 동작 방식

### 개발 환경 실행 구조

- 프론트엔드: `http://localhost:5173`
- 백엔드: `http://localhost:8080`

개발 중에는 둘을 따로 실행한다.

- React 개발 서버(Vite)가 화면을 띄운다.
- React에서 `/api/...` 호출을 하면 Vite Proxy가 Spring Boot `8080`으로 전달한다.

즉 브라우저 입장에서는 `5173`으로 접속하지만, API는 실제로 `8080`에서 처리된다.

---

## 5. 메인 접속 시 실제 로직 흐름

브라우저에서 `http://localhost:5173` 접속 시 흐름은 아래와 같다.

### 1단계. React 앱 시작

파일:

- [frontend/src/main.tsx](D:/ij/cp-dashboard/frontend/src/main.tsx)
- [frontend/src/App.tsx](D:/ij/cp-dashboard/frontend/src/App.tsx)

설명:

- `main.tsx`가 React 앱을 브라우저 DOM에 붙인다.
- `App.tsx`가 전체 화면 진입점이다.

### 2단계. 기존 세션 확인

파일:

- [frontend/src/App.tsx](D:/ij/cp-dashboard/frontend/src/App.tsx)
- [frontend/src/api/auth.ts](D:/ij/cp-dashboard/frontend/src/api/auth.ts)
- [src/main/java/com/company/cpdashboard/common/sso/SsoLoginController.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/sso/SsoLoginController.java)

호출 API:

- `GET /api/auth/me`

설명:

- 프론트가 먼저 현재 세션에 로그인 사용자가 있는지 확인한다.
- 백엔드에서 세션의 `loginUser`를 꺼내서 반환한다.

### 3단계. 세션이 없으면 SSO 파라미터 확인

파일:

- [frontend/src/App.tsx](D:/ij/cp-dashboard/frontend/src/App.tsx)
- [src/main/java/com/company/cpdashboard/common/sso/SsoAuthService.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/sso/SsoAuthService.java)
- [src/main/java/com/company/cpdashboard/common/sso/PlantecsSsoClientAdapter.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/sso/PlantecsSsoClientAdapter.java)
- [src/main/java/com/company/cpdashboard/common/sso/SpitSsoClientAdapter.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/sso/SpitSsoClientAdapter.java)

호출 API:

- `GET /api/sso/login?...`

설명:

- URL에 `accessToken`, `ssoToken`, `domainName`, `empcd`가 있는지 확인한다.
- 있으면 백엔드 `/api/sso/login`으로 넘긴다.
- 백엔드는 토큰에서 사번을 추출하고 DB에서 사용자 정보를 조회한 뒤 세션을 만든다.

### 4단계. SSO도 없으면 개발용 로그인 가능 여부 확인

파일:

- [frontend/src/App.tsx](D:/ij/cp-dashboard/frontend/src/App.tsx)
- [src/main/java/com/company/cpdashboard/common/sso/ManualLoginAccessPolicy.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/sso/ManualLoginAccessPolicy.java)

호출 API:

- `GET /api/auth/login-access`

설명:

- 현재 접속 IP가 개발용 수동 로그인 허용 대상인지 확인한다.
- 허용 대상이면 로그인 페이지를 보여준다.
- 허용 대상이 아니면 창 닫기 시도를 한다.

### 5단계. 개발용 로그인 화면에서 사번 입력

파일:

- [frontend/src/pages/LoginPage.tsx](D:/ij/cp-dashboard/frontend/src/pages/LoginPage.tsx)
- [frontend/src/api/auth.ts](D:/ij/cp-dashboard/frontend/src/api/auth.ts)
- [src/main/java/com/company/cpdashboard/common/sso/SsoLoginController.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/sso/SsoLoginController.java)

호출 API:

- `POST /api/auth/dev-login`

설명:

- 허용된 IP에서만 로그인 화면이 열린다.
- 사용자가 사번 6자리를 입력하면 백엔드가 사번 기준으로 사용자 정보를 조회하고 세션을 생성한다.

### 6단계. 인증 후 대시보드 표시

파일:

- [frontend/src/components/layout/Sidebar.tsx](D:/ij/cp-dashboard/frontend/src/components/layout/Sidebar.tsx)
- [frontend/src/components/layout/Topbar.tsx](D:/ij/cp-dashboard/frontend/src/components/layout/Topbar.tsx)
- [frontend/src/pages/DashboardPage.tsx](D:/ij/cp-dashboard/frontend/src/pages/DashboardPage.tsx)
- [frontend/src/components/dashboard/SectorCard.tsx](D:/ij/cp-dashboard/frontend/src/components/dashboard/SectorCard.tsx)

설명:

- 로그인 사용자 정보를 화면 상단과 좌측 메뉴에 표시한다.
- 메인 섹터 6개를 동일 크기 카드로 렌더링한다.

---

## 6. 대시보드 배치 편집 동작 방식

파일:

- [frontend/src/App.tsx](D:/ij/cp-dashboard/frontend/src/App.tsx)
- [frontend/src/utils/sectorOrder.ts](D:/ij/cp-dashboard/frontend/src/utils/sectorOrder.ts)
- [frontend/src/data/mock.ts](D:/ij/cp-dashboard/frontend/src/data/mock.ts)

설명:

- `isEditMode`: 현재 배치 편집 모드 여부
- `draggingSectorId`: 현재 끌고 있는 섹터 ID
- `dropTargetId`: 현재 내려놓을 목표 섹터 ID

동작 순서:

1. 상단의 `섹터 배치 편집` 버튼 클릭
2. 카드 드래그 시작
3. 다른 카드 위에서 드롭
4. `reorderSectors()`로 배열 순서 재배치
5. `localStorage`에 섹터 순서 저장
6. 다음 접속 시 `sortSectorsBySavedOrder()`로 복원

---

## 7. 현재 화면 구조

### 대시보드

파일:

- [frontend/src/pages/DashboardPage.tsx](D:/ij/cp-dashboard/frontend/src/pages/DashboardPage.tsx)

기능:

- 6개 섹터 동일 크기 표시
- 섹터 내부 스크롤
- 배치 편집 가능

### 관리자 페이지

파일:

- [frontend/src/pages/AdminPage.tsx](D:/ij/cp-dashboard/frontend/src/pages/AdminPage.tsx)

기능:

- 좌측 메뉴 하단에서 진입
- 상단 탭 구조
- 현재는 CRUD 화면 골격만 구현

### 상세 페이지

파일:

- [frontend/src/pages/DetailPage.tsx](D:/ij/cp-dashboard/frontend/src/pages/DetailPage.tsx)

기능:

- 좌측 메뉴에서 각 섹터 클릭 시 진입
- 현재는 공통 레이아웃 뼈대만 구현

---

## 8. 백엔드 인증/세션 관련 핵심 파일

### 인증 컨트롤러

- [src/main/java/com/company/cpdashboard/common/sso/SsoLoginController.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/sso/SsoLoginController.java)

역할:

- `/api/auth/me`
- `/api/auth/login-access`
- `/api/sso/login`
- `/api/auth/dev-login`
- `/api/auth/logout`

### 인증 서비스

- [src/main/java/com/company/cpdashboard/common/sso/SsoAuthService.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/sso/SsoAuthService.java)

역할:

- SSO 토큰 또는 사번을 실제 `LoginUser`로 변환

### SSO 라이브러리 어댑터

- [src/main/java/com/company/cpdashboard/common/sso/PlantecsSsoClientAdapter.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/sso/PlantecsSsoClientAdapter.java)
- [src/main/java/com/company/cpdashboard/common/sso/SpitSsoClientAdapter.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/sso/SpitSsoClientAdapter.java)

역할:

- 외부 jar 호출
- 응답값에서 사번 추출

### 세션 보관

- [src/main/java/com/company/cpdashboard/common/session/LoginUser.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/session/LoginUser.java)
- [src/main/java/com/company/cpdashboard/common/session/SessionUserHolder.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/session/SessionUserHolder.java)

역할:

- 세션에 로그인 사용자 정보 저장/조회

### 세션 체크 인터셉터

- [src/main/java/com/company/cpdashboard/common/interceptor/SessionCheckInterceptor.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/interceptor/SessionCheckInterceptor.java)
- [src/main/java/com/company/cpdashboard/common/config/WebMvcConfig.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/common/config/WebMvcConfig.java)

역할:

- 보호 대상 `/api/**` 요청 진입 전 세션 검사
- 로그인/로그아웃/개발용 로그인 관련 API는 예외 처리

---

## 9. DB 조회 관련 파일

### MyBatis Mapper Interface

- [src/main/java/com/company/cpdashboard/auth/mapper/AuthMapper.java](D:/ij/cp-dashboard/src/main/java/com/company/cpdashboard/auth/mapper/AuthMapper.java)

### MyBatis SQL XML

- [src/main/resources/mapper/auth/AuthMapper.xml](D:/ij/cp-dashboard/src/main/resources/mapper/auth/AuthMapper.xml)

현재 SQL 역할:

- 사번으로 내부 `USER_ID` 조회
- 최종 로그인 사용자 정보 조회

---

## 10. 프론트 주요 파일 구조

### 앱/진입

- [frontend/src/main.tsx](D:/ij/cp-dashboard/frontend/src/main.tsx)
- [frontend/src/App.tsx](D:/ij/cp-dashboard/frontend/src/App.tsx)

### API

- [frontend/src/api/auth.ts](D:/ij/cp-dashboard/frontend/src/api/auth.ts)

### 공통 레이아웃

- [frontend/src/components/layout/Sidebar.tsx](D:/ij/cp-dashboard/frontend/src/components/layout/Sidebar.tsx)
- [frontend/src/components/layout/Topbar.tsx](D:/ij/cp-dashboard/frontend/src/components/layout/Topbar.tsx)

### 대시보드

- [frontend/src/pages/DashboardPage.tsx](D:/ij/cp-dashboard/frontend/src/pages/DashboardPage.tsx)
- [frontend/src/components/dashboard/SectorCard.tsx](D:/ij/cp-dashboard/frontend/src/components/dashboard/SectorCard.tsx)

### 페이지

- [frontend/src/pages/LoginPage.tsx](D:/ij/cp-dashboard/frontend/src/pages/LoginPage.tsx)
- [frontend/src/pages/AdminPage.tsx](D:/ij/cp-dashboard/frontend/src/pages/AdminPage.tsx)
- [frontend/src/pages/DetailPage.tsx](D:/ij/cp-dashboard/frontend/src/pages/DetailPage.tsx)

### 데이터/타입/유틸

- [frontend/src/data/mock.ts](D:/ij/cp-dashboard/frontend/src/data/mock.ts)
- [frontend/src/types/app.ts](D:/ij/cp-dashboard/frontend/src/types/app.ts)
- [frontend/src/types/auth.ts](D:/ij/cp-dashboard/frontend/src/types/auth.ts)
- [frontend/src/utils/sectorOrder.ts](D:/ij/cp-dashboard/frontend/src/utils/sectorOrder.ts)

---

## 11. 환경 설정 파일

### Backend 설정

#### [build.gradle](D:/ij/cp-dashboard/build.gradle)

역할:

- Spring Boot 버전
- Java 버전
- 라이브러리 의존성
- Oracle/MyBatis/SSO jar 연결

주요 내용:

- Java 17
- Spring Boot 3.5.15
- MyBatis 3.0.5
- Oracle JDBC
- `libs/plantecs-sso-client.jar`
- `libs/ssoClient_swp.jar`

#### [src/main/resources/application.yaml](D:/ij/cp-dashboard/src/main/resources/application.yaml)

역할:

- 애플리케이션 설정
- DB 접속 정보
- MyBatis 설정
- 세션 attribute 이름

주요 내용:

- `spring.datasource.*`
- `mybatis.mapper-locations`
- `mybatis.type-aliases-package`
- `cp-dashboard.session.user-attribute-name`

### Frontend 설정

#### [frontend/package.json](D:/ij/cp-dashboard/frontend/package.json)

역할:

- React/Vite/TypeScript 버전
- 실행 스크립트 정의

주요 스크립트:

- `npm run dev`
- `npm run build`
- `npm run lint`

#### [frontend/vite.config.ts](D:/ij/cp-dashboard/frontend/vite.config.ts)

역할:

- Vite 개발 서버 설정
- 프록시 설정

중요 포인트:

- `/api` 요청을 `http://localhost:8080`으로 프록시

---

## 12. 실행 명령어

### 백엔드 실행

```powershell
cd D:\ij\cp-dashboard
.\gradlew bootRun
```

### 프론트 실행

```powershell
cd D:\ij\cp-dashboard\frontend
& "C:\Program Files\nodejs\npm.cmd" run dev
```

---

## 13. 발표/설명할 때 핵심 한 줄 요약

이 프로젝트는 `React가 화면을 담당하고`, `Spring Boot가 인증/세션/DB/API를 담당하며`, 두 시스템이 `/api` 기반으로 연결되는 전형적인 `Spring Boot + React` 구조다.

개발 중에는 `5173(React)`와 `8080(Spring Boot)`를 따로 실행하고, 운영에서는 하나의 시스템처럼 묶어서 배포할 수 있다.

---

## 14. 지금 상태에서 추가 확장 예정 영역

- 실제 SSO 운영 URL 연동
- 권한별 섹터 노출 제어
- 관리자 CRUD 실제 구현
- 상세 페이지별 데이터 API 연결
- 파일 업로드/다운로드 공통 모듈
- 공통 코드/에러/로그 정책 정리

