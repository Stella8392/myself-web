// ============ 初始化 ============
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initDragAndDrop();
  initScrollHighlight();
  initMobileMenu();
});

// ============ 导航切换功能 ============
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // 移除所有激活状态
      navLinks.forEach(nav => nav.classList.remove('active'));
      // 添加激活状态
      this.classList.add('active');
    });
  });
}

// ============ 滚动监听高亮 ============
function initScrollHighlight() {
  const sections = document.querySelectorAll('.page-section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', function() {
    let currentSection = '';
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 检查是否滚动到页面底部
    if (scrollPosition + windowHeight >= documentHeight - 100) {
      // 滚动到页面底部时，设置为最后一个板块（荣誉板块）
      currentSection = sections[sections.length - 1].getAttribute('id');
    } else {
      // 正常滚动时，选择最后一个可见的板块
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (scrollPosition >= sectionTop) {
          currentSection = section.getAttribute('id');
        }
      });
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentSection) {
        link.classList.add('active');
      }
    });
  });
}

// ============ 卡片拖拽功能 ============
let draggedElement = null;
let dragOffset = { x: 0, y: 0 };
let initialPosition = { x: 0, y: 0 };

function initDragAndDrop() {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    card.addEventListener('mousedown', handleMouseDown);
    card.addEventListener('touchstart', handleTouchStart);
  });

  document.addEventListener('dragover', handleDragOver);
  document.addEventListener('drop', handleDrop);
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('touchmove', handleTouchMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('touchend', handleTouchEnd);
}

function handleDragStart(e) {
  draggedElement = this;
  this.style.opacity = '0.7';
  this.style.zIndex = '1000';
}

function handleDragEnd(e) {
  if (draggedElement) {
    draggedElement.style.opacity = '1';
    draggedElement.style.zIndex = 'auto';
    draggedElement.style.transform = '';
  }
  draggedElement = null;
}

function handleDragOver(e) {
  e.preventDefault();
  if (draggedElement) {
    draggedElement.style.transform = `translate(${e.clientX - initialPosition.x}px, ${e.clientY - initialPosition.y}px)`;
  }
}

function handleDrop(e) {
  e.preventDefault();
}

function handleMouseDown(e) {
  if (e.button !== 0) return;
  
  draggedElement = this;
  initialPosition = {
    x: e.clientX - this.getBoundingClientRect().left,
    y: e.clientY - this.getBoundingClientRect().top
  };
  
  this.style.cursor = 'grabbing';
  this.style.opacity = '0.8';
  this.style.zIndex = '1000';
}

function handleMouseMove(e) {
  if (!draggedElement) return;
  
  const rect = draggedElement.getBoundingClientRect();
  const x = e.clientX - rect.left - initialPosition.x;
  const y = e.clientY - rect.top - initialPosition.y;
  
  draggedElement.style.transform = `translate(${x}px, ${y}px)`;
}

function handleMouseUp(e) {
  if (draggedElement) {
    draggedElement.style.cursor = 'grab';
    draggedElement.style.opacity = '1';
    draggedElement.style.zIndex = 'auto';
    draggedElement.style.transform = '';
  }
  draggedElement = null;
}

function handleTouchStart(e) {
  draggedElement = this;
  initialPosition = {
    x: e.touches[0].clientX - this.getBoundingClientRect().left,
    y: e.touches[0].clientY - this.getBoundingClientRect().top
  };
  
  this.style.opacity = '0.8';
  this.style.zIndex = '1000';
}

function handleTouchMove(e) {
  if (!draggedElement) return;
  e.preventDefault();
  
  const rect = draggedElement.getBoundingClientRect();
  const x = e.touches[0].clientX - rect.left - initialPosition.x;
  const y = e.touches[0].clientY - rect.top - initialPosition.y;
  
  draggedElement.style.transform = `translate(${x}px, ${y}px)`;
}

function handleTouchEnd(e) {
  if (draggedElement) {
    draggedElement.style.opacity = '1';
    draggedElement.style.zIndex = 'auto';
    draggedElement.style.transform = '';
  }
  draggedElement = null;
}

// ============ 移动端菜单 ============
function initMobileMenu() {
  // 在移动设备上添加额外功能
  if (window.innerWidth <= 768) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        // 点击后移除其他菜单项的高亮
        navItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }
}

// ============ 响应式检测 ============
window.addEventListener('resize', function() {
  if (window.innerWidth <= 768) {
    initMobileMenu();
  }
});

// ============ 平滑滚动增强 ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ============ 卡片进入动画 ============
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll('.card, .honors-item').forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(20px)';
  item.style.transition = 'all 0.6s ease';
  observer.observe(item);
});

// ============ 头像拖拽互动 ============
const profileImage = document.querySelector('.profile-image img');
if (profileImage) {
  let profileDragged = false;
  let profileStartX = 0;
  let profileStartY = 0;
  let profileTransformX = 0;
  let profileTransformY = 0;

  profileImage.addEventListener('mousedown', function(e) {
    profileDragged = true;
    profileStartX = e.clientX - profileTransformX;
    profileStartY = e.clientY - profileTransformY;
  });

  document.addEventListener('mousemove', function(e) {
    if (profileDragged && profileImage) {
      profileTransformX = e.clientX - profileStartX;
      profileTransformY = e.clientY - profileStartY;
      profileImage.style.transform = `translate(${profileTransformX / 20}px, ${profileTransformY / 20}px) scale(1.05) rotate(5deg)`;
    }
  });

  document.addEventListener('mouseup', function() {
    profileDragged = false;
    profileImage.style.transform = '';
  });
}

// ============ 页面加载动画 ============
window.addEventListener('load', function() {
  const mainContent = document.querySelector('.main-content');
  mainContent.style.opacity = '0';
  mainContent.style.transform = 'translateY(10px)';
  
  setTimeout(() => {
    mainContent.style.transition = 'all 0.8s ease';
    mainContent.style.opacity = '1';
    mainContent.style.transform = 'translateY(0)';
  }, 100);
});

// ============ 键盘快捷键 ============
document.addEventListener('keydown', function(e) {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = ['home', 'education', 'campus', 'projects', 'internship', 'honors'];
  
  // Alt + 数字快速切换
  if (e.altKey) {
    const num = parseInt(e.key);
    if (num >= 1 && num <= sections.length) {
      const targetNav = document.querySelector(`[data-section="${sections[num - 1]}"]`);
      if (targetNav) {
        targetNav.click();
      }
    }
  }
});

// ============ 性能优化：防抖 ============
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ============ 页面离开警告 ============
window.addEventListener('beforeunload', function(e) {
  // 可选：如果有未保存的修改，显示警告
  // e.preventDefault();
  // e.returnValue = '';
});

console.log('🎉 欢迎来到黄欣的个人简介网站！\n🌟 拖拽卡片来互动吧！\n💌 使用 Alt + 数字(1-6) 快速切换菜单');
