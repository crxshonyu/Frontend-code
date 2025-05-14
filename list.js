let diaries = [
    { title: "첫 번째 일기", content: "오늘은 좋은 날...", date: "2025-05-01", feeling: "행복", favorite: false },
    { title: "두 번째 일기", content: "비가 와서...", date: "2025-05-02", feeling: "슬픔", favorite: true },
    { title: "세 번째 일기", content: "어제는 비가...", date: "2025-04-15", feeling: "슬픔", favorite: false },
    { title: "네 번째 일기", content: "맑은 하늘...", date: "2025-05-03", feeling: "기쁨", favorite: false },
    { title: "다섯 번째 일기", content: "바람이 불어...", date: "2025-05-04", feeling: "평온", favorite: true },
    { title: "여섯 번째 일기", content: "친구와 만나...", date: "2025-05-05", feeling: "행복", favorite: false },
    { title: "일곱 번째 일기", content: "새로운 시작...", date: "2025-05-06", feeling: "설렘", favorite: false },
    { title: "여덟 번째 일기", content: "조용한 하루...", date: "2025-05-07", feeling: "평온", favorite: true },
    { title: "아홉 번째 일기", content: "비가 다시...", date: "2025-05-08", feeling: "슬픔", favorite: false },
    { title: "열 번째 일기", content: "맑은 날씨...", date: "2025-05-09", feeling: "기쁨", favorite: false },
    { title: "열한 번째 일기", content: "오늘도 맑음...", date: "2025-05-10", feeling: "기쁨", favorite: false },
    { title: "열두 번째 일기", content: "바쁜 하루...", date: "2025-05-11", feeling: "피곤", favorite: false },
];
let currentPage = 1;
let itemsPerPage = 10;
let currentFilteredDiaries = diaries;
let selectedSort = 'desc'; // 기본 정렬: 최신순
let currentYear = 2025; // 기본 년도
let selectedMonth = 'May'; // 기본 월

function showDateModal() {
    const modal = document.getElementById('dateModal');
    if (!modal) {
        console.error("dateModal not found");
        return;
    }
    console.log("Opening dateModal");
    modal.classList.add("show");

    const yearElement = document.querySelector('.current-year');
    if (yearElement) yearElement.textContent = currentYear;

    const monthButtons = document.querySelectorAll('.month-btn');
    monthButtons.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.getAttribute('data-month') === selectedMonth) {
            btn.classList.add('selected');
        }
        btn.onclick = function() {
            monthButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedMonth = this.getAttribute('data-month');
            console.log("Selected month:", selectedMonth);
        };
    });

    const prevYearBtn = document.querySelector('.prev-year');
    const nextYearBtn = document.querySelector('.next-year');
    if (prevYearBtn && nextYearBtn) {
        prevYearBtn.onclick = () => {
            currentYear--;
            yearElement.textContent = currentYear;
            console.log("Changed year to:", currentYear);
        };
        nextYearBtn.onclick = () => {
            currentYear++;
            yearElement.textContent = currentYear;
            console.log("Changed year to:", currentYear);
        };
    }

    const confirmBtn = document.querySelector('.confirm-btn');
    if (confirmBtn) {
        confirmBtn.onclick = function() {
            if (selectedMonth) {
                const monthNum = {
                    'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
                    'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
                }[selectedMonth];
                document.querySelector('.date').textContent = `${currentYear}년 ${monthNum}월`;
                currentFilteredDiaries = diaries.filter(diary => {
                    const dateObj = new Date(diary.date);
                    return dateObj.getFullYear() === currentYear && (dateObj.getMonth() + 1) === monthNum;
                });
                displayDiaries(currentFilteredDiaries);
                modal.classList.remove("show");
                console.log("Applied year:", currentYear, "month:", monthNum);
            } else {
                console.warn("No month selected");
            }
        };
    } else {
        console.error("Confirm button not found");
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.classList.remove("show");
            console.log("Date modal closed by clicking outside");
        }
    };
}

