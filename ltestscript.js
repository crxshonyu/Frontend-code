let diaries = JSON.parse(localStorage.getItem('diaries')) || [];
let currentPage = 1;
let itemsPerPage = 10;
let currentFilteredDiaries = diaries;
let selectedSort = 'desc'; // 기본 정렬: 최신순

// 새 일기 추가 또는 업데이트 함수
function addDiary(title, content, date, feeling, weather) {
    // 동일 날짜의 일기가 있으면 업데이트, 없으면 추가
    const existingDiaryIndex = diaries.findIndex(diary => diary.date === date);
    if (existingDiaryIndex !== -1) {
        diaries[existingDiaryIndex] = {
            title,
            content, // 원본 콘텐츠 저장
            date,
            feeling,
            weather,
            favorite: diaries[existingDiaryIndex].favorite
        };
    } else {
        diaries.push({
            title,
            content, // 원본 콘텐츠 저장
            date,
            feeling,
            weather,
            favorite: false
        });
    }
    currentFilteredDiaries = diaries;
    // 로컬 스토리지에 저장
    localStorage.setItem('diaries', JSON.stringify(diaries));
    displayDiaries(currentFilteredDiaries);
    sortDiaries(selectedSort); // 최신순으로 정렬
}

// 페이지 로드 시 로컬 스토리지 확인
window.onload = function() {
    // 로컬 스토리지에서 데이터 불러오기
    const savedDiaries = JSON.parse(localStorage.getItem('diaries'));
    if (savedDiaries) {
        diaries = savedDiaries.map(diary => ({
            ...diary,
            favorite: diary.favorite || false // favorite 속성 기본값 설정
        }));
        console.log("로컬 스토리지에서 불러온 다이어리:", diaries);
    } else {
        console.log("로컬 스토리지에 데이터 없음");
    }
    loadDiaries();
    sortDiaries('desc');
};

function showDateModal() {
    const modal = document.getElementById('dateModal');
    if (!modal) {
        console.error("dateModal not found");
        return;
    }
    console.log("Opening dateModal");
    modal.classList.add("show");

    const yearDisplay = document.querySelector('.current-year');
    const prevYearBtn = document.querySelector('.prev-year');
    const nextYearBtn = document.querySelector('.next-year');
    let currentYear = parseInt(yearDisplay.textContent) || 2025;

    prevYearBtn.onclick = () => {
        currentYear--;
        yearDisplay.textContent = currentYear;
    };
    nextYearBtn.onclick = () => {
        currentYear++;
        yearDisplay.textContent = currentYear;
    };

    const monthButtons = document.querySelectorAll('.month-btn');
    monthButtons.forEach(btn => {
        btn.onclick = () => {
            monthButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
        };
    });

    const confirmBtn = modal.querySelector('.confirm-btn');
    if (confirmBtn) {
        confirmBtn.onclick = loadDiaries;
    }

    const showAllBtn = modal.querySelector('.show-all-btn') || modal.querySelector('.modal-content').appendChild(document.createElement('button'));
    showAllBtn.textContent = '전체보기';
    showAllBtn.className = 'show-all-btn';
    showAllBtn.onclick = showAllDiaries;
    modal.querySelector('.modal-content').appendChild(showAllBtn);

    window.onclick = null;
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove("show");
            console.log("dateModal closed by clicking outside");
        }
    });
}

function showAllDiaries() {
    const modal = document.getElementById('dateModal');
    if (modal) modal.classList.remove("show");
    document.querySelector('.date').textContent = '전체 일기';
    currentFilteredDiaries = diaries;
    displayDiaries(currentFilteredDiaries);
}

