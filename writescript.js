document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM 로드 완료");

  // 현재 날짜 및 요일 표시 (영어 약어 사용, 요일 표시 제거)
  function displayToday() {
      const todayElement = document.getElementById("currentday");
      const today = new Date();
      const month = today.getMonth() + 1;
      const date = today.getDate();
      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const day = days[today.getDay()];
      todayElement.textContent = `${month}월 ${date}일`; // 요일 제거
      return day;
  }
  const currentDay = displayToday();

  // 완료 버튼과 입력란 요소 가져오기
  const doneButton = document.querySelector(".done");
  const titleInput = document.getElementById("titleInput");
  const bodyInput = document.getElementById("bodyInput");

  // 기분 모달 창 관련 요소
  const feelingButton = document.getElementById("feelingButton");
  const feelingModal = document.getElementById("feelingModal");
  const selectedFeelingSvg = document.getElementById("selectedFeelingSvg");
  const selectedFeelingText = document.getElementById("selectedFeelingText");
  const feelingOptions = document.querySelectorAll(".feeling-option");
  const confirmFeelingButton = document.getElementById("confirmFeelingButton");
  const selectedFeelingDisplay = document.getElementById("selectedFeelingDisplay");

  // 날씨 모달 창 관련 요소
  const weatherButton = document.getElementById("weatherButton");
  const weatherModal = document.getElementById("weatherModal");
  const selectedWeatherSvg = document.getElementById("selectedWeatherSvg");
  const weatherOptions = document.querySelectorAll(".weather-option");
  const confirmWeatherButton = document.getElementById("confirmWeatherButton");
  const selectedWeatherDisplay = document.getElementById("selectedWeatherDisplay");

  // 요소 존재 여부 확인
  console.log("feelingButton:", feelingButton);
  console.log("feelingModal:", feelingModal);
  console.log("selectedFeelingDisplay:", selectedFeelingDisplay);
  console.log("weatherButton:", weatherButton);
  console.log("weatherModal:", weatherModal);
  console.log("selectedWeatherDisplay:", selectedWeatherDisplay);

  // SVG 파일 경로 생성 함수 (grapeimg 폴더 사용)
  function getSvgPath(day, type) {
      const basePath = "grapeimg/";
      return `${basePath}${day}_${type}.svg`; // 예: "grapeimg/MONHAPPY.svg"
  }
  function getWeatherSvgPath(type) {
      const basePath = "weatherimg/";
      return `${basePath}${type}.svg`; // 예: "grapeimg/MONHAPPY.svg"
  }

  // 기분에 따른 멘트 매핑
  const feelingMessages = {
      "HAPPY": "최고에요",
      "BLESSING": "좋아요",
      "SOSO": "보통이에요",
      "SAD": "슬퍼요",
      "MAD": "화나요"
  };

  // 초기 기분 SVG 설정 (모달 열릴 때 기본값)
  const initialFeelingSvgPath = getSvgPath(currentDay, "HAPPY");
  console.log("초기 기분 SVG 경로:", initialFeelingSvgPath);
  selectedFeelingSvg.src = initialFeelingSvgPath;
  selectedFeelingText.textContent = feelingMessages["HAPPY"];

  // 기분 이미지 로드 디버깅
  selectedFeelingSvg.onerror = function() {
      console.error("기분 SVG 이미지 로드 실패:", initialFeelingSvgPath);
  };
  selectedFeelingSvg.onload = function() {
      console.log("기분 SVG 이미지 로드 성공:", initialFeelingSvgPath);
  };

  // 초기 날씨 SVG 설정 (기본값 SUNDIM.svg)
  const initialWeatherSvgPath = getWeatherSvgPath("SunDim");
  console.log("초기 날씨 SVG 경로:", initialWeatherSvgPath);
  selectedWeatherSvg.src = initialWeatherSvgPath;

  // 날씨 이미지 로드 디버깅
  selectedWeatherSvg.onerror = function() {
      console.error("날씨 SVG 이미지 로드 실패:", initialWeatherSvgPath);
  };
  selectedWeatherSvg.onload = function() {
      console.log("날씨 SVG 이미지 로드 성공:", initialWeatherSvgPath);
  };

  // 완료 버튼 상태 업데이트 함수
  function updateDoneButton() {
      const hasContent = titleInput.value.trim() !== "" || bodyInput.value.trim() !== "";
      if (hasContent) {
          doneButton.style.color = "black";
          doneButton.disabled = false;
      } else {
          doneButton.style.color = "lightgray";
          doneButton.disabled = true;
      }
  }

  // 초기 상태 설정
  doneButton.disabled = true;
  updateDoneButton();

  // 입력 이벤트 리스너
  titleInput.addEventListener("input", updateDoneButton);
  bodyInput.addEventListener("input", updateDoneButton);

  // 기분 선택 버튼 클릭 시 모달 창 열기
  if (feelingButton && feelingModal) {
      feelingButton.addEventListener("click", function() {
          console.log("기분 모달 버튼 클릭됨");
          feelingModal.classList.add("show");
          console.log("feelingModal 클래스:", feelingModal.className);
          console.log("feelingModal 스타일 (display):", window.getComputedStyle(feelingModal).display);
      });
  } else {
      console.error("feelingButton 또는 feelingModal이 없습니다.");
  }

  // 기분(SVG) 선택 로직
  feelingOptions.forEach(option => {
      const feeling = option.getAttribute("data-feeling");
      const svgPath = getSvgPath(currentDay, feeling);
      console.log("기분 옵션 SVG 경로:", svgPath);
      option.innerHTML = `<img src="${svgPath}" alt="${feeling}">`;

      const img = option.querySelector("img");
      img.onerror = function() {
          console.error("기분 옵션 SVG 이미지 로드 실패:", svgPath);
      };
      img.onload = function() {
          console.log("기분 옵션 SVG 이미지 로드 성공:", svgPath);
      };

      option.addEventListener("click", function() {
          console.log("기분 클릭됨");
          feelingOptions.forEach(opt => opt.classList.remove("selected"));
          this.classList.add("selected");
          const feeling = this.getAttribute("data-feeling");
          const text = feelingMessages[feeling];
          const svgPath = getSvgPath(currentDay, feeling);
          selectedFeelingSvg.src = svgPath;
          selectedFeelingText.textContent = text;
          console.log("선택된 기분 SVG 경로:", svgPath);
      });
  });

  // 기분 입력 버튼 클릭 시 모달 창 닫고 선택한 기분과 멘트 표시
  if (confirmFeelingButton) {
      confirmFeelingButton.addEventListener("click", function() {
          const selectedSvg = selectedFeelingSvg.src.split("/").pop();
          const selectedFeeling = document.querySelector(".feeling-option.selected")?.getAttribute("data-feeling");
          const selectedText = selectedFeeling ? feelingMessages[selectedFeeling] : "기분 선택...";
          if (selectedFeelingDisplay) {
              selectedFeelingDisplay.innerHTML = `
                  <img src="grapeimg/${selectedSvg}" alt="선택된 기분" style="width: 20px; height: 20px; vertical-align: middle;">
                  <span>${selectedText}</span>
              `;
          } else {
              console.error("selectedFeelingDisplay 요소를 찾을 수 없습니다.");
          }
          feelingModal.classList.remove("show");
      });
  } else {
      console.error("confirmFeelingButton 요소를 찾을 수 없습니다.");
  }

  // 날씨 선택 버튼 클릭 시 모달 창 열기
  if (weatherButton && weatherModal) {
      weatherButton.addEventListener("click", function() {
          console.log("날씨 모달 버튼 클릭됨");
          weatherModal.classList.add("show");
          console.log("weatherModal 클래스:", weatherModal.className);
          console.log("weatherModal 스타일 (display):", window.getComputedStyle(weatherModal).display);
      });
  } else {
      console.error("weatherButton 또는 weatherModal이 없습니다.");
  }

  // 날씨(SVG) 선택 로직
  weatherOptions.forEach(option => {
      const weather = option.getAttribute("data-weather");
      const svgPath = getSvgPath(weather, "");
      console.log("날씨 옵션 SVG 경로:", svgPath);
      option.innerHTML = `<img src="${svgPath}" alt="${weather}">`;

      const img = option.querySelector("img");
      img.onerror = function() {
          console.error("날씨 옵션 SVG 이미지 로드 실패:", svgPath);
      };
      img.onload = function() {
          console.log("날씨 옵션 SVG 이미지 로드 성공:", svgPath);
      };

      option.addEventListener("click", function() {
          console.log("날씨 클릭됨");
          weatherOptions.forEach(opt => opt.classList.remove("selected"));
          this.classList.add("selected");
          const weather = this.getAttribute("data-weather");
          const svgPath = getSvgPath(weather, "");
          selectedWeatherSvg.src = svgPath;
          console.log("선택된 날씨 SVG 경로:", svgPath);
      });
  });

  // 날씨 입력 버튼 클릭 시 모달 창 닫고 선택한 날씨 표시
  if (confirmWeatherButton) {
      confirmWeatherButton.addEventListener("click", function() {
          const selectedSvg = selectedWeatherSvg.src.split("/").pop();
          if (selectedWeatherDisplay) {
              selectedWeatherDisplay.innerHTML = `
                  <img src="grapeimg/${selectedSvg}" alt="선택된 날씨" style="width: 20px; height: 20px; vertical-align: middle;">
              `;
          } else {
              console.error("selectedWeatherDisplay 요소를 찾을 수 없습니다.");
          }
          weatherModal.classList.remove("show");
      });
  } else {
      console.error("confirmWeatherButton 요소를 찾을 수 없습니다.");
  }

  // 완료 버튼 클릭 시 모달 창 닫기
  if (doneButton && feelingModal && weatherModal) {
      doneButton.addEventListener("click", function() {
          console.log("완료 버튼 클릭됨");
          if (feelingModal.classList.contains("show")) {
              feelingModal.classList.remove("show");
              console.log("기분 모달 창 닫힘");
          }
          if (weatherModal.classList.contains("show")) {
              weatherModal.classList.remove("show");
              console.log("날씨 모달 창 닫힘");
          }
      });
  } else {
      console.error("doneButton, feelingModal 또는 weatherModal이 없습니다.");
  }
});