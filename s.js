const AUDIO_SRC = "ast/laguromantis.mp3";
const AUDIO_VOLUME = 0.7;

// 10 halaman — sesuai p1–p10
const pages = [
  {
    foto: "ast/p1.webp",
    judul: "Special Forever 💌",
    isi: "Untuk kamu yang selalu ada\ndi setiap ceritaku...\n\nTerima kasih sudah hadir.",
    caption: "Our Story",
    tag: "#faareysha",
  },
  {
    foto: "ast/p2.webp",
    judul: "Momen Lucu Kita 😄",
    isi: "Filter aneh, snapchat absurd,\ntawa yang nggak ada habisnya —\nitu semua jadi kenangan.",
    caption: "Funny Moments",
    tag: "#sillytogether",
  },
  {
    foto: "ast/p3.webp",
    judul: "My Self & You",
    isi: "Berawal cuma minuman 2k itu,\nternyata malah menemukan\nseseorang manis, sedikit pemalu,\nsenyum tipis itu. ♥",
    caption: "First Encounter",
    tag: "#2kstory",
  },
  {
    foto: "ast/p4.webp",
    judul: "Notes Untuk Kamu 📝",
    isi: "Jujur faa tidak pernah nyangka\nakan merasakan perasaan seperti ini.\nKamu membuat hari-hari faa\nlebih berwarna dan semangat.",
    caption: "From the Heart",
    tag: "#honestwords",
  },
  {
    foto: "ast/p5.webp",
    judul: "LDR? Gapapa 🌸",
    isi: "Tidak setiap hari kita bertemu,\ntetapi setiap hari faa memilih\nuntuk mempercayaimu.\n\nLDR mengajarkan kita\nbahwa cinta bukan tentang\nselalu bersama. ♥",
    caption: "Trust & Distance",
    tag: "#ldrstory",
  },
  {
    foto: "ast/p6.webp",
    judul: "Pesan Penting!! 📌",
    isi: "Jangan takut melakukan kesalahan,\nsetiap kesalahan adalah bagian\ndari proses belajar menuju\nkeberhasilan.\n\nFaa percaya kamu. ♥",
    caption: "Important Message",
    tag: "#pesanpenting",
  },
  {
    foto: "ast/p7.webp",
    judul: "Memory Book 📖",
    isi: "Setiap halaman ini adalah\nbagian dari cerita kita.\nSimpan baik-baik ya...",
    caption: "Our Memories",
    tag: "#memorybook",
  },
  {
    foto: "ast/p8.webp",
    judul: "Kolase Kita 🎞",
    isi: "Foto-foto konyol, ekspresi lucu,\nmoment random yang nggak terduga —\nsemuanya jadi bagian terindah\ncerita kita.",
    caption: "Collage of Us",
    tag: "#photostrip",
  },
  {
    foto: "ast/p9.webp",
    judul: "Aufa & Reysha ",
    isi: "\nDua orang berbeda kota,\nsatu perasaan yang sama. ♥",
    caption: "Us Together",
    tag: "#aufaareysha",
  },
  {
    foto: "ast/p10.webp",
    judul: "Untuk Selalu ♾",
    isi: "Bukan hanya hari ini,\ntapi selamanya —\nkamu adalah pilihanku.\n\nSemoga keinginan baik kita\ndisegerakan. ♥",
    caption: "Forever Mine",
    tag: "#foreveryours",
  },
];

// ─── Konfigurasi Hati Jatuh ─────────────────────────────────
const HEART_COUNT = 8;
const HEART_INTERVAL = 3000;
const HEART_MIN_SIZE = 10;
const HEART_MAX_SIZE = 22;
const HEART_MIN_DUR = 6;
const HEART_MAX_DUR = 11;

// ╔══════════════════════════════════════════════════════════╗
// ║              JANGAN UBAH DI BAWAH INI                   ║
// ╚══════════════════════════════════════════════════════════╝

const HEART_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402
           0-3.791 3.068-5.191 5.281-5.191 1.312 0
           4.151.501 5.719 4.457 1.59-3.968 4.464-4.447
           5.726-4.447 2.54 0 5.274 1.621 5.274 5.181
           0 4.069-5.136 8.625-11 14.402z"/>