function loadDiaries() {
    let year = document.querySelector('.current-year')?.textContent || new Date().getFullYear();
    let month = document.querySelector('.month-btn.selected')?.getAttribute('data-month');

    // 월을 숫자로 변환
    const monthMap = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
    month = month ? monthMap[month] : new Date().getMonth() + 1;

    const modal = document.getElementById('dateModal');
    if (modal) modal.classList.remove("show");
    document.querySelector('.date').textContent = `${year}년 ${month}월`;

    currentFilteredDiaries = diaries.filter(diary => {
        const dateObj = new Date(diary.date);
        return dateObj.getFullYear() === parseInt(year) && (dateObj.getMonth() + 1) === parseInt(month);
    });

    displayDiaries(currentFilteredDiaries);
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
        option.onclick = null;
        option.addEventListener('click', function() {
            sortOptions.forEach(opt => opt.classList.remove("selected"));
            this.classList.add("selected");
            selectedSort = this.getAttribute("data-sort");
            console.log("Selected sort:", selectedSort);
        });
    });

    const confirmBtn = document.querySelector(".confirm-btn");
    if (confirmBtn) {
        confirmBtn.onclick = null;
        confirmBtn.addEventListener('click', function() {
            console.log("Confirm button clicked, applying sort:", selectedSort);
            sortDiaries(selectedSort);
            modal.classList.remove("show");
        });
    } else {
        console.error("Confirm button not found");
    }

    window.onclick = null;
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove("show");
            console.log("Modal closed by clicking outside");
        }
    });
}

function sortDiaries(order) {
    console.log("Sorting diaries with order:", order);
    selectedSort = order;
    const sortButton = document.querySelector('.sort-btn');
    if (!sortButton) {
        console.error("sort-btn not found");
        return;
    }
    sortButton.innerHTML = `${order === 'asc' ? '오래된순' : '최신순'} <img src="changetime.svg" alt="Change Time" style="vertical-align: middle; width: 16px; height: 16px;">`;
    
    diaries.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (order === 'asc') {
            return dateA.getTime() - dateB.getTime(); // 오래된순
        } else {
            return dateB.getTime() - dateA.getTime(); // 최신순
        }
    });

    console.log("Sorted diaries:", diaries.map(d => `${d.title}: ${d.date}`));
    currentFilteredDiaries = diaries;
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
    console.log("표시할 다이어리:", paginatedDiaries);

    paginatedDiaries.forEach(diary => {
        // 미리보기용 콘텐츠 생성
        const firstLine = diary.content.split('\n')[0] || '';
        const previewContent = firstLine.length > 15 ? firstLine.substring(0, 15) + "..." : firstLine;
        const dateObj = new Date(diary.date);
        const formattedDate = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일`;

        const item = document.createElement('div');
        item.className = 'diary-item';
        item.innerHTML = `
            <div class="diary-card" onclick="goToWrite('${diary.date}')">
                <div class="diary-date">${formattedDate} · ${diary.feeling}</div>
                <div class="diary-title">${diary.title}</div>
                <div class="diary-content">${previewContent}</div>
                <span class="star" onclick="toggleFavorite(event, this, '${diary.date}')"><img src="${diary.favorite ? 'filledStar.svg' : 'emptyStar.svg'}" alt="Star" class="star-icon"></span>
            </div>
        `;
        list.appendChild(item);
    });

    updatePagination(displayDiaries.length);
}

// 카드 클릭 시 wtest.html로 이동
function goToWrite(date) {
    console.log("카드 클릭 - 이동할 날짜:", date); // 디버깅 로그
    window.location.href = `wtest.html?date=${encodeURIComponent(date)}`; // URL 인코딩 추가
}

// 즐겨찾기 토글 시 이벤트 전파 방지
function toggleFavorite(event, star, date) {
    event.stopPropagation(); // 카드 클릭 이벤트 방지
    const diary = diaries.find(d => d.date === date);
    if (diary) {
        diary.favorite = !diary.favorite;
        const starIcon = star.querySelector('.star-icon');
        starIcon.src = diary.favorite ? 'filledStar.svg' : 'emptyStar.svg';
        // 로컬 스토리지에 저장
        localStorage.setItem('diaries', JSON.stringify(diaries));
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