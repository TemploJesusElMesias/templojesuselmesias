// Define los usuarios y contraseñas permitidos
const validUsers = [
  { username: "JoelGuthrie", password: "1234" },
  { username: "Belford", password: "8475" }
];

const editableUsers = ["JoelGuthrie", "Belford"];

// Elementos del DOM
const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const loginModal = document.getElementById("loginModal");
const userInfo = document.getElementById("userInfo");
const welcomeMessage = document.getElementById("welcomeMessage");
const userAvatar = document.getElementById("userAvatar");
const errorMessage = document.getElementById("errorMessage");
const mobileMenuIcon = document.getElementById("mobile-menu");
const navLinks = document.getElementById("nav-links");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const prayerForm = document.getElementById("prayerForm");
const photoUploadInput = document.getElementById('photo-upload');
const uploadPhotoBtn = document.getElementById('upload-photo-btn');
const photoGallery = document.getElementById('photo-gallery');

// Inicialización de AOS
AOS.init({
  duration: 1000,
  once: true,
});

// Manejo del scroll para el header
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 100) {
    header.style.backgroundColor = 'rgba(34, 35, 35, 0.9)';
    header.style.padding = '0.5rem 0';
  } else {
    header.style.backgroundColor = '#222323';
    header.style.padding = '1rem 0';
  }
});

// Manejo del menú móvil
mobileMenuIcon.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

// Cerrar menú móvil al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// Manejo del inicio de sesión
loginButton.addEventListener("click", () => {
  loginModal.style.display = "flex";
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const user = validUsers.find(u => u.username === username && u.password === password);

  if (user) {
    loginModal.style.display = "none";
    loginButton.style.display = "none";
    userInfo.style.display = "flex";
    welcomeMessage.textContent = `Bienvenido, ${username}`;
    userAvatar.src = `https://api.dicebear.com/6.x/initials/svg?seed=${username}`;
    userInfo.classList.add("welcome-animation");

    // Mostrar botones de edición y "Cambiar Video" si el usuario tiene permisos
    if (editableUsers.includes(username)) {
      document.querySelectorAll('.edit-btn').forEach(btn => btn.style.display = 'inline-block');
      toggleChangeVideoButton(true);
    }
  } else {
    errorMessage.style.display = "block";
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 3000);
  }
});

logoutButton.addEventListener("click", () => {
  loginButton.style.display = "block";
  userInfo.style.display = "none";
  document.querySelectorAll('.edit-btn').forEach(btn => btn.style.display = 'none');
  toggleChangeVideoButton(false);
});

// Cerrar el modal de login si se hace clic fuera de él
window.addEventListener('click', (e) => {
  if (e.target === loginModal) {
    loginModal.style.display = 'none';
  }
});

// Manejo de la búsqueda
const sections = Array.from(document.querySelectorAll('section')).map(section => ({
  id: section.id,
  content: section.textContent,
  element: section
}));

const fuseOptions = {
  includeScore: true,
  threshold: 0.4,
  keys: ['content']
};

const fuse = new Fuse(sections, fuseOptions);

searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  performSearch();
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    performSearch();
  }
});

function performSearch() {
  const searchTerm = searchInput.value.trim();

  if (searchTerm === '') {
    alert("Por favor, ingrese un término de búsqueda.");
    return;
  }

  const results = fuse.search(searchTerm);

  if (results.length > 0) {
    const bestMatch = results[0].item;
    bestMatch.element.scrollIntoView({ behavior: 'smooth' });
    
    bestMatch.element.style.transition = 'background-color 0.3s';
    bestMatch.element.style.backgroundColor = 'rgba(180, 128, 79, 0.1)';
    setTimeout(() => {
      bestMatch.element.style.backgroundColor = '';
    }, 1500);
  } else {
    alert("No se encontraron resultados para la búsqueda.");
  }

  searchInput.value = '';
}

// Manejo del carrusel de anuncios
const carousel = document.querySelector('.carousel-inner');
const items = carousel.querySelectorAll('.carousel-item');
const prevButton = document.querySelector('.carousel-control.prev');
const nextButton = document.querySelector('.carousel-control.next');
let currentIndex = 0;

function showSlide(index) {
  carousel.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % items.length;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + items.length) % items.length;
  showSlide(currentIndex);
}

prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

// Iniciar el carrusel desde el primer elemento
showSlide(0);

// Cambiar slide automáticamente cada 5 segundos
setInterval(nextSlide, 5000);

