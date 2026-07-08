// ✅ 일반 스크롤 애니메이션
const scrollItems = document.querySelectorAll('.scroll-up, .text-focus-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-show');
        }
    });
}, {
    threshold: 0.3
});

scrollItems.forEach((item) => {
    observer.observe(item);
});


// ✅ benefit sticky 장면 전환
const benefitSection = document.querySelector('.benefit');
const benefitItems = document.querySelectorAll('.benefit .benefit-content');

function changeBenefitContent() {
    // benefit 섹션이나 content가 없으면 코드 실행 중단
    if (!benefitSection || benefitItems.length === 0) return;

    // benefit 섹션의 현재 위치 정보
    const sectionRect = benefitSection.getBoundingClientRect();

    // benefit 섹션 전체 높이
    const sectionHeight = benefitSection.offsetHeight;

    // 브라우저 화면 높이
    const windowHeight = window.innerHeight;

    // benefit 섹션 안에서 실제로 스크롤되는 거리
    const scrollableHeight = sectionHeight - windowHeight;

    // benefit 섹션 안에서 얼마나 스크롤했는지
    const scrolled = -sectionRect.top;

    // 스크롤 진행률 0 ~ 1로 계산
    let progress = scrolled / scrollableHeight;

    // progress가 0보다 작으면 0으로 고정
    if (progress < 0) {
        progress = 0;
    }

    // progress가 1보다 크면 1로 고정
    if (progress > 1) {
        progress = 1;
    }

    // 진행률에 따라 몇 번째 benefit-content를 보여줄지 계산
    let activeIndex = Math.floor(progress * benefitItems.length);

    // 마지막 구간에서 index가 개수보다 커지는 것 방지
    if (activeIndex >= benefitItems.length) {
        activeIndex = benefitItems.length - 1;
    }

    // 모든 benefit-content를 돌면서
    // 현재 보여줄 것만 is-active 붙이기
    benefitItems.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('is-active');
        } else {
            item.classList.remove('is-active');
        }
    });
}

// 스크롤할 때마다 benefit 장면 변경
window.addEventListener('scroll', changeBenefitContent);

// 화면 크기가 바뀌었을 때도 다시 계산
window.addEventListener('resize', changeBenefitContent);

// 처음 페이지 들어왔을 때 한 번 실행
changeBenefitContent();