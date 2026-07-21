// ✅ 일반 스크롤 애니메이션
const plans = document.querySelectorAll('.plans');
const mobileMedia = window.matchMedia('(max-width: 768px)');

const scrollItems = document.querySelectorAll('.scroll-up, .text-focus-in, .mobile-scroll-up');

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
// ✅ Benefit Sticky Swiper
const benefitSection =
    document.querySelector(".benefit");

const benefitDesktop =
    document.querySelector(".benefit-desktop");

const benefitSwiper = new Swiper(".benefitSwiper", {
    direction: "vertical",

    slidesPerView: 1,

    speed: 700,

    // 페이지 스크롤과 연결할 것이므로
    // Swiper 자체 드래그는 막음
    allowTouchMove: false,
    simulateTouch: false,

    observer: true,
    observeParents: true,
});


let benefitAnimationFrame = null;


function updateBenefitSwiper() {
    // 요소가 없으면 실행하지 않음
    if (
        !benefitSection ||
        !benefitDesktop ||
        !benefitSwiper
    ) {
        benefitAnimationFrame = null;
        return;
    }


    // 모바일은 기존 benefit 카드 사용
    if (window.innerWidth <= 768) {
        benefitAnimationFrame = null;
        return;
    }


    // benefit 섹션의 현재 화면 기준 위치
    const benefitRect =
        benefitSection.getBoundingClientRect();


    // 화면에 고정되어 있는 영역의 높이
    const stickyHeight =
        benefitDesktop.offsetHeight;


    /*
      benefit 전체 높이에서
      실제 고정 화면 높이를 뺀 값

      이 값이 benefit 내부에서
      실제로 스크롤할 수 있는 거리
    */
    const scrollableDistance =
        benefitSection.offsetHeight - stickyHeight;


    /*
      benefit이 화면 상단에 도착하면 0

      이후 아래로 스크롤할수록
      값이 양수로 증가
    */
    let scrolledDistance =
        -benefitRect.top;


    // 스크롤 값이 범위를 벗어나지 않도록 제한
    scrolledDistance = Math.max(
        0,
        Math.min(
            scrolledDistance,
            scrollableDistance
        )
    );


    // 전체 슬라이드 개수
    const slideCount =
        benefitSwiper.slides.length;


    /*
      한 슬라이드당 사용할 스크롤 거리

      현재:
      전체 스크롤 거리 ÷ 슬라이드 4장
    */
    const slideScrollDistance =
        scrollableDistance / slideCount;


    // 현재 보여줄 슬라이드 번호 계산
    let nextIndex = Math.floor(
        scrolledDistance / slideScrollDistance
    );


    // 마지막 슬라이드 번호를 넘지 않도록 제한
    nextIndex = Math.min(
        nextIndex,
        slideCount - 1
    );


    // 슬라이드가 바뀔 때만 실행
    if (benefitSwiper.activeIndex !== nextIndex) {
        benefitSwiper.slideTo(nextIndex);
    }


    benefitAnimationFrame = null;
}


function requestBenefitUpdate() {
    // 한 프레임에 여러 번 실행되는 것 방지
    if (benefitAnimationFrame !== null) return;

    benefitAnimationFrame =
        requestAnimationFrame(updateBenefitSwiper);
}


window.addEventListener(
    "scroll",
    requestBenefitUpdate,
    { passive: true }
);

window.addEventListener(
    "resize",
    requestBenefitUpdate
);

window.addEventListener(
    "load",
    requestBenefitUpdate
);


// 처음 페이지를 열었을 때 한 번 실행
updateBenefitSwiper();

//✅ 리뷰 숫자 카운트 애니메이션
const reviewCount = document.querySelector(".review-count");
const reviewSection = document.querySelector(".review");