// Manejo del formulario de oración
prayerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("prayerName").value;
  const request = document.getElementById("prayerRequest").value;
  const email = "jesuselmesiastemplocristiano@gmail.com"; // Email actualizado
  const subject = encodeURIComponent("Nueva Petición de Oración");
  const body = encodeURIComponent(`Nombre: ${name}\n\nPetición: ${request}`);
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
});

// Funcionalidad de edición
const editButtons = document.querySelectorAll('.edit-btn');
const editModal = document.getElementById('editModal');
const editForm = document.getElementById('editForm');
const editModalTitle = document.getElementById('editModalTitle');
const editTitleInput = document.getElementById('editTitle');
const editContentInput = document.getElementById('editContent');
const editDateInput = document.getElementById('editDate');

let currentEditTarget = null;

editButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentEditTarget = button.dataset.target;
    const targetElement = document.getElementById(currentEditTarget);
    
    editModalTitle.textContent = `Editar ${targetElement.tagName === 'H3' ? 'Título' : 'Contenido'}`;
    
    if (targetElement.tagName === 'H3') {
      editTitleInput.value = targetElement.textContent;
      editTitleInput.style.display = 'block';
      editContentInput.style.display = 'none';
      editDateInput.style.display = 'none';
    } else if (targetElement.id.includes('date')) {
      editDateInput.value = targetElement.textContent.replace('Fecha:', '').trim();
      editTitleInput.style.display = 'none';
      editContentInput.style.display = 'none';
      editDateInput.style.display = 'block';
      
      // Initialize calendar only for date fields
      initializeCalendar();
    } else {
      editContentInput.value = targetElement.textContent;
      editTitleInput.style.display = 'none';
      editContentInput.style.display = 'block';
      editDateInput.style.display = 'none';
    }
    
    editModal.style.display = 'block';
  });
});

editForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const targetElement = document.getElementById(currentEditTarget);

  if (targetElement.tagName === 'H3') {
    targetElement.textContent = editTitleInput.value;
  } else if (targetElement.id.includes('date')) {
    targetElement.textContent = `Fecha: ${editDateInput.value}`;
  } else {
    targetElement.textContent = editContentInput.value;
  }

  // Save changes to localStorage
  localStorage.setItem(currentEditTarget, targetElement.textContent);

  editModal.style.display = 'none';
  removeCalendar();
});

// Cerrar el modal de edición si se hace clic fuera de él
window.addEventListener('click', (e) => {
  if (e.target === editModal) {
    editModal.style.display = 'none';
    removeCalendar();
  }
});

// Cargar contenido guardado al cargar la página
window.addEventListener('load', () => {
  document.querySelectorAll('[id]').forEach(element => {
    const savedContent = localStorage.getItem(element.id);
    if (savedContent) {
      element.textContent = savedContent;
    }
  });
  toggleChangeVideoButton(false);
    const savedVideoUrl = localStorage.getItem('currentVideoUrl');
    if (savedVideoUrl) {
        changeVideo(savedVideoUrl);
    }
    // Asegurarse de que el icono de Facebook sea visible
    const facebookFloat = document.querySelector('.facebook-float');
    if (facebookFloat) {
        facebookFloat.style.display = 'flex';
    }

    // Cargar imágenes de la galería
    const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
    savedImages.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'Foto guardada';
        img.className = 'gallery-image';
        
        const imgContainer = document.createElement('div');
        imgContainer.className = 'gallery-item';
        imgContainer.appendChild(img);
        
        photoGallery.appendChild(imgContainer);
    });
});

// Funcionalidad para volver al inicio al hacer clic en el logo
document.querySelector('.logo-link').addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

// Cerrar el menú móvil al hacer clic fuera de él
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 && !e.target.closest('.nav-links') && !e.target.closest('.mobile-menu-icon')) {
    navLinks.classList.remove('active');
  }
});

// Función para inicializar el calendario
function initializeCalendar() {
  // Eliminar cualquier calendario existente
  const existingCalendar = document.getElementById('calendar');
  if (existingCalendar) {
    existingCalendar.remove();
  }

  const calendarContainer = document.createElement('div');
  calendarContainer.id = 'calendar';
  calendarContainer.className = 'calendar';
  editForm.insertBefore(calendarContainer, editDateInput);

  const calendar = new Calendar(calendarContainer, {
    date: new Date(),
    onSelect: (date) => {
      editDateInput.value = formatDate(date);
    },
  });
}

