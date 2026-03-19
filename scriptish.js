/* ================= CONFIG ================= */

const DEFAULT_PIC =
  "https://raw.githubusercontent.com/sundaezipper/sundaezipper.github.io/main/system/placeholder/default.jpeg";

const SUPPORT_URL =
  "https://youtube.com/@rhap5ody?si=ZOALGkmYfo_c96xL";

/* ================= ELEMENTS ================= */

// Profile UI
const headerProfile = document.getElementById("headerProfile");
const headerProfileImg = document.getElementById("headerProfileImg");
const profileOverlay = document.getElementById("profileOverlay");
const profileCard = document.getElementById("profileCard");
const editCard = document.getElementById("editCard");
const closeProfileBtn = document.getElementById("closeProfileCard");
const closeEditBtn = document.getElementById("closeEditCard");
const editBtn = document.getElementById("editBtn");

// Profile content
const profilePic = document.getElementById("profilePic");
const profilePreview = document.getElementById("profilePreview");
const usernameDisplay = document.getElementById("username");
const usernameInput = document.getElementById("usernameInput");

// Form / image
const form = document.getElementById("editForm");
const fileInput = document.getElementById("profilePicInput");
const removeBtn = document.getElementById("removePicBtn");
const cropContainer = document.getElementById("cropContainer");
const cropPreview = document.getElementById("cropPreview");
const cropConfirm = document.getElementById("cropConfirm");
const cropCancel = document.getElementById("cropCancel");

// Download / support
const downloadBtn = document.getElementById("download");
const supportBtn = document.getElementById("support");
const overlay = document.getElementById("overlay");
const zipSound = document.getElementById("zipSound");

/* ================= STATE ================= */

let cropper = null;
let croppedImageData = null;

/* ================= TOAST ALERT ================= */

function showDownloadToast(message, success = false) {
  let toast = document.querySelector(".download-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "download-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.toggle("success", success);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
  }, success ? 2500 : 4000);
}

/* ================= INIT ================= */

window.addEventListener("DOMContentLoaded", () => {
  const savedPic = localStorage.getItem("profilePic") || DEFAULT_PIC;
  const savedName = localStorage.getItem("nickname") || "Nickname";

  profilePic.src = savedPic;
  profilePreview.src = savedPic;
  headerProfileImg.src = savedPic;

  usernameDisplay.textContent = savedName;
  usernameInput.value = savedName;

  cropContainer.style.display = "none";
});

/* ================= PROFILE OPEN / CLOSE ================= */

function openProfile() {
  profileOverlay.style.display = "block";
  profileCard.style.display = "flex";
  editCard.style.display = "none";
}

function closeProfile() {
  profileOverlay.style.display = "none";
  profileCard.style.display = "none";
  editCard.style.display = "none";
}

headerProfile.addEventListener("click", openProfile);
closeProfileBtn.addEventListener("click", closeProfile);
closeEditBtn.addEventListener("click", closeProfile);

/* ================= EDIT MODE ================= */

editBtn.addEventListener("click", () => {
  profileCard.style.display = "none";
  editCard.style.display = "flex";
});

/* ================= IMAGE REMOVE ================= */

removeBtn.addEventListener("click", () => {
  croppedImageData = null;
  profilePreview.src = DEFAULT_PIC;
  profilePic.src = DEFAULT_PIC;
  headerProfileImg.src = DEFAULT_PIC;
  localStorage.setItem("profilePic", DEFAULT_PIC);
});

/* ================= IMAGE CROP ================= */

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    cropContainer.style.display = "block";
    cropPreview.src = reader.result;

    if (cropper) cropper.destroy();
    cropper = new Cropper(cropPreview, {
      aspectRatio: 1,
      viewMode: 1,
      background: false
    });
  };
  reader.readAsDataURL(file);
});

cropConfirm.addEventListener("click", () => {
  if (!cropper) return;

  const canvas = cropper.getCroppedCanvas({ width: 300, height: 300 });
  croppedImageData = canvas.toDataURL("image/png");
  profilePreview.src = croppedImageData;

  cropper.destroy();
  cropper = null;
  cropContainer.style.display = "none";
});

cropCancel.addEventListener("click", () => {
  if (cropper) cropper.destroy();
  cropper = null;
  cropContainer.style.display = "none";
  fileInput.value = "";
});

/* ================= SAVE PROFILE ================= */

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = usernameInput.value.trim();
  if (name) {
    localStorage.setItem("nickname", name);
    usernameDisplay.textContent = name;
  }

  const finalPic = croppedImageData || profilePreview.src || DEFAULT_PIC;
  localStorage.setItem("profilePic", finalPic);

  profilePic.src = finalPic;
  headerProfileImg.src = finalPic;

  closeProfile();
});

/* ================= SUPPORT ================= */

supportBtn.addEventListener("click", () => {
  window.open(SUPPORT_URL, "_blank");
});

/* ================= DOWNLOAD ZIP ================= */

downloadBtn.addEventListener("click", async () => {
  overlay.style.display = "block";

  showDownloadToast("Downloading...");

  if (zipSound.src) {
    zipSound.currentTime = 0;
    zipSound.play().catch(() => {});
  }

  const zip = new JSZip();

  const baseURL = "https://raw.githubusercontent.com/sundaezipper/sundaezipper.github.io/main/version0.8.1/";

  const files = [
    "BIGTEST.js",
    "DMCA.html",
    "all.css",
    "angry.gif",
    "bg.png",
    "big.js",
    "commands.js",
    "confused.gif",
    "cooked.png",
    "credits.html",
    "discover.html",
    "drop.gif",
    "favorites.html",
    "foolish.html",
    "giggle.gif",
    "gn.html",
    "graduation-loading.gif",
    "happy.gif",
    "held.gif",
    "idle.gif",
    "index.html",
    "info.html",
    "intro.png",
    "loaded.gif",
    "loading.gif",
    "logotitle.png",
    "profile.html",
    "readme.txt",
    "searching.gif",
    "settings.html",
    "shy.gif",
    "slackerish.png",
    "themes.css",
    "versiontitle.png",
    "wronged.gif"
  ];

  try {
    await Promise.all(files.map(async (file) => {
      const res = await fetch(baseURL + file);
      const data = await res.arrayBuffer();
      zip.file(file, data, { binary: true });
    }));

    const blob = await zip.generateAsync({ type: "blob" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "version0.8.1.zip";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  } catch (err) {
    console.error("ZIP ERROR:", err);
    alert("Failed to create zip. Check console.");
  }

  overlay.style.display = "none";
  showDownloadToast("Download complete!", true);
});
