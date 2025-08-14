# Baro Calendar

바로 캘린더는 효율적인 일정 관리와 팀 협업을 위한 현대적인 캘린더 애플리케이션입니다.

## 🚀 주요 기능

- 📅 직관적인 캘린더 뷰
- 🔄 반복 일정 관리
- 👥 팀 일정 공유 및 협업
- 🔐 보안 및 권한 관리
- 📱 반응형 웹 디자인
- 🔔 실시간 알림 시스템

## 🛠️ 기술 스택

- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Frontend**: React (예정)
- **Authentication**: JWT
- **API**: RESTful API

## 📁 프로젝트 구조

```
baro-calender/
├── docs/           # 프로젝트 문서
├── src/            # 소스 코드
│   ├── api/        # API 엔드포인트
│   ├── database/   # 데이터베이스 관련
│   ├── middleware/ # 미들웨어
│   ├── models/     # 데이터 모델
│   └── services/   # 비즈니스 로직
├── tests/          # 테스트 코드
└── package.json    # 프로젝트 의존성
```

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- PostgreSQL 14.x 이상
- Git

### 설치 및 실행

1. 저장소 클론
```bash
git clone https://github.com/seokhojung/baro-calender.git
cd baro-calender
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
```bash
cp .env.example .env
# .env 파일을 편집하여 데이터베이스 연결 정보 입력
```

4. 데이터베이스 마이그레이션 실행
```bash
npm run migrate
```

5. 개발 서버 시작
```bash
npm run dev
```

## 📚 문서

자세한 내용은 [docs/](docs/) 폴더를 참조하세요:

- [시스템 아키텍처](docs/architecture/)
- [제품 요구사항](docs/prd/)
- [사용자 스토리](docs/stories/)

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발자

- **Seokho Jung** - [@seokhojung](https://github.com/seokhojung)

## 📞 연락처

프로젝트에 대한 질문이나 제안사항이 있으시면 이슈를 생성해 주세요.
