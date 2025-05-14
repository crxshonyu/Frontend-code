document.addEventListener('DOMContentLoaded', function() {
    const calendarDates = document.getElementById("calendarDates");
    const currentMonthElement = document.getElementById("currentMonth");
    const prevMonth = document.getElementById("prevMonth");
    const nextMonth = document.getElementById("nextMonth");
    const nowWeek = document.getElementById("nowWeek");
    const prevWeekBtn = document.getElementById("prevWeek");
    const nextWeekBtn = document.getElementById("nextWeek");
    const cluster = document.getElementById("grapeCluster");
    const today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();
    let selectedDate = new Date();
    let savedWeeklyEmotions = {};

    const emotionsByDay = {
        SUN: "HAPPY",
        MON: "HAPPY",
        TUE: "NULL",
        WED: "NULL",
        THU: "NULL",
        FRI: "NULL",
        SAT: "NULL"
    };

    const days = ["THU", "FRI", "SAT", "SUN", "MON", "WED", "TUE"];

    const stemImg = document.createElement("img");
    stemImg.src = "image/grape_stem.png";
    stemImg.alt = "포도꽁다리";
    stemImg.className = "grape-stem";
    cluster.appendChild(stemImg);

    days.forEach(day => {
        const emotion = emotionsByDay[day];
        const img = document.createElement("img");
        img.src = `grapeimg/${day}_${emotion}.svg`;
        img.alt = `${day} - ${emotion}`;
        img.className = `grape ${day}`;
        cluster.appendChild(img);
    });

    function displayToday() {
        const todayElement = document.getElementById("currentday");
        const daysOfWeek = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        const day = daysOfWeek[today.getDay()];
        todayElement.textContent = `${year}년 ${month}월 ${date}일 ${day}`;
    }

    displayToday();

    function renderCalendar() {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const startDayOfWeek = firstDayOfMonth.getDay();
        currentMonthElement.textContent = `${currentYear}년 ${currentMonth + 1}월`;

        calendarDates.innerHTML = "";

        for (let i = 0; i < startDayOfWeek; i++) {
            const emptyDate = document.createElement("div");
            emptyDate.classList.add("date", "empty");
            calendarDates.appendChild(emptyDate);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateElement = document.createElement("div");
            dateElement.classList.add("date");
            dateElement.innerHTML = `
                <div class="date-number">${i}</div>
                <img class="date-circle" src="image/circle.png" alt="circle">
            `;
            calendarDates.appendChild(dateElement);
        }
    }

    renderCalendar();

    prevMonth.addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar();
    });

    nextMonth.addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar();
    });

    function getWeekKey(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const weekNumber = Math.ceil((date.getDate() + firstDay) / 7);
        return `${year}-${month}-W${weekNumber}`;
    }

    function getWeekRange(date) {
        const start = new Date(date);
        const day = start.getDay();
        start.setDate(start.getDate() - day);
        const startDate = new Date(start);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return {
            start: `${startDate.getMonth() + 1}.${startDate.getDate().toString().padStart(2, '0')}`,
            end: `${endDate.getMonth() + 1}.${endDate.getDate().toString().padStart(2, '0')}`
        };
    }

    function updateWeekDisplay() {
        if (!nowWeek) {
            console.error("nowWeek 요소를 찾을 수 없습니다.");
            return;
        }
        const key = getWeekKey(selectedDate);
        const range = getWeekRange(selectedDate);
        nowWeek.innerHTML = `${selectedDate.getMonth() + 1}월 ${Math.ceil((selectedDate.getDate() + new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay()) / 7)}째주 포도송이<br>(${range.start} - ${range.end})`;

        if (!savedWeeklyEmotions[key]) {
            savedWeeklyEmotions[key] = days.reduce((acc, day) => {
                acc[day] = "NULL";
                return acc;
            }, {});
        }

        days.forEach(day => {
            const emotion = savedWeeklyEmotions[key][day];
            const img = cluster.querySelector(`.grape.${day}`);
            if (img) {
                img.src = `grapeimg/${day}_${emotion}.svg`;
                img.alt = `${day} - ${emotion}`;
            } else {
                console.warn(`.grape.${day} 이미지를 찾을 수 없습니다.`);
            }
        });
    }

    prevWeekBtn.addEventListener("click", () => {
        selectedDate.setDate(selectedDate.getDate() - 7);
        updateWeekDisplay();
    });

    nextWeekBtn.addEventListener("click", () => {
        selectedDate.setDate(selectedDate.getDate() + 7);
        updateWeekDisplay();
    });

    updateWeekDisplay();

    const diaryFromLastYear = {
        title: "",
        feeling: "",
        weather: ""
    };

    document.querySelector(".last-title").textContent = "제목: " + diaryFromLastYear.title;
    document.querySelector(".last-feeling").textContent = "기분: " + diaryFromLastYear.feeling;
    document.querySelector(".last-weather").textContent = "날씨: " + diaryFromLastYear.weather;

    document.getElementById("gotodiarybtn").addEventListener("click", function () {
        window.location.href = "find.html";
    });

    const feelingData = [0, 0, 0, 0, 0];
    const countSpans = document.querySelectorAll('.count');

    function updateFeel() {
        feelingData.forEach((count, index) => {
            countSpans[index].textContent = `× ${count}`;
        });
    }

    function receiveFeelUpdate(feelingIndex) {
        if (feelingIndex >= 0 && feelingIndex < feelingData.length) {
            feelingData[feelingIndex]++;
            updateFeel();
        }
    }

    updateFeel();
});