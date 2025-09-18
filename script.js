function enterSite() {
  const splash = document.getElementById('splash');
  const page1 = document.getElementById('page1');
  const backControl = document.getElementById("backControl");

  // Tampilkan semua halaman (sementara disembunyikan pakai opacity/transform)
  ['page1', 'page2', 'page3', 'page4', 'page5', 'page6'].forEach(id => {
    document.getElementById(id).style.display = 'flex';
  });

  // Splash keluar
  splash.classList.add('slide-out');

  // Setelah 1s (selesai slide), aktifkan page1
  setTimeout(() => {
    splash.style.display = 'none';
    page1.classList.add('active');
  }, 1000);

  // Aktifkan side menu & kontrol
  document.querySelector('.side-menu').classList.add('active');
  document.querySelector('.controls').classList.add('active');

  backControl.classList.add("active");

  // Mulai musik
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
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  }, { threshold: 0.2 });

  animatedText.forEach(el => observer.observe(el));
});

window.addEventListener("scroll", () => {
  const page1 = document.getElementById("page1");
  const backControl = document.querySelector(".back-control");
  const page5 = document.getElementById("page5");
  const rect5 = page5.getBoundingClientRect();
  const page6 = document.getElementById("page6");
  const rect6 = page6.getBoundingClientRect();

  // Hitung posisi page1
  const rect = page1.getBoundingClientRect();

  if (rect.top < -50) {
    // Kalau sudah melewati page1 → munculkan tombol back
    backControl.classList.add("active");
  } else {
    // Kalau masih di page1 → sembunyikan tombol back
    backControl.classList.remove("active");
  }

  if (rect5.top <= 50 && rect5.bottom >= 50) {
    document.body.classList.add("page5-active");
  } else {
    document.body.classList.remove("page5-active");
  }
  if (rect6.top <= 50 && rect6.bottom >= 50) {
    document.body.classList.add("page6-active");
  } else {
  document.body.classList.remove("page6-active");
  }
});

let slideIndex = 0;
const slides = document.querySelectorAll(".pengantin-slide");

// Next / Prev manual
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


// Auto Slide
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }, 4000); // ganti setiap 4 detik
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Jalankan saat halaman load
window.addEventListener("load", () => {
  showSlide(slideIndex);
  startAutoSlide();
});

const dotsContainer = document.querySelector(".carousel-dots");

// Buat dot sesuai jumlah slide
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
    if (i === index) {
      slide.classList.add("active");
    }
  });

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

let startX = 0;
let endX = 0;
const carousel = document.querySelector(".pengantin-carousel");

// Deteksi sentuhan mulai
carousel.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

// Deteksi sentuhan selesai
carousel.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  handleSwipe();
});

function handleSwipe() {
  const diffX = endX - startX;

  if (Math.abs(diffX) > 50) { // minimal geser 50px baru dihitung swipe
    if (diffX > 0) {
      // swipe kanan → slide sebelumnya
      slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    } else {
      // swipe kiri → slide berikutnya
      slideIndex = (slideIndex + 1) % slides.length;
    }
    showSlide(slideIndex);
    resetAutoSlide();
  }
}


// Countdown
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
  <div class="countdown-item">
    <div class="number">${days}</div>
    <div class="label">Hari</div>
  </div>
  <div class="countdown-item">
    <div class="number">${hours}</div>
    <div class="label">Jam</div>
  </div>
  <div class="countdown-item">
    <div class="number">${mins}</div>
    <div class="label">Menit</div>
  </div>
  <div class="countdown-item">
    <div class="number">${secs}</div>
    <div class="label">Detik</div>
  </div>
`;
}, 1000);

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


// === FORM KOMENTAR ===
const form = document.getElementById("guestForm");
const messages = document.getElementById("messages");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value;
  const alamat = document.getElementById("alamat").value;
  const pesan = document.getElementById("pesan").value;
  const kehadiran = document.getElementById("kehadiran").value;

  const loader = document.getElementById("formLoader");
  loader.style.display = "block"; // tampilkan loader

  const data = { nama, alamat, kehadiran, pesan };

  try {
    const res = await fetch("https://script.google.com/macros/s/AKfycbxdgCu2KBJVvL6Hc1n8affHs9CsXp9uoLzPeNTzEBIdykEP2f9W6vcj0aqc4SnEBdyRHw/exec", {
      method: "POST",
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.result === "success") {
      form.reset();
      loadMessages(); // refresh komentar dari server
    } else {
      alert("Terjadi masalah. Coba lagi.");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Gagal mengirim pesan. Coba lagi.");
  } finally {
    loader.style.display = "none"; // sembunyikan loader
  }
});

// === Ambil komentar lama dari Google Sheets ===
async function loadMessages() {
  try {
    const res = await fetch("YOUR_GOOGLE_SCRIPT_URL");
    const data = await res.json();

    messages.innerHTML = ""; // hapus isi lama

    // tampilkan komentar terbaru di atas
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

// jalankan saat halaman dibuka
document.addEventListener("DOMContentLoaded", loadMessages);

// === MUSIC CONTROL ===
const musicControl = document.getElementById("musicControl");
const bgMusic = document.getElementById("bgMusic");

musicControl.addEventListener("click", () => {
  const icon = musicControl.querySelector("img");
  if (bgMusic.paused) {
    bgMusic.play();
    icon.src = "icon-music.png"; // ikon musik normal
  } else {
    bgMusic.pause();
    icon.src = "icon-mute.png";  // ikon musik mute
  }
});

// Tombol kembali ke awal
const backControl = document.getElementById("backControl");
backControl.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function scrollToPage(pageId) {
  document.getElementById(pageId).scrollIntoView({ behavior: 'smooth' });
}





