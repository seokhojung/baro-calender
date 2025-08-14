module.exports = {
  // 테스트 환경 설정
  testEnvironment: 'node',
  
  // 테스트 파일 패턴
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // 테스트 제외 패턴
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // 테스트 커버리지 설정
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/database/migrations/**',
    '!src/server.js'
  ],
  
  // 커버리지 리포트 형식
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  
  // 커버리지 디렉토리
  coverageDirectory: 'coverage',
  
  // 테스트 타임아웃 (30초)
  testTimeout: 30000,
  
  // 테스트 실행 전 설정
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // 모듈 이름 매핑
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // 테스트 결과 표시
  verbose: true,
  
  // 실패한 테스트만 재실행
  onlyFailures: false,
  
  // 테스트 실행 중 콘솔 출력 허용
  silent: false
};
