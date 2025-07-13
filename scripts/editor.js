window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const { id = "new", mode = "edit" } = Object.fromEntries(urlParams.entries());
  console.log("props", { id, mode });
  // 處理資料匯入
};

// 初始化 Quill 編輯器
var quill = new Quill("#editor", {
  theme: "snow",
  placeholder: "開始撰寫您的見證...",
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  },
});

// 更新字數統計
function updateWordCount() {
  const text = quill.getText();
  const wordCount = text.trim().length;
  document.getElementById("wordCount").textContent = wordCount + " 字";
}

// 監聽內容變化
quill.on("text-change", function (delta, oldDelta, source) {
  updateWordCount();
});

// 取消編輯
function cancelEdit() {
  showConfirm({
    title: "取消編輯",
    message: "確定要取消編輯這篇見證嗎？",
    confirmText: "確定",
    cancelText: "繼續編輯",
    onConfirm: () => {
      window.location.href = "index.html";
    },
    onCancel: () => {
      // console.log("放棄變更");
    },
  });
}

// 儲存草稿
function saveDraft() {
  const title = document.getElementById("postTitle").value;
  const content = quill.getContents();
  const html = quill.root.innerHTML;
  const text = quill.getText();

  console.log("===== 儲存草稿 =====");
  console.log("標題:", title);
  console.log("純文字內容:", text);
  console.log("HTML 內容:", html);
  console.log("Delta 格式 (Quill 內部格式):", content);
  console.log("==================");

  // 更新最後儲存時間
  const now = new Date();
  const timeString = now.toLocaleTimeString("zh-TW", {
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("lastSaved").textContent = "已儲存於 " + timeString;

  // 顯示提示
  // alert('草稿已儲存！');
}

// 發佈文章
function publishPost() {
  const title = document.getElementById("postTitle").value;
  const content = quill.getContents();
  const html = quill.root.innerHTML;
  const text = quill.getText();

  if (!title.trim()) {
    showToast("info", "標題未填", "請輸入見證標題");
    document.getElementById("postTitle").focus();
    return;
  }

  if (text.trim().length < 10) {
    showToast("info", "字數太少", "見證內容至少需要 10 個字");
    return;
  }

  console.log("===== 發佈見證 =====");
  console.log("標題:", title);
  console.log("純文字內容:", text);
  console.log("HTML 內容:", html);
  console.log("Delta 格式 (Quill 內部格式):", content);
  console.log("字數:", text.trim().length);
  console.log("==================");

  showConfirm({
    title: "發佈見證",
    message: "確定要發佈這篇見證嗎？",
    confirmText: "發佈",
    cancelText: "取消",
    type: "info",
    onConfirm: () => {
      showToast("success", "", "見證已成功發佈！");
    },
    onCancel: () => {
      // console.log("放棄變更");
    },
  });
}

// 手機版選單切換
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

// 自動儲存功能（每30秒）
setInterval(function () {
  if (quill.getText().trim().length > 0) {
    console.log("自動儲存觸發...");
    saveDraft();
  }
}, 30000);
