# Baro Calendar API Server

멀티테넌시 기반의 캘린더 관리 시스템 API 서버입니다.

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 데이터베이스 설정
DB_USER=postgres
DB_HOST=localhost
DB_NAME=baro_calendar
DB_PASSWORD=your_password
DB_PORT=5432

# JWT 설정
JWT_SECRET=your_jwt_secret_key

# 서버 설정
PORT=3000
HOST=0.0.0.0
```

### 3. 데이터베이스 마이그레이션 실행

```bash
# 모든 마이그레이션 실행
npm run migrate

# 마이그레이션 상태 확인
npm run migrate:status

# 마이그레이션 초기화 및 재실행
npm run migrate:reset
```

### 4. 서버 시작

```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

## 📊 생성된 기본 데이터

마이그레이션 실행 후 다음 데이터가 자동으로 생성됩니다:

### 테넌트
- **Baro Calendar** (`baro-calendar.com`)
  - 시간대: Asia/Seoul
  - 날짜 형식: YYYY-MM-DD
  - 시간 형식: HH:mm
  - 주 시작일: 월요일
  - 업무 시간: 09:00-18:00

### 사용자
- **관리자**: `admin@baro-calendar.com` (admin 역할)
- **사용자1**: `user1@baro-calendar.com` (user 역할)
- **사용자2**: `user2@baro-calendar.com` (user 역할)

### 프로젝트
1. **개인 일정 관리** - 개인 일정 및 할 일 관리
2. **팀 프로젝트** - 팀원들과 함께하는 프로젝트 일정
3. **회의 일정** - 회의 및 미팅 일정 관리
4. **마케팅 캠페인** - 마케팅 캠페인 일정 및 마일스톤
5. **개발 스프린트** - 애자일 개발 스프린트 일정

## 🏗️ 프로젝트 구조

```
src/
├── api/v1/           # API 라우터
│   ├── projects.js   # 프로젝트 API
│   └── members.js    # 멤버 API
├── database/         # 데이터베이스 관련
│   ├── migrations/   # 마이그레이션 스크립트
│   └── run-migrations.js
├── middleware/       # 미들웨어
│   └── acl.js       # ACL 미들웨어
├── models/           # 데이터 모델
│   ├── tenant.js    # 테넌트 모델
│   ├── project.js   # 프로젝트 모델
│   ├── member.js    # 멤버 모델
│   └── permission.js # 권한 모델
├── services/         # 비즈니스 로직
│   ├── projectService.js
│   └── memberService.js
├── schemas/          # 입력 검증 스키마
│   ├── projectSchema.js
│   └── memberSchema.js
├── utils/            # 유틸리티 함수
│   └── permissionUtils.js
└── server.js         # 메인 서버 파일
```

## 🔐 권한 시스템

### 역할별 권한

| 권한 | Owner | Editor | Commenter | Viewer |
|------|-------|--------|-----------|--------|
| 프로젝트 관리 | ✅ | ❌ | ❌ | ❌ |
| 프로젝트 삭제 | ✅ | ❌ | ❌ | ❌ |
| 멤버 초대 | ✅ | ✅ | ❌ | ❌ |
| 멤버 제거 | ✅ | ❌ | ❌ | ❌ |
| 콘텐츠 생성 | ✅ | ✅ | ✅ | ❌ |
| 콘텐츠 편집 | ✅ | ✅ | ❌ | ❌ |
| 콘텐츠 조회 | ✅ | ✅ | ✅ | ✅ |

### ACL 미들웨어

- **사용자 인증**: JWT 토큰 검증
- **프로젝트 멤버십**: 프로젝트 멤버 여부 확인
- **권한 검증**: 역할 기반 권한 확인
- **엔드포인트 가드**: API 접근 제어

## 📡 API 엔드포인트

### 프로젝트 API
- `POST /v1/projects` - 프로젝트 생성
- `GET /v1/projects/:id` - 프로젝트 조회
- `PATCH /v1/projects/:id` - 프로젝트 수정
- `DELETE /v1/projects/:id` - 프로젝트 삭제

### 멤버 API
- `POST /v1/projects/:id/members` - 멤버 초대
- `GET /v1/projects/:id/members` - 멤버 목록 조회
- `PATCH /v1/projects/:id/members/:user_id` - 멤버 역할 변경
- `DELETE /v1/projects/:id/members/:user_id` - 멤버 제거

## 🧪 테스트

```bash
# 단위 테스트
npm test

# 테스트 커버리지
npm run test:coverage
```

## 🔧 개발 도구

### 마이그레이션 관리

```bash
# 개별 마이그레이션 실행
node src/database/migrations/001_create_tenant_project_member_tables.js up
node src/database/migrations/001.5_create_users_table.js up
node src/database/migrations/002_insert_default_tenant_and_projects.js up

# 개별 마이그레이션 롤백
node src/database/migrations/001_create_tenant_project_member_tables.js down
```

### 데이터베이스 연결 테스트

```bash
# PostgreSQL 연결 테스트
psql -h localhost -U postgres -d baro_calendar -c "SELECT version();"
```

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.