function showSortModal() {
    const modal = document.getElementById('sortModal');
    if (!modal) {
        console.error("sortModal not found");
        return;
    }
    console.log("Opening sortModal");
    modal.classList.add("show");

    const sortOptions = document.querySelectorAll(".sort-option");
    if (sortOptions.length === 0) {
        console.error("No sort-option elements found");
        return;
    }
    sortOptions.forEach(option => {
        option.classList.remove("selected");
        if (option.getAttribute("data-sort") === selectedSort) {
            option.classList.add("selected");
        }
        option.onclick = function() {
            sortOptions.forEach(opt => opt.classList.remove("selected"));
            this.classList.add("selected");
            selectedSort = this.getAttribute("data-sort");
            console.log("Selected sort option:", selectedSort);
        };
    });

    const confirmBtn = document.querySelector('#sortModal .confirm-btn'); // #sortModal 내의 confirm-btn 선택
    if (confirmBtn) {
        confirmBtn.onclick = function() {
            console.log("Confirm button clicked, applying sort:", selectedSort);
            sortDiaries(selectedSort);
            modal.classList.remove("show");
        };
    } else {
        console.error("Confirm button not found in sortModal");
    }

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.classList.remove("show");
            console.log("Sort modal closed by clicking outside");
        }
    };
}

function sortDiaries(order) {
    console.log("Sorting diaries with order:", order);
    selectedSort = order;
    const sortButton = document.querySelector('.sort-btn');
    if (!sortButton) {
        console.error("sort-btn not found");
        return;
    }
    sortButton.innerHTML = `${order === 'asc' ? '오래된순&nbsp' : '최신순&nbsp'} <img src="changetime.svg" alt="Change Time" style="vertical-align: middle; width: 16px; height: 16px;">`;
    
    // 전체 diaries 정렬
    diaries.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (order === 'asc') {
            return dateA.getTime() - dateB.getTime(); // 오래된순
        } else {
            return dateB.getTime() - dateA.getTime(); // 최신순
        }
    });

    // currentFilteredDiaries도 동일한 순서로 정렬
    currentFilteredDiaries.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (order === 'asc') {
            return dateA.getTime() - dateB.getTime();
        } else {
            return dateB.getTime() - dateA.getTime();
        }
    });

    console.log("Sorted diaries:", diaries.map(d => `${d.title}: ${d.date}`));
    console.log("Sorted filtered diaries:", currentFilteredDiaries.map(d => `${d.title}: ${d.date}`));
    displayDiaries(currentFilteredDiaries);
}