// Función para eliminar el calendario
function removeCalendar() {
  const existingCalendar = document.getElementById('calendar');
  if (existingCalendar) {
    existingCalendar.remove();
  }
}

// Función auxiliar para formatear la fecha
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Clase Calendar para implementar la funcionalidad del calendario
class Calendar {
  constructor(container, options) {
    this.container = container;
    this.date = options.date || new Date();
    this.onSelect = options.onSelect || function() {};
    this.render();
    this.addEventListeners();
  }

  render() {
    const year = this.date.getFullYear();
    const month = this.date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    this.container.innerHTML = `
      <div class="calendar-header">
        <button class="prev-month">&lt;</button>
        <span>${this.getMonthName(month)} ${year}</span>
        <button class="next-month">&gt;</button>
      </div>
      <div class="weekdays">
        ${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => `<div>${day}</div>`).join('')}
      </div>
      <div class="days">
        ${Array(firstDay).fill('<div></div>').join('')}
        ${Array(daysInMonth).fill(0).map((_, i) => {
          const day = i + 1;
          const isToday = this.isToday(year, month, day);
          return `<div class="day${isToday ? ' today' : ''}" data-date="${year}-${month + 1}-${day}">${day}</div>`;
        }).join('')}
      </div>
    `;
  }

  addEventListeners() {
    this.container.querySelector('.prev-month').addEventListener('click', () => this.prevMonth());
    this.container.querySelector('.next-month').addEventListener('click', () => this.nextMonth());
    this.container.querySelectorAll('.day').forEach(dayElement => {
      dayElement.addEventListener('click', (e) => this.selectDate(e.target.dataset.date));
    });
  }

  prevMonth() {
    this.date.setMonth(this.date.getMonth() - 1);
    this.render();
    this.addEventListeners();
  }

  nextMonth() {
    this.date.setMonth(this.date.getMonth() + 1);
    this.render();
    this.addEventListeners();
  }

  selectDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    this.onSelect(selectedDate);
  }

  getMonthName(month) {
    return ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][month];
  }

  isToday(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  }
}

// Función para mostrar u ocultar el botón de cambiar video
function toggleChangeVideoButton(show) {
    const changeVideoBtn = document.getElementById('changeVideoBtn');
    if (changeVideoBtn) {
        changeVideoBtn.style.display = show ? 'inline-block' : 'none';
    }
}

// Función para cambiar el video
function changeVideo(url) {
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
        let embedCode = '';
        
        if (url.includes('facebook.com')) {
            // Extract the video ID from the Facebook URL
            const videoId = url.split('/').pop().split('?')[0];
            embedCode = `<iframe src="https://www.facebook.com/plugins/video.php?height=314&href=${encodeURIComponent(url)}&show_text=false&width=560&t=0" width="560" height="314" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`;
        } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let videoId = url.split('v=')[1] || url.split('/').pop();
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) {
                videoId = videoId.substring(0, ampersandPosition);
            }
            embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
        } else {
            alert('URL de video no válida. Por favor, introduce una URL de Facebook o YouTube.');
            return;
        }

        if (embedCode) {
            videoContainer.innerHTML = embedCode;
            localStorage.setItem('currentVideoUrl', url);
        }
    }
}
// Event listener para el botón de cambiar video
document.getElementById('changeVideoBtn').addEventListener('click', () => {
    document.getElementById('changeVideoModal').style.display = 'block';
});

// Event listener para el formulario de cambiar video
document.getElementById('changeVideoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newVideoUrl = document.getElementById('newVideoUrl').value;
    changeVideo(newVideoUrl);
    document.getElementById('changeVideoModal').style.display = 'none';
});

// Cerrar el modal de cambiar video si se hace clic fuera de él
window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('changeVideoModal')) {
        document.getElementById('changeVideoModal').style.display = 'none';
    }
});

// Funcionalidad para subir fotos

uploadPhotoBtn.addEventListener('click', () => {
    photoUploadInput.click();
});

photoUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Foto subida';
            img.className = 'gallery-image';
            
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gallery-item';
            imgContainer.appendChild(img);
            
            photoGallery.appendChild(imgContainer);
            
            // Guardar la imagen en localStorage
            const savedImages = JSON.parse(localStorage.getItem('galleryImages') || '[]');
            savedImages.push(e.target.result);
            localStorage.setItem('galleryImages', JSON.stringify(savedImages));
        };
        reader.readAsDataURL(file);
    }
    
});

















