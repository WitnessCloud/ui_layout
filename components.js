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

// 使用範例
function triggerRandomToast() {
  const types = ["success", "error", "warning", "info"];
  const messages = {
    success: { title: "成功", message: "操作已成功完成！" },
    error: { title: "錯誤", message: "發生了一個錯誤。" },
    warning: { title: "警告", message: "請注意這個操作。" },
    info: { title: "資訊", message: "這是一條通知。" },
  };

  const randomType = types[Math.floor(Math.random() * types.length)];
  const msg = messages[randomType];

  showToast(randomType, msg.title, msg.message);
}

// 鍵盤快捷鍵演示
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case "1":
        e.preventDefault();
        showToast("success", "成功", "快捷鍵觸發的成功通知");
        break;
      case "2":
        e.preventDefault();
        showToast("error", "錯誤", "快捷鍵觸發的錯誤通知");
        break;
      case "3":
        e.preventDefault();
        showToast("warning", "警告", "快捷鍵觸發的警告通知");
        break;
      case "4":
        e.preventDefault();
        showToast("info", "資訊", "快捷鍵觸發的資訊通知");
        break;
    }
  }
});