function displayDiaries(filteredDiaries = currentFilteredDiaries) {
    const list = document.getElementById('diaryList');
    if (!list) {
        console.error("diaryList not found");
        return;
    }
    list.innerHTML = '';
    const filter = document.getElementById('favoriteFilter')?.checked ?? false;
    let displayDiaries = filteredDiaries;

    if (filter) {
        displayDiaries = displayDiaries.filter(d => d.favorite === true);
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedDiaries = displayDiaries.slice(start, end);

    paginatedDiaries.forEach(diary => {
        const previewContent = diary.content.length > 20 ? diary.content.substring(0, 20) + "..." : diary.content;
        const dateObj = new Date(diary.date);
        const formattedDate = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;

        const item = document.createElement('div');
        item.className = 'diary-item';
        item.innerHTML = `
            <div class="diary-card">
                <div class="diary-date">${formattedDate} · ${diary.feeling}</div>
                <div class="diary-title">${diary.title}</div>
                <div class="diary-content">${previewContent}</div>
                <span class="star" onclick="toggleFavorite(this, '${diary.date}')"><img src="${diary.favorite ? 'filledStar.svg' : 'emptyStar.svg'}" alt="Star" class="star-icon"></span>
            </div>
        `;
        list.appendChild(item);
    });

    updatePagination(displayDiaries.length);
}

function toggleFavorite(star, date) {
    const diary = diaries.find(d => d.date === date);
    if (diary) {
        diary.favorite = !diary.favorite;
        const starIcon = star.querySelector('.star-icon');
        starIcon.src = diary.favorite ? 'filledStar.svg' : 'emptyStar.svg';
        displayDiaries(currentFilteredDiaries);
    }
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('pagination');
    if (!pagination) {
        console.error("pagination not found");
        return;
    }
    pagination.innerHTML = '';
    if (totalPages > 0) {
        const first = document.createElement('button');
        first.disabled = currentPage === 1;
        first.className = first.disabled ? 'disabled' : 'enabled';
        first.innerHTML = `<object type="image/svg+xml" data="Firstpage_${first.disabled ? 'disabled' : 'enabled'}.svg" class="pagination-icon"></object>`;
        first.onclick = () => { if (!first.disabled) { currentPage = 1; displayDiaries(currentFilteredDiaries); } };
        const firstObject = first.querySelector('object');
        if (firstObject) {
            firstObject.onerror = () => console.error('Failed to load Firstpage SVG');
        }
        pagination.appendChild(first);

        const prev = document.createElement('button');
        prev.disabled = currentPage === 1;
        prev.className = prev.disabled ? 'disabled' : 'enabled';
        prev.innerHTML = `<object type="image/svg+xml" data="prevpage_${prev.disabled ? 'disabled' : 'enabled'}.svg" class="pagination-icon"></object>`;
        prev.onclick = () => { if (!prev.disabled) { currentPage--; displayDiaries(currentFilteredDiaries); } };
        const prevObject = prev.querySelector('object');
        if (prevObject) {
            prevObject.onerror = () => console.error('Failed to load prevpage SVG');
        }
        pagination.appendChild(prev);

        for (let i = 1; i <= totalPages; i++) {
            const page = document.createElement('button');
            page.textContent = i;
            if (i === currentPage) {
                page.style.color = '#000';
                page.style.fontWeight = 'bold';
            }
            page.onclick = () => { currentPage = i; displayDiaries(currentFilteredDiaries); };
            pagination.appendChild(page);
        }

        const next = document.createElement('button');
        next.disabled = currentPage === totalPages;
        next.className = next.disabled ? 'disabled' : 'enabled';
        next.innerHTML = `<object type="image/svg+xml" data="nextpage_${next.disabled ? 'disabled' : 'enabled'}.svg" class="pagination-icon"></object>`;
        next.onclick = () => { if (!next.disabled) { currentPage++; displayDiaries(currentFilteredDiaries); } };
        const nextObject = next.querySelector('object');
        if (nextObject) {
            nextObject.onerror = () => console.error('Failed to load nextpage SVG');
        }
        pagination.appendChild(next);

        const last = document.createElement('button');
        last.disabled = currentPage === totalPages;
        last.className = last.disabled ? 'disabled' : 'enabled';
        last.innerHTML = `<object type="image/svg+xml" data="Lastpage_${last.disabled ? 'disabled' : 'enabled'}.svg" class="pagination-icon"></object>`;
        last.onclick = () => { if (!last.disabled) { currentPage = totalPages; displayDiaries(currentFilteredDiaries); } };
        const lastObject = last.querySelector('object');
        if (lastObject) {
            lastObject.onerror = () => console.error('Failed to load Lastpage SVG');
        }
        pagination.appendChild(last);
    }
}

document.getElementById('favoriteFilter').onchange = () => displayDiaries(currentFilteredDiaries);

// 초기 로드
const initialMonthNum = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 }[selectedMonth];
document.querySelector('.date').textContent = `${currentYear}년 ${initialMonthNum}월`;
currentFilteredDiaries = diaries.filter(diary => {
    const dateObj = new Date(diary.date);
    return dateObj.getFullYear() === currentYear && (dateObj.getMonth() + 1) === initialMonthNum;
});
displayDiaries(currentFilteredDiaries);
sortDiaries('desc');