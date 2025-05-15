document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM 로드 완료");

    // 현재 날짜를 KST 기준으로 정확히 계산
    const now = new Date();
    const kstOffset = 9 * 60; // KST는 UTC+9 (단위: 분)
    const kstTime = new Date(now.getTime() + (kstOffset * 60 * 1000) - (now.getTimezoneOffset() * 60 * 1000));
    const todayString = kstTime.toISOString().split('T')[0]; // "2025-05-15"

    // URL 파라미터에서 날짜 가져오기, 없으면 오늘 날짜 사용
    const urlParams = new URLSearchParams(window.location.search);
    const dateFromUrl = decodeURIComponent(urlParams.get('date') || todayString);
    console.log("dateFromUrl:", dateFromUrl);

    // 현재 날짜 및 요일 표시 (문자열 기반 처리, 타임존 영향 제거)
    function displayToday() {
        const todayElement = document.getElementById("currentday");
        const [year, month, date] = dateFromUrl.split('-').map(Number);
        const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        const dayIndex = new Date(dateFromUrl).getDay();
        const day = days[dayIndex];
        todayElement.textContent = `${month}월 ${date}일`;
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
    console.log("doneButton:", doneButton);
    console.log("titleInput:", titleInput);
    console.log("bodyInput:", bodyInput);
    console.log("feelingButton:", feelingButton);
    console.log("feelingModal:", feelingModal);
    console.log("selectedFeelingDisplay:", selectedFeelingDisplay);
    console.log("weatherButton:", weatherButton);
    console.log("weatherModal:", weatherModal);
    console.log("selectedWeatherDisplay:", selectedWeatherDisplay);

    // SVG 파일 경로 생성 함수
    function getSvgPath(day, type) {
        const basePath = "grapeimg/";
        return `${basePath}${day}_${type}.svg`;
    }

    // 기분에 따른 멘트 매핑
    const feelingMessages = {
        "HAPPY": "최고에요",
        "BLESSING": "좋아요",
        "SOSO": "보통이에요",
        "SAD": "슬퍼요",
        "MAD": "화나요"
    };

    function getWeatherSvgPath(weathername) {
        const basePath = "weatherimg/";
        return `${basePath}${weathername}.svg`;
    }

    // 초기 데이터 로드
    const savedDiaries = JSON.parse(localStorage.getItem('diaries')) || [];
    console.log("로컬 스토리지 전체 데이터 (초기):", savedDiaries);
    const savedDiary = savedDiaries.find(d => d.date === dateFromUrl);
    console.log("불러온 날짜:", dateFromUrl, "저장된 다이어리:", savedDiary);
    if (savedDiary) {
        titleInput.value = savedDiary.title || '';
        bodyInput.value = savedDiary.content || '';
        const feeling = Object.keys(feelingMessages).find(key => feelingMessages[key] === savedDiary.feeling) || 'HAPPY';
        selectedFeelingText.textContent = savedDiary.feeling || feelingMessages['HAPPY'];
        selectedFeelingSvg.src = getSvgPath(currentDay, feeling);
        const weather = savedDiary.weather || 'SUNNY';
        selectedWeatherSvg.src = getWeatherSvgPath(weather);
        selectedWeatherDisplay.innerHTML = `
            <img src="weatherimg/${weather}.svg" alt="선택된 날씨" style="width: 20px; height: 20px; vertical-align: middle;">
            <span>${weather}</span>
        `;
    } else {
        console.log("해당 날짜에 데이터가 없습니다. 기본값으로 초기화합니다.");
        titleInput.value = '';
        bodyInput.value = '';
        selectedFeelingSvg.src = getSvgPath(currentDay, 'HAPPY');
        selectedFeelingText.textContent = feelingMessages['HAPPY'];
        selectedWeatherSvg.src = getWeatherSvgPath('SUNNY');
        selectedWeatherDisplay.innerHTML = `
            <img src="weatherimg/SUNNY.svg" alt="선택된 날씨" style="width: 20px; height: 20px; vertical-align: middle;">
            <span>SUNNY</span>
        `;
    }

    // 이미지 로드 디버깅
    selectedFeelingSvg.onerror = () => console.error("기분 SVG 이미지 로드 실패:", selectedFeelingSvg.src);
    selectedFeelingSvg.onload = () => console.log("기분 SVG 이미지 로드 성공:", selectedFeelingSvg.src);
    selectedWeatherSvg.onerror = () => console.error("날씨 SVG 이미지 로드 실패:", selectedWeatherSvg.src);
    selectedWeatherSvg.onload = () => console.log("날씨 SVG 이미지 로드 성공:", selectedWeatherSvg.src);

    // 완료 버튼 상태 업데이트 함수
    function updateDoneButton() {
        const hasContent = titleInput.value.trim() !== "" && bodyInput.value.trim() !== "";
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

    // 기분 선택 로직
    if (feelingButton && feelingModal) {
        feelingButton.addEventListener("click", () => {
            console.log("기분 모달 버튼 클릭됨");
            feelingModal.classList.add("show");
        });
        feelingOptions.forEach(option => {
            const feeling = option.getAttribute("data-feeling");
            const svgPath = getSvgPath(currentDay, feeling);
            option.innerHTML = `<img src="${svgPath}" alt="${feeling}">`;
            option.querySelector("img").onerror = () => console.error("기분 옵션 SVG 로드 실패:", svgPath);
            option.querySelector("img").onload = () => console.log("기분 옵션 SVG 로드 성공:", svgPath);
            option.addEventListener("click", () => {
                feelingOptions.forEach(opt => opt.classList.remove("selected"));
                option.classList.add("selected");
                const feeling = option.getAttribute("data-feeling");
                selectedFeelingText.textContent = feelingMessages[feeling];
                selectedFeelingSvg.src = svgPath;
            });
        });
        if (confirmFeelingButton) {
            confirmFeelingButton.addEventListener("click", () => {
                const selectedSvg = selectedFeelingSvg.src.split("/").pop();
                const selectedFeeling = document.querySelector(".feeling-option.selected")?.getAttribute("data-feeling");
                if (selectedFeelingDisplay) {
                    selectedFeelingDisplay.innerHTML = `
                        <img src="grapeimg/${selectedSvg}" alt="선택된 기분" style="width: 20px; height: 20px; vertical-align: middle;">
                        <span>${selectedFeeling ? feelingMessages[selectedFeeling] : "기분 선택..."}</span>
                    `;
                }
                feelingModal.classList.remove("show");
            });
        }
    }

    // 날씨 선택 로직
    if (weatherButton && weatherModal) {
        weatherButton.addEventListener("click", () => {
            console.log("날씨 모달 버튼 클릭됨");
            weatherModal.classList.add("show");
        });
        weatherOptions.forEach(option => {
            const weather = option.getAttribute("data-weather");
            const svgPath = getWeatherSvgPath(weather);
            option.innerHTML = `<img src="${svgPath}" alt="${weather}">`;
            option.querySelector("img").onerror = () => console.error("날씨 옵션 SVG 로드 실패:", svgPath);
            option.querySelector("img").onload = () => console.log("날씨 옵션 SVG 로드 성공:", svgPath);
            option.addEventListener("click", () => {
                weatherOptions.forEach(opt => opt.classList.remove("selected"));
                option.classList.add("selected");
                selectedWeatherSvg.src = svgPath;
            });
        });
        if (confirmWeatherButton) {
            confirmWeatherButton.addEventListener("click", () => {
                const selectedSvg = selectedWeatherSvg.src.split("/").pop();
                const selectedWeather = document.querySelector(".weather-option.selected")?.getAttribute("data-weather");
                if (selectedWeatherDisplay) {
                    selectedWeatherDisplay.innerHTML = `
                        <img src="weatherimg/${selectedSvg}" alt="선택된 날씨" style="width: 20px; height: 20px; vertical-align: middle;">
                        <span>${selectedWeather || "날씨 선택..."}</span>
                    `;
                }
                weatherModal.classList.remove("show");
            });
        }
    }

    // 완료 버튼 클릭 시 저장 후 list.html로 이동
    if (doneButton && feelingModal && weatherModal) {
        doneButton.addEventListener("click", () => {
            console.log("완료 버튼 클릭됨");
            if (feelingModal.classList.contains("show")) feelingModal.classList.remove("show");
            if (weatherModal.classList.contains("show")) weatherModal.classList.remove("show");

            const title = titleInput.value.trim();
            const content = bodyInput.value.trim();
            const date = dateFromUrl;
            const feeling = selectedFeelingText.textContent;
            const weather = document.querySelector(".weather-option.selected")?.getAttribute("data-weather") || "SUNNY";

            if (!title || !content) {
                console.log("유효성 검사 실패:", { title, content });
                alert('제목과 내용을 입력해주세요.');
                return;
            }

            try {
                const diary = { title, content, date, feeling, weather, favorite: false };
                let savedDiaries = JSON.parse(localStorage.getItem('diaries')) || [];
                const existingIndex = savedDiaries.findIndex(d => d.date === date);
                if (existingIndex !== -1) savedDiaries[existingIndex] = diary;
                else savedDiaries.push(diary);
                localStorage.setItem('diaries', JSON.stringify(savedDiaries));
                console.log("저장 완료 - 로컬 스토리지 데이터:", savedDiaries);
                window.location.href = 'ltest.html';
            } catch (error) {
                console.error("저장 오류:", error);
                alert('데이터 저장 중 오류 발생.');
            }
        });
    }
});