// === SETTING JSONBIN ===
const BIN_ID = "68cbe061ae596e708ff2d2be";
const API_KEY = "$2a$10$OBOE7eRlL5A1TDPHUXLlM.IWb3gdDbpIG1KVpdBvn7m87qAxyh0/m";
const URL = `https://api.jsonbin.io/v3/b/68cbe061ae596e708ff2d2be`;


// === MASUK KE UNDANGAN ===
function enterSite() {
  const splash = document.getElementById('splash');
  const page1 = document.getElementById('page1');
  const backControl = document.getElementById("backControl");

  ['page1', 'page2', 'page3', 'page4', 'page5', 'page6'].forEach(id => {
    document.getElementById(id).style.display = 'flex';
  });

  splash.classList.add('slide-out');

  setTimeout(() => {
    splash.style.display = 'none';
    page1.classList.add('active');
  }, 1000);

  document.querySelector('.side-menu').classList.add('active');
  document.querySelector('.controls').classList.add('active');
  backControl.classList.add("active");

  const bgMusic = document.getElementById("bgMusic");
  bgMusic.play().catch(() => {
    console.log("Autoplay diblokir, klik tombol musik.");
  });
}

// Animasi fade-in untuk subtitle & judul
document.addEventListener("DOMContentLoaded", () => {
  const animatedText = document.querySelectorAll(".page-subtitle, h2");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add("animate");
    });
  }, { threshold: 0.2 });

  animatedText.forEach(el => observer.observe(el));
});


// === SLIDESHOW PENGANTIN ===
let slideIndex = 0;
const slides = document.querySelectorAll(".pengantin-slide");
const dotsContainer = document.querySelector(".carousel-dots");

document.querySelectorAll(".next").forEach(btn => {
  btn.addEventListener("click", () => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
    resetAutoSlide();
  });
});

document.querySelectorAll(".prev").forEach(btn => {
  btn.addEventListener("click", () => {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    showSlide(slideIndex);
    resetAutoSlide();
  });
});

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }, 4000);
}
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}
window.addEventListener("load", () => {
  showSlide(slideIndex);
  startAutoSlide();
});

slides.forEach((_, i) => {
  const dot = document.createElement("span");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dot.addEventListener("click", () => {
    slideIndex = i;
    showSlide(slideIndex);
    resetAutoSlide();
  });
  dotsContainer.appendChild(dot);
});
let dots = document.querySelectorAll(".carousel-dots .dot");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

// swipe mobile
let startX = 0;
let endX = 0;
const carousel = document.querySelector(".pengantin-carousel");
carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});
carousel.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});
function handleSwipe() {
  const diffX = endX - startX;
  if (Math.abs(diffX) > 50) {
    if (diffX > 0) {
      slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    } else {
      slideIndex = (slideIndex + 1) % slides.length;
    }
    showSlide(slideIndex);
    resetAutoSlide();
  }
}


// === COUNTDOWN ===
const targetDate = new Date("2025-09-25T09:00:00").getTime();
const countdownEl = document.getElementById("countdown");
setInterval(() => {
  const now = new Date().getTime();
  const diff = targetDate - now;
  if (diff <= 0) {
    countdownEl.innerHTML = "Hari ini pernikahan berlangsung 🎉";
    return;
  }
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24))/(1000*60*60));
  const mins = Math.floor((diff % (1000*60*60))/(1000*60));
  const secs = Math.floor((diff % (1000*60))/1000);

  countdownEl.innerHTML = `
  <div class="countdown-item"><div class="number">${days}</div><div class="label">Hari</div></div>
  <div class="countdown-item"><div class="number">${hours}</div><div class="label">Jam</div></div>
  <div class="countdown-item"><div class="number">${mins}</div><div class="label">Menit</div></div>
  <div class="countdown-item"><div class="number">${secs}</div><div class="label">Detik</div></div>`;
}, 1000);


// === REKENING POPUP ===
function copyRekening() {
  const rekening = document.getElementById("rekening").innerText;
  navigator.clipboard.writeText(rekening).then(() => {
    document.getElementById("copyNotif").style.display = "block";
    setTimeout(() => {
      document.getElementById("copyNotif").style.display = "none";
    }, 2000);
  });
}
function openGiftPopup() {
  document.getElementById("giftPopup").classList.add("active");
}
function closeGiftPopup() {
  document.getElementById("giftPopup").classList.remove("active");
}


// === FORM KOMENTAR (JSONBIN.IO) ===
const form = document.getElementById("guestForm");
const messages = document.getElementById("messages");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const alamat = document.getElementById("alamat").value;
  const pesan = document.getElementById("pesan").value;
  const kehadiran = document.getElementById("kehadiran").value;

  const loader = document.getElementById("formLoader");
  loader.style.display = "block";

  try {
    // ambil data lama
    let res = await fetch(URL + "/latest", {
      headers: { "X-Master-Key": API_KEY }
    });
    let result = await res.json();
    let messagesData = result.record.messages || [];

    // tambah data baru
    messagesData.push({ nama, alamat, kehadiran, pesan });

    // simpan kembali
    await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY
      },
      body: JSON.stringify({ messages: messagesData })
    });

    form.reset();
    loadMessages();
  } catch (err) {
    console.error("Error:", err);
    alert("Gagal menyimpan pesan.");
  } finally {
    loader.style.display = "none";
  }
});

async function loadMessages() {
  try {
    const res = await fetch(URL + "/latest", {
      headers: { "X-Master-Key": API_KEY }
    });
    const result = await res.json();
    let data = result.record.messages || [];

    messages.innerHTML = "";
    data.reverse().forEach(item => {
      const msg = document.createElement("div");
      msg.classList.add("message-item");
      msg.innerHTML = `<b>${item.nama}</b> (${item.kehadiran})<br>${item.pesan}`;
      messages.appendChild(msg);
    });
  } catch (err) {
    console.error("Gagal ambil komentar:", err);
  }
}
document.addEventListener("DOMContentLoaded", loadMessages);


// === MUSIC CONTROL ===
const musicControl = document.getElementById("musicControl");
const bgMusic = document.getElementById("bgMusic");
musicControl.addEventListener("click", () => {
  const icon = musicControl.querySelector("img");
  if (bgMusic.paused) {
    bgMusic.play();
    icon.src = "icon-music.png";
  } else {
    bgMusic.pause();
    icon.src = "icon-mute.png";
  }
});


// === TOMBOL BACK KE AWAL ===
const backControl = document.getElementById("backControl");
backControl.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
function scrollToPage(pageId) {
  document.getElementById(pageId).scrollIntoView({ behavior: 'smooth' });
}