</svg>`;

// ─── State ──────────────────────────────────────────────────
let currentPage = 0;
let isBookOpen = false;
let isAnimating = false;
let isMuted = false;

// ─── DOM ────────────────────────────────────────────────────
const bookEl = document.querySelector(".book");
const btnOpen = document.querySelector(".open-btn");
const btnPrev = document.querySelector(".prev-btn");
const btnNext = document.querySelector(".next-btn");
const btnPesan = document.querySelector(".pesan-btn");
const btnNav = document.querySelector(".nav");
const bgLove = document.querySelector(".bg-love");
const preload = document.querySelector(".preload");
const pageInd = document.querySelector(".page-indicator");

// ============================================================
//  AUDIO
// ============================================================
const audio = new Audio(AUDIO_SRC);
audio.loop = true;
audio.volume = AUDIO_VOLUME;

audio.addEventListener("ended", () => {
  if (!isMuted) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
});

// ── Mute button ─────────────────────────────────────────────
const btnMute = document.createElement("button");
btnMute.id = "btn-mute";
btnMute.innerHTML = iconNote();
btnMute.title = "Mute / Unmute";
document.body.appendChild(btnMute);

Object.assign(btnMute.style, {
  position: "fixed",
  top: "14px",
  right: "14px",
  zIndex: "1000",
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.6)",
  background: "rgba(128,85,55,0.88)",
  backdropFilter: "blur(4px)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0",
  boxShadow: "-2px 2px 0 rgba(0,0,0,0.25)",
  animation: "muteSpinAnim 5s linear infinite",
});

// Global styles
const styleEl = document.createElement("style");
styleEl.textContent = `
  @keyframes muteSpinAnim {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  #btn-mute:active { transform: scale(0.88) !important; }
  #btn-mute.muted  { animation-play-state: paused; opacity: 0.55; }
  .book::after {
    content: "";
    position: absolute; inset: 0;
    background: linear-gradient(135deg,
      rgba(180,140,100,0.08) 0%,
      transparent 50%,
      rgba(120,90,60,0.06) 100%);
    pointer-events: none; border-radius: inherit; z-index: 99;
  }
`;
document.head.appendChild(styleEl);

function iconNote() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="white" viewBox="0 0 16 16">
    <path d="M9 13c0 1.105-1.12 2-2.5 2S4 14.105 4 13s1.12-2 2.5-2 2.5.895 2.5 2m0-10v7.5a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5h5A.5.5 0 0 1 9 3"/>
    <path d="M9 3h4v2H9z"/></svg>`;
}
function iconMute() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="white" viewBox="0 0 16 16">
    <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137.993a.5.5 0 0 1 0 .707L12.207 7l1.647 1.646a.5.5 0 0 1-.708.708L11.5 7.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 7 9.146 5.354a.5.5 0 0 1 .708-.708L11.5 6.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
  </svg>`;
}

btnMute.addEventListener("click", () => {
  isMuted = !isMuted;
  if (isMuted) {
    audio.pause();
    btnMute.innerHTML = iconMute();
    btnMute.classList.add("muted");
  } else {
    audio.play().catch(() => {});
    btnMute.innerHTML = iconNote();
    btnMute.classList.remove("muted");
  }
});

function tryAutoplay() {
  audio.play().catch(() => {});
}

// ============================================================
//  PRELOADER
// ============================================================
window.addEventListener("load", () => {
  setTimeout(() => {
    preload.style.transition = "opacity 0.8s ease, visibility 0.8s ease";
    preload.style.opacity = "0";
    preload.style.visibility = "hidden";
    tryAutoplay();
  }, 1800);
});

// ============================================================
//  BUILD BOOK
// ============================================================
function buildBook() {
  bookEl.innerHTML = "";

  pages.forEach((page, i) => {
    const paper = document.createElement("div");
    paper.classList.add("paper");
    paper.style.zIndex = pages.length - i;

    paper.innerHTML = `
      <div class="front">
        <div class="front-content" style="--bg: url('${page.foto}')"></div>
      </div>
      <div class="back">
        <div class="back-content" style="--bg: url('${page.foto}')">
          ${buildPageCard(page, i)}
        </div>
      </div>`;

    bookEl.appendChild(paper);
  });
}

function buildPageCard(page, idx) {
  const linesText = page.isi
    .split("\n")
    .map((l) => (l.trim() ? `<p>${l}</p>` : `<br>`))
    .join("");

  return `
  <div class="scrapbook-page">
    <div class="page-number">${String(idx + 1).padStart(2, "0")} / ${String(pages.length).padStart(2, "0")}</div>

    <div class="polaroid">
      <div class="tape tape-left"></div>
      <div class="tape tape-right"></div>
      <img src="${page.foto}" alt="${page.judul}" loading="lazy" />
      <div class="polaroid-caption">${page.caption}</div>
    </div>

    <div class="story-card">
      <div class="story-tag">${page.tag}</div>
      <h2>${page.judul}</h2>
      <div class="story-divider"></div>
      <div class="story-text">${linesText}</div>
    </div>
  </div>`;
}

// ============================================================
//  NAVIGASI
// ============================================================
function updatePageIndicator() {
  if (pageInd) {
    pageInd.textContent = `${currentPage + 1} / ${pages.length}`;
  }
}

function openBook() {
  if (isAnimating) return;
  isAnimating = true;
  isBookOpen = true;

  if (!isMuted) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  btnOpen.classList.remove("show");
  btnNav.classList.add("show");
  bookEl.classList.remove("fs");
  bookEl.classList.add("bs");

  flipPage(0, true);
  setTimeout(() => {
    isAnimating = false;
  }, 600);
  updateUI();
}

function goNext() {
  if (isAnimating || currentPage >= pages.length - 1) return;
  isAnimating = true;
  flipPage(currentPage, true);
  currentPage++;
  setTimeout(() => {
    isAnimating = false;
  }, 600);
  updateUI();
}

function goPrev() {
  if (isAnimating || currentPage <= 0) return;
  isAnimating = true;
  currentPage--;
  flipPage(currentPage, false);
  setTimeout(() => {
    isAnimating = false;
  }, 600);
  updateUI();
}

function flipPage(index, forward) {
  const papers = bookEl.querySelectorAll(".paper");
  if (!papers[index]) return;
  if (forward) {
    papers[index].classList.add("flipped");
    papers[index].style.zIndex = index + 1;
  } else {
    papers[index].classList.remove("flipped");
    papers[index].style.zIndex = pages.length - index;
  }
}

function updateUI() {
  updatePageIndicator();

  const isFirst = currentPage === 0 && isBookOpen;
  const isLast = currentPage === pages.length - 1;

  bookEl.classList.toggle("fs", isFirst);
  bookEl.classList.toggle("bs", currentPage > 0);

  if (isLast) {
    btnPesan.classList.add("show");
    btnNav.style.opacity = "0.3";
    btnNav.style.pointerEvents = "none";
  } else {
    btnPesan.classList.remove("show");
    btnNav.style.opacity = "1";
    btnNav.style.pointerEvents = "auto";
  }

  if (!isBookOpen) {
    btnOpen.classList.add("show");
    btnNav.classList.remove("show");
  }

  // Prev/next button visibility
  btnPrev.style.opacity = currentPage <= 0 ? "0.35" : "1";
  btnNext.style.opacity = isLast ? "0.35" : "1";
}

// ============================================================
//  KIRIM PESAN
// ============================================================
function showPesanDialog() {
  Swal.fire({
    title: "Kirim Pesan 💌",
    html: `<p style="font-size:0.85rem;color:#888;margin-bottom:8px">
            Tulis apapun yang ingin kamu sampaikan ♥
          </p>`,
    input: "textarea",
    inputPlaceholder: "Tuliskan pesanmu di sini...",
    inputAttributes: {
      rows: 5,
      style: "font-family: 'Caveat', cursive; font-size: 1.1rem;",
    },
    showCancelButton: true,
    confirmButtonText: "Kirim 💌",
    cancelButtonText: "Batal",
    background: "#f6f0e8",
    customClass: {
      popup: "swal-vintage",
    },

    preConfirm: (pesan) => {
      if (!pesan || !pesan.trim()) {
        Swal.showValidationMessage("Pesannya kosong nih 😢");
        return false;
      }
      return pesan;
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const pesanUser = result.value;

      Swal.fire({
        title: "Terkirim! 🎉",
        text: "Pesanmu sudah sampai ke hatinya 💕",
        icon: "success",
        background: "#f6f0e8",
        confirmButtonText: "Buka WhatsApp 💌",
        customClass: {
          popup: "swal-vintage",
        },
      }).then(() => {
        // Nomor tujuan WhatsApp
        const nomorWA = "6281990997932";

        // Pesan otomatis
        const teks = `Terimakasih sudah membuka scrapbook ini 💕

