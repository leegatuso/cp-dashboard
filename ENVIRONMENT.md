# CP Dashboard Environment

이 문서는 `cp-dashboard` 초기 생성 시 사용한 개발 환경과 회사 PC에서 맞춰야 할 기준을 정리한 파일입니다.

## Project

| 항목 | 값 |
| --- | --- |
| Project name | `cp-dashboard` |
| Backend | Spring Boot |
| Frontend | React + Vite |
| Persistence | MyBatis |
| Database | Oracle |
| Build tool | Gradle Wrapper |
| IDE | IntelliJ IDEA Ultimate |
| Target server | Linux |

## Backend Environment

| 항목 | 값 |
| --- | --- |
| Java / JDK | `17.0.18 LTS` |
| JAVA_HOME | `C:\Program Files\Java\jdk-17.0.18` |
| Spring Boot | `3.5.15` |
| Gradle Wrapper | `8.14.5` |
| Dependency management plugin | `io.spring.dependency-management:1.1.7` |
| MyBatis Spring Boot Starter | `3.0.5` |
| Oracle JDBC Driver | `com.oracle.database.jdbc:ojdbc11` |
| Lombok | Spring dependency managed version |

## Frontend Environment

| 항목 | 값 |
| --- | --- |
| Node.js | `24.18.0` |
| npm | `11.16.0` |
| React | `^19.2.7` |
| React DOM | `^19.2.7` |
| Vite | `^8.1.0` |
| TypeScript | `~6.0.2` |
| ESLint | `^10.5.0` |

## Git Environment

| 항목 | 값 |
| --- | --- |
| Git | `2.54.0.windows.1` |
| Initial branch | `main` |
| Initial commit message | `Initial cp-dashboard project` |

## Required IntelliJ Settings

IntelliJ에서 아래 설정을 확인합니다.

```text
File
-> Project Structure
-> Project
-> SDK: JDK 17
-> Language level: 17
```

```text
File
-> Settings
-> Build, Execution, Deployment
-> Build Tools
-> Gradle
-> Gradle JVM: JDK 17
```

## PowerShell Environment

PowerShell에서 Java가 잡히지 않으면 아래 명령으로 현재 터미널에만 임시 적용합니다.

```powershell
$env:JAVA_HOME="C:\Program Files\Java\jdk-17.0.18"
$env:Path="$env:JAVA_HOME\bin;$env:Path"
java -version
```

영구 설정은 Windows 환경 변수에서 아래 값을 등록합니다.

```text
JAVA_HOME = C:\Program Files\Java\jdk-17.0.18
Path 추가 = %JAVA_HOME%\bin
```

## Backend Run

프로젝트 루트에서 실행합니다.

```powershell
.\gradlew bootRun
```

## Frontend Run

`frontend` 폴더에서 실행합니다.

```powershell
cd frontend
npm install
npm run dev
```

## GitHub Upload

프로젝트 루트에서 실행합니다.

```powershell
git branch -M main
git remote add origin https://github.com/{account}/cp-dashboard.git
git push -u origin main
```

## Notes

- JPA 관련 의존성은 사용하지 않습니다.
- `frontend/node_modules`는 Git에 올리지 않습니다.
- `frontend/package-lock.json`은 Git에 올립니다.
- 회사 PC에서 `npm install`이 막혀 있으면 사내 프록시, 사내 npm registry, 또는 Node.js/npm 사용 정책을 먼저 확인해야 합니다.
- Linux 서버에서 실행하려면 서버에도 Java 17 이상이 설치되어 있어야 합니다.
