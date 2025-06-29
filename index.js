// 漢堡選單功能
function toggleMenu() {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
}

function closeMenu() {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  hamburger.classList.remove("active");
  mobileMenu.classList.remove("active");
}

// 點擊頁面其他地方關閉選單
document.addEventListener("click", function (event) {
  const hamburger = document.querySelector(".hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!hamburger.contains(event.target) && !mobileMenu.contains(event.target)) {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
  }
});

// 標籤切換功能
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", function (e) {
    e.preventDefault();

    // 移除所有 active 類別
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    // 添加 active 類別到點擊的標籤
    this.classList.add("active");

    // 獲取篩選條件
    const filter = this.getAttribute("data-filter");
    filterStories(filter);
  });
});

// 篩選見證功能
function filterStories(filter) {
  const storyCards = document.querySelectorAll(".story-card");
  const emptyState = document.getElementById("emptyState");
  let visibleCount = 0;

  storyCards.forEach((card) => {
    const status = card.getAttribute("data-status");

    if (filter === "all" || filter === status) {
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  // 顯示或隱藏空狀態
  if (visibleCount === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}

// 創建見證功能
function createStory() {
  // 20250629 下一階段處理
  alert("導向到創建見證頁面");
}

// 刪除見證功能
document.querySelectorAll(".btn-delete").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    if (confirm("確定要刪除這個見證嗎？")) {
      const card = this.closest(".story-card");
      card.style.animation = "fadeOut 0.3s ease forwards";
      setTimeout(() => {
        card.remove();
        // 重新檢查是否需要顯示空狀態
        const currentFilter = document
          .querySelector(".tab.active")
          .getAttribute("data-filter");
        filterStories(currentFilter);
      }, 300);
    }
  });
});

// 淡出動畫
const style = document.createElement("style");
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateY(-20px) scale(0.9);
        }
    }
`;
document.head.appendChild(style);

// 處理視窗大小變化
window.addEventListener("resize", function () {
  if (window.innerWidth > 768) {
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.getElementById("mobileMenu");
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("active");
  }
});

// 登出功能
function handleLogout() {
  // 20250629 confirm之後會換成popup效果
  if (confirm("確定要登出嗎？")) {
    // 清除當前用戶信息
    localStorage.removeItem("currentUser");
    // 導向到登入頁面
    window.location.href = "authentication.html";
  }
}