function countUp() {
    const target = Number(reviewCount.dataset.target);

    let current = 0;
    const duration = 1200;
    const frameRate = 30;

    const totalFrame = Math.round(duration / (1000 / frameRate));
    const increase = target / totalFrame;

    const counter = setInterval(function () {
        current += increase;

        if (current >= target) {
            current = target;
            clearInterval(counter);
        }

        reviewCount.textContent =
            Math.floor(current).toLocaleString();
    }, 1000 / frameRate);
}

const reviewObserver = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                countUp();

                // 애니메이션이 한 번만 실행되도록 감시 종료
                reviewObserver.unobserve(reviewSection);
            }
        });
    },
    {
        threshold: 0.4
    }
);

reviewObserver.observe(reviewSection);

// <!-- Initialize Swiper -->
const mfSwiper = new Swiper(".mySwiper", {
    effect: "fade",
    speed: 1000,
    loop: true,

    autoplay: {
        delay: 3000,
        disableOnInteraction: false,
    },

    pagination: {
        el: ".mySwiper .swiper-pagination",
        clickable: true,
    },

});

// ✅ Review Swiper
const reviewSwiper = new Swiper(".reviewSwiper", {
    slidesPerView: "auto",
    spaceBetween: 20,
    loop: true,

    // speed: 0,
    speed: 6000,

    autoplay: {
        delay: 0,
        disableOnInteraction: false,
    },

    freeMode: {
        enabled: true,
        momentum: false,
    },

    grabCursor: true,

    scrollbar: {
        el: ".reviewSwiper .swiper-scrollbar",
        draggable: true,
    },

    breakpoints: {
        768: {
            spaceBetween: 20
        },
        1024: {
            spaceBetween: 20
        },
        1920: {
            spaceBetween: 24
        },
    }
});

// ✅ 모바일 메뉴
const menuOpenButton = document.querySelector(".mo-nav");
const menuCloseButton = document.querySelector(".menu-close");
const mobileMenu = document.querySelector(".mobile-menu");
const menuOverlay = document.querySelector(".menu-overlay");

function openMenu() {
    mobileMenu.classList.add("open");
    menuOverlay.classList.add("open");
    document.body.classList.add("menu-open");
}

function closeMenu() {
    mobileMenu.classList.remove("open");
    menuOverlay.classList.remove("open");
    document.body.classList.remove("menu-open");
}

menuOpenButton.addEventListener("click", openMenu);
menuCloseButton.addEventListener("click", closeMenu);
menuOverlay.addEventListener("click", closeMenu);

// ✅ 모바일 Interior 사진 크기 변경
const interiorItems = [
    ...document.querySelectorAll(".interior-content")
];

let interiorAnimationFrame;

function updateInteriorPhoto() {
    if (interiorItems.length === 0) return;

    // PC에서는 스크롤 확대 효과 제거
    if (window.innerWidth > 768) {
        interiorItems.forEach(function (item) {
            item.classList.remove("is-active");
        });

        return;
    }

    // 화면 중앙 위치
    const viewportCenter = window.innerHeight / 2;

    let closestItem = null;
    let closestDistance = Infinity;

    interiorItems.forEach(function (item) {
        const rect = item.getBoundingClientRect();

        // 현재 화면에 보이지 않는 사진은 제외
        const isVisible =
            rect.bottom > 0 &&
            rect.top < window.innerHeight;

        if (!isVisible) return;

        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - itemCenter);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestItem = item;
        }
    });

    interiorItems.forEach(function (item) {
        item.classList.toggle(
            "is-active",
            item === closestItem
        );
    });
}

function requestInteriorUpdate() {
    cancelAnimationFrame(interiorAnimationFrame);

    interiorAnimationFrame =
        requestAnimationFrame(updateInteriorPhoto);
}

window.addEventListener(
    "scroll",
    requestInteriorUpdate,
    { passive: true }
);

window.addEventListener(
    "resize",
    requestInteriorUpdate
);

window.addEventListener(
    "load",
    requestInteriorUpdate
);

updateInteriorPhoto();