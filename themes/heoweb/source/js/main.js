// 添加视差效果
const image = document.getElementsByClassName('banner-pic-img');
new simpleParallax(image, {
    orientation: 'up',
    scale: 1.2,
    delay: 2,
    transition: 'cubic-bezier(0,0,0,1)',
    maxTransition: 50,
    overflow: true
});

// 浮动导航栏滚动检测
let lastScrollY = window.scrollY;
let ticking = false;

function updateNavbar() {
    const scrollY = window.scrollY;
    const nav = document.querySelector('.nav');
    const scrollThreshold = 100; // 滚动阈值

    // 如果是首页且已经加载完成，或者滚动超过阈值，显示导航栏
    if (nav.classList.contains('home-initial')) {
        // 首页初始状态，只有滚动时才显示
        if (scrollY > scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    } else if (nav.classList.contains('home-loaded')) {
        // 首页已加载，始终显示，滚动时改变样式
        if (scrollY > scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    } else {
        // 非首页，始终显示
        if (scrollY > scrollThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    lastScrollY = scrollY;
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// 等待 banner 图片加载完成后启动通知动画
document.addEventListener('DOMContentLoaded', function() {
    const bannerImg = document.querySelector('.banner-img');
    const noticeElement = document.querySelector('.notice-banner-firstwarp');
    const descriptionText = document.querySelector('.discription-text');
    const nav = document.querySelector('.nav');
    
    // 如果是首页，等待动画完成后显示导航栏
    if (nav && nav.classList.contains('home-initial')) {
        // 延迟显示导航栏，让首屏动画先完成
        setTimeout(() => {
            nav.classList.remove('home-initial');
            nav.classList.add('home-loaded');
        }, 3000); // 3秒后显示导航栏
    }
    
    if (bannerImg && noticeElement) {
        // 如果图片已经加载完成
        if (bannerImg.complete) {
            startNoticeAnimationWithDelay();
        } else {
            // 等待图片加载完成
            bannerImg.addEventListener('load', startNoticeAnimationWithDelay);
            // 添加错误处理，即使图片加载失败也要显示通知
            bannerImg.addEventListener('error', startNoticeAnimationWithDelay);
        }
    }
    
    function startNoticeAnimationWithDelay() {
        setTimeout(() => {
            startNoticeAnimation();
        }, 500);
    }
    
    function startNoticeAnimation() {
        // 立即开始通知动画，因为我们已经等待了合适的时间
    }
});

// 添加菜单点击事件
const menuButton = document.getElementById("nav-menu");
menuButton.addEventListener('click',function(){
    if(document.getElementById("body").classList.contains('show-menu')) {
        heoWeb.hideMenu();
    }else {
        heoWeb.showMenu();
    }
},false)

document.getElementsByClassName('menu-list')[0].addEventListener('click', () => {
    heoWeb.hideMenu();
})

//阻止菜单滚动
document.querySelector('.menu-list').addEventListener('wheel',(e)=>{
    e.preventDefault()
})

const heoWeb = {
    //显示菜单
    showMenu: function() {
        document.getElementById("body").classList.add("show-menu");
    },

    hideMenu: function() {
        document.getElementById("body").classList.remove("show-menu");
    },

    //跳转到id
    scrollTo(id) {
        const el = document.getElementById(id)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    },

    // 关闭通知横幅
    closeNotice: function() {
        const notice = document.querySelector('.nav-banner');
        if (notice) {
            notice.style.animation = 'slideUpBanner 0.3s ease-in-out forwards';
            setTimeout(() => {
                notice.style.display = 'none';
                localStorage.setItem('notice-closed', 'true');
            }, 300);
        }
    }
}

// 检查通知横幅是否已经被关闭
document.addEventListener('DOMContentLoaded', function() {
    const noticeClosed = localStorage.getItem('notice-closed');
    const notice = document.querySelector('.nav-banner');
    
    if (noticeClosed === 'true' && notice) {
        notice.style.display = 'none';
    }
    
    // 初始化导航下拉菜单
    initNavDropdown();
    
    // 初始化表格分页
    initTablePagination();
});

// 导航下拉菜单交互
function initNavDropdown() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
        let timer;
        
        // 鼠标进入时显示菜单
        dropdown.addEventListener('mouseenter', () => {
            clearTimeout(timer);
            const menu = dropdown.querySelector('.nav-dropdown-menu');
            if (menu) {
                menu.style.opacity = '1';
                menu.style.visibility = 'visible';
                menu.style.transform = 'translateY(0)';
            }
        });
        
        // 鼠标离开时隐藏菜单（延迟一点时间）
        dropdown.addEventListener('mouseleave', () => {
            timer = setTimeout(() => {
                const menu = dropdown.querySelector('.nav-dropdown-menu');
                if (menu) {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(-10px)';
                }
            }, 100);
        });
    });
    
    // 移动端点击导航菜单项
    const mobileNavItems = document.querySelectorAll('.menu-list .nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            // 如果是锚点链接，关闭菜单
            if (item.getAttribute('href').startsWith('javascript:')) {
                heoWeb.hideMenu();
            }
        });
    });
}

