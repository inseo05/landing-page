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
const benefitSection = document.querySelector(".benefit");
const benefitSticky = document.querySelector(".benefit-sticky");
const benefitItems = document.querySelectorAll(".benefit-slider .benefit-content");

let currentBenefitIndex = 0;
let isWheelLocked = false;
let prevScrollY = window.scrollY;
let isSnapping = false;

function isDesktopBenefit() {
    return window.innerWidth > 768;
}

function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}

function getBenefitTop() {
    return window.scrollY + benefitSection.getBoundingClientRect().top;
}

function showBenefitContent(index) {
    if (!benefitItems.length) return;

    const lastIndex = benefitItems.length - 1;
    const safeIndex = clamp(index, 0, lastIndex);

    benefitItems.forEach((item, i) => {
        if (i === safeIndex) {
            item.classList.add("is-active");
        } else {
            item.classList.remove("is-active");
        }
    });

    currentBenefitIndex = safeIndex;
}

function scrollToBenefitScene(index, behavior = "smooth") {
    const benefitTop = getBenefitTop();
    const sceneHeight = benefitSticky.offsetHeight;

    window.scrollTo({
        top: benefitTop + sceneHeight * index,
        behavior: behavior,
    });
}

// 스크롤바 드래그, 키보드 스크롤, 빠른 스크롤 상황 보정
function syncBenefitByScroll() {
    if (!benefitSection || !benefitSticky || benefitItems.length === 0) return;
    if (!isDesktopBenefit()) return;
    if (isSnapping) return;

    const scrollY = window.scrollY;
    const benefitTop = getBenefitTop();
    const sceneHeight = benefitSticky.offsetHeight;
    const lastIndex = benefitItems.length - 1;

    // benefit sticky가 실제로 유지되는 전체 스크롤 끝 지점
    const benefitScrollEnd = benefitTop + benefitSection.offsetHeight - window.innerHeight;

    // 위에서 아래로 처음 benefit에 들어올 때 너무 깊게 들어오면 intro로 보정
    if (prevScrollY < benefitTop && scrollY >= benefitTop && scrollY < benefitScrollEnd) {
        isSnapping = true;
        showBenefitContent(0);

        window.scrollTo({
            top: benefitTop,
            behavior: "auto",
        });

        setTimeout(() => {
            isSnapping = false;
        }, 50);

        prevScrollY = benefitTop;
        return;
    }

    // 아래에서 위로 benefit에 다시 들어올 때는 마지막 장면으로 보정
    if (prevScrollY > benefitScrollEnd && scrollY <= benefitScrollEnd && scrollY > benefitTop) {
        isSnapping = true;
        showBenefitContent(lastIndex);

        window.scrollTo({
            top: benefitTop + sceneHeight * lastIndex,
            behavior: "auto",
        });

        setTimeout(() => {
            isSnapping = false;
        }, 50);

        prevScrollY = benefitTop + sceneHeight * lastIndex;
        return;
    }

    // benefit 구간 안에 있을 때 현재 위치에 맞춰 장면 표시
    if (scrollY >= benefitTop && scrollY <= benefitScrollEnd) {
        const scrolledInBenefit = scrollY - benefitTop;
        const index = Math.round(scrolledInBenefit / sceneHeight);
        showBenefitContent(index);
    }

    prevScrollY = scrollY;
}

// benefit 안에서는 휠 한 번에 한 장면씩만 이동
window.addEventListener(
    "wheel",
    function (event) {
        if (!benefitSection || !benefitSticky || benefitItems.length === 0) return;
        if (!isDesktopBenefit()) return;

        const scrollY = window.scrollY;
        const benefitTop = getBenefitTop();
        const sceneHeight = benefitSticky.offsetHeight;
        const lastIndex = benefitItems.length - 1;

        const benefitScrollEnd = benefitTop + benefitSection.offsetHeight - window.innerHeight;

        const isInBenefit =
            scrollY >= benefitTop &&
            scrollY <= benefitScrollEnd;

        if (!isInBenefit) return;

        const direction = event.deltaY > 0 ? 1 : -1;

        // 첫 장면에서 위로 스크롤하면 이전 섹션으로 나가게 둠
        if (direction < 0 && currentBenefitIndex === 0) return;

        // 마지막 장면에서 아래로 스크롤하면 다음 섹션으로 나가게 둠
        if (direction > 0 && currentBenefitIndex === lastIndex) return;

        event.preventDefault();

        if (isWheelLocked) return;

        isWheelLocked = true;

        const nextIndex = currentBenefitIndex + direction;

        showBenefitContent(nextIndex);
        scrollToBenefitScene(nextIndex, "smooth");

        setTimeout(() => {
            isWheelLocked = false;
        }, 800);
    },
    { passive: false }
);

window.addEventListener("scroll", syncBenefitByScroll);
window.addEventListener("resize", syncBenefitByScroll);
window.addEventListener("load", syncBenefitByScroll);

syncBenefitByScroll();

//-----------// ✅ 리뷰 숫자 카운트 애니메이션
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
        768:{
            spaceBetween: 20
        },
        1024:{
            spaceBetween: 20
        },
        1920:{
            spaceBetween: 24
        },
    }
});