Pesan dari kamu:
"${pesanUser}"

Dari: Aufa ✨`;

        // Buka WhatsApp
        window.open(`https://wa.me/${nomorWA}?text=${encodeURIComponent(teks)}`, "_blank");
      });
    }
  });
}
// ============================================================
//  HATI JATUH
// ============================================================
function createHearts() {
  for (let i = 0; i < HEART_COUNT; i++) {
    const heart = document.createElement("div");
    heart.classList.add("love-item");

    const size = rand(HEART_MIN_SIZE, HEART_MAX_SIZE);
    const left = rand(0, 100);
    const delay = rand(0, 3000);
    const dur = rand(HEART_MIN_DUR, HEART_MAX_DUR);
    const rot = rand(-30, 30);

    heart.style.cssText = `
      left: ${left}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${dur}s;
      animation-delay: ${delay}ms;
      transform: rotate(${rot}deg);`;
    heart.innerHTML = HEART_SVG;
    bgLove.appendChild(heart);
    setTimeout(() => heart.remove(), dur * 1000 + delay + 500);
  }
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// ============================================================
//  SWIPE SUPPORT (mobile)
// ============================================================
let touchStartX = 0;
bookEl.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.touches[0].clientX;
  },
  { passive: true },
);
bookEl.addEventListener(
  "touchend",
  (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (!isBookOpen) {
        openBook();
        return;
      }
      diff > 0 ? goNext() : goPrev();
    }
  },
  { passive: true },
);

// ============================================================
//  KEYBOARD SUPPORT
// ============================================================
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    isBookOpen ? goNext() : openBook();
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    goPrev();
  } else if (e.key === "m" || e.key === "M") {
    btnMute.click();
  }
});

// ============================================================
//  INIT
// ============================================================
btnOpen.addEventListener("click", openBook);
btnNext.addEventListener("click", goNext);
btnPrev.addEventListener("click", goPrev);
btnPesan.addEventListener("click", showPesanDialog);

buildBook();
updatePageIndicator();
createHearts();
setInterval(createHearts, HEART_INTERVAL);