// 表格分页功能
function initTablePagination() {
    const paginatedTables = document.querySelectorAll('.paginated-table');
    
    paginatedTables.forEach(table => {
        const pageSize = parseInt(table.dataset.pageSize) || 5;
        const rows = table.querySelectorAll('.table-row');
        const totalPages = Math.ceil(rows.length / pageSize);
        
        if (totalPages <= 1) {
            // 如果只有一页或没有数据，隐藏分页控件
            const paginationContainer = table.querySelector('.pagination-container');
            if (paginationContainer) {
                paginationContainer.style.display = 'none';
            }
            return;
        }
        
        let currentPage = 1;
        
        // 更新分页控件
        function updatePagination() {
            // 更新页面信息
            const currentPageSpan = table.querySelector('.current-page');
            const totalPagesSpan = table.querySelector('.total-pages');
            if (currentPageSpan) currentPageSpan.textContent = currentPage;
            if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
            
            // 显示/隐藏表格行
            rows.forEach((row, index) => {
                const rowPage = Math.floor(index / pageSize) + 1;
                if (rowPage === currentPage) {
                    row.classList.remove('hidden');
                } else {
                    row.classList.add('hidden');
                }
            });
            
            // 更新分页按钮状态
            const prevBtn = table.querySelector('.prev-btn');
            const nextBtn = table.querySelector('.next-btn');
            
            if (prevBtn) {
                prevBtn.disabled = currentPage === 1;
            }
            if (nextBtn) {
                nextBtn.disabled = currentPage === totalPages;
            }
            
            // 更新页码按钮
            updatePageNumbers();
        }
        
        // 更新页码按钮
        function updatePageNumbers() {
            const pageNumbersContainer = table.querySelector('.page-numbers');
            if (!pageNumbersContainer) return;
            
            pageNumbersContainer.innerHTML = '';
            
            // 计算显示的页码范围
            let startPage = Math.max(1, currentPage - 2);
            let endPage = Math.min(totalPages, currentPage + 2);
            
            // 如果页码较少，显示所有页码
            if (totalPages <= 5) {
                startPage = 1;
                endPage = totalPages;
            }
            
            // 添加第一页和省略号
            if (startPage > 1) {
                pageNumbersContainer.appendChild(createPageNumber(1));
                if (startPage > 2) {
                    pageNumbersContainer.appendChild(createEllipsis());
                }
            }
            
            // 添加页码按钮
            for (let i = startPage; i <= endPage; i++) {
                pageNumbersContainer.appendChild(createPageNumber(i));
            }
            
            // 添加省略号和最后一页
            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pageNumbersContainer.appendChild(createEllipsis());
                }
                pageNumbersContainer.appendChild(createPageNumber(totalPages));
            }
        }
        
        // 创建页码按钮
        function createPageNumber(pageNum) {
            const pageButton = document.createElement('div');
            pageButton.className = 'page-number';
            pageButton.textContent = pageNum;
            
            if (pageNum === currentPage) {
                pageButton.classList.add('active');
            }
            
            pageButton.addEventListener('click', () => {
                if (pageNum !== currentPage) {
                    currentPage = pageNum;
                    updatePagination();
                }
            });
            
            return pageButton;
        }
        
        // 创建省略号
        function createEllipsis() {
            const ellipsis = document.createElement('div');
            ellipsis.className = 'page-number ellipsis';
            ellipsis.textContent = '...';
            return ellipsis;
        }
        
        // 绑定上一页/下一页按钮事件
        const prevBtn = table.querySelector('.prev-btn');
        const nextBtn = table.querySelector('.next-btn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    updatePagination();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePagination();
                }
            });
        }
        
        // 初始化显示第一页
        updatePagination();
    });
}

// 博客功能 - 阅读进度条
function updateReadingProgress() {
    const progressBar = document.querySelector('.reading-progress-bar');
    if (!progressBar) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
    
    progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
}

// 博客功能 - 目录高亮
function updateTocHighlight() {
    const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    if (!headings.length || !tocLinks.length) return;
    
    let currentHeading = null;
    const scrollTop = window.pageYOffset + 100;
    
    for (let i = headings.length - 1; i >= 0; i--) {
        if (headings[i].offsetTop <= scrollTop) {
            currentHeading = headings[i];
            break;
        }
    }
    
    tocLinks.forEach(link => link.classList.remove('active'));
    
    if (currentHeading) {
        const currentId = currentHeading.id;
        const activeLink = document.querySelector(`.toc-link[href="#${currentId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// 博客功能 - 平滑滚动到目录标题
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('toc-link')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const offset = 80; // 考虑导航栏高度
            const elementPosition = targetElement.offsetTop - offset;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
});

// 监听滚动事件，更新阅读进度和目录高亮
window.addEventListener('scroll', () => {
    updateReadingProgress();
    updateTocHighlight();
});

// 页面加载完成后初始化博客功能
document.addEventListener('DOMContentLoaded', () => {
    updateReadingProgress();
    updateTocHighlight();
    
    // 为文章标题添加id（如果没有的话）
    const headings = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4');
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
    });
});
