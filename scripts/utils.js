/** Toast Start */
// Toast 管理類
class ToastManager {
  constructor() {
    this.container = document.getElementById("toastContainer");
    this.toasts = [];
    this.maxToasts = 3;
    this.toastId = 0;
  }

  // 創建 Toast 元素
  createToast(type, title, message, duration = 5000) {
    const toastId = ++this.toastId;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.dataset.id = toastId;

    // 根據類型設置圖標
    const icons = {
      success: "✓",
      error: "✕",
      warning: "!",
      info: "i",
    };

    toast.innerHTML = `
                    <div class="toast-icon">${icons[type]}</div>
                    <div class="toast-content">
                        <div class="toast-title">${title}</div>
                        <div class="toast-message">${message}</div>
                    </div>
                    <button class="toast-close" onclick="toastManager.removeToast(${toastId})">&times;</button>
                `;

    return { element: toast, id: toastId, duration };
  }

  // 顯示 Toast
  showToast(type, title, message, duration = 5000) {
    // 如果已達最大數量，移除最舊的
    if (this.toasts.length >= this.maxToasts) {
      this.removeToast(this.toasts[0].id);
    }

    const toast = this.createToast(type, title, message, duration);

    // 添加到容器底部（最新的在下面）
    this.container.appendChild(toast.element);
    this.toasts.push(toast);

    // 設置自動移除
    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, duration);
    }

    return toast.id;
  }

  // 移除 Toast
  removeToast(toastId) {
    const toastIndex = this.toasts.findIndex((t) => t.id === toastId);
    if (toastIndex === -1) return;

    const toast = this.toasts[toastIndex];
    const element = toast.element;

    // 添加移除動畫
    element.classList.add("removing");

    // 動畫完成後移除元素
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.toasts.splice(toastIndex, 1);
    }, 300);
  }

  // 清除所有 Toast
  clearAll() {
    this.toasts.forEach((toast) => {
      this.removeToast(toast.id);
    });
  }
}

// 創建全域 Toast 管理器
const toastManager = new ToastManager();

// 全域函式
function showToast(type, title, message, duration = 5000) {
  return toastManager.showToast(type, title, message, duration);
}

function removeToast(toastId) {
  toastManager.removeToast(toastId);
}

// showToast(randomType, msg.title, msg.message);
/** Toast End */

/** Confirm Start */
// 確認視窗功能
class ConfirmModal {
  constructor() {
    this.modal = document.getElementById("confirmModal");
    this.modalContent = document.getElementById("confirmModalContent");
    this.confirmIcon = document.getElementById("confirmIcon");
    this.confirmIconSymbol = document.getElementById("confirmIconSymbol");
    this.confirmTitle = document.getElementById("confirmTitle");
    this.confirmMessage = document.getElementById("confirmMessage");
    this.confirmOk = document.getElementById("confirmOk");
    this.confirmCancel = document.getElementById("confirmCancel");

    this.onConfirm = null;
    this.onCancel = null;

    // 綁定事件
    this.confirmOk.addEventListener("click", () => this.handleConfirm());
    this.confirmCancel.addEventListener("click", () => this.handleCancel());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.handleCancel();
      }
    });

    // ESC 鍵關閉
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("active")) {
        this.handleCancel();
      }
    });
  }

  show(options = {}) {
    // 設置選項
    const {
      title = "確認操作",
      message = "您確定要執行此操作嗎？",
      confirmText = "確認",
      cancelText = "取消",
      type = "warning", // warning, danger, success, info
      onConfirm = () => {},
      onCancel = () => {},
    } = options;

    // 更新內容
    this.confirmTitle.textContent = title;
    this.confirmMessage.textContent = message;
    this.confirmOk.textContent = confirmText;
    this.confirmCancel.textContent = cancelText;

    // 設置圖標類型
    this.confirmIcon.className = `confirm-icon ${type}`;

    // 設置圖標符號
    const iconSymbols = {
      warning: "!",
      danger: "×",
      success: "✓",
      info: "i",
    };
    this.confirmIconSymbol.textContent = iconSymbols[type] || "!";

    // 設置按鈕樣式
    this.confirmOk.className = `confirm-btn confirm-btn-${
      type === "danger" ? "danger" : "primary"
    }`;

    // 保存回調函數
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;

    // 顯示視窗
    this.modal.classList.add("active");

    // 聚焦到取消按鈕
    setTimeout(() => {
      this.confirmCancel.focus();
    }, 100);
  }

  hide() {
    this.modal.classList.remove("active");
    this.modalContent.classList.remove("shake");
  }

  handleConfirm() {
    if (this.onConfirm) {
      this.onConfirm();
    }
    this.hide();
  }

  handleCancel() {
    if (this.onCancel) {
      this.onCancel();
    }
    this.hide();
  }

  shake() {
    this.modalContent.classList.add("shake");
    setTimeout(() => {
      this.modalContent.classList.remove("shake");
    }, 500);
  }
}

// 創建全局確認視窗實例
const confirmModal = new ConfirmModal();

// 更新刪除功能，使用新的確認視窗
document.querySelectorAll(".btn-delete").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const card = this.closest(".story-card");
    const title = card.querySelector(".story-title").textContent;

    confirmModal.show({
      title: "刪除見證",
      message: `確定要刪除「${title}」這個見證嗎？此操作無法復原。`,
      confirmText: "刪除",
      cancelText: "取消",
      type: "danger",
      onConfirm: () => {
        card.style.animation = "fadeOut 0.3s ease forwards";
        setTimeout(() => {
          card.remove();
          // 重新檢查是否需要顯示空狀態
          const currentFilter = document
            .querySelector(".tab.active")
            .getAttribute("data-filter");
          filterStories(currentFilter);
        }, 300);
      },
    });
  });
});

// 提供全局函數供其他地方使用
window.showConfirm = function (options) {
  confirmModal.show(options);
};

// 示例用法：
// showConfirm({
//   title: "保存變更",
//   message: "您有未保存的變更，是否要保存？",
//   confirmText: "保存",
//   cancelText: "不保存",
//   type: "warning",
//   onConfirm: () => {
//     console.log("保存變更");
//   },
//   onCancel: () => {
//     console.log("放棄變更");
//   }
// });

/** Confirm End */
