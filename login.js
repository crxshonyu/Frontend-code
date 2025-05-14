// login.js
window.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.login-form');
    const userIdInput = document.getElementById('user-id');
    const userPwInput = document.getElementById('user-pw');
    const errorDiv = document.getElementById('login-error');
    const togglePwBtn = document.querySelector('.toggle-pw');
  
    // 입력 시작하면 에러 숨기기
    [userIdInput, userPwInput].forEach(input => {
      input.addEventListener('input', () => {
        errorDiv.style.display = 'none';
      });
    });
  
    // 로그인 검증
    window.validateLogin = function(event) {
      event.preventDefault();
  
      const id = userIdInput.value.trim();
      const pw = userPwInput.value;
  
      // 예시 인증 로직 — 실제로는 서버 API 호출로 대체하세요
      if (id !== 'admin' || pw !== '1234') {
        errorDiv.style.display = 'block';
        return false;
      }
  
      errorDiv.style.display = 'none';
      alert('로그인 성공!');
      form.submit();  // 실제 로그인 처리 경로로 이동
      return true;
    };
  
    // 비밀번호 보기/숨기기 토글
    togglePwBtn.addEventListener('click', () => {
      const currentType = userPwInput.getAttribute('type');
      userPwInput.setAttribute('type', currentType === 'password' ? 'text' : 'password');
    });
  });
  