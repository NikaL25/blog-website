document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    
    const header = document.querySelector(".header-default");
    if (header) {
        const clone = header.cloneNode(true);
        clone.classList.add("clone");
        header.parentNode.insertBefore(clone, header);
        
        window.addEventListener("scroll", function () {
            const fromTop = window.scrollY;
            document.body.classList.toggle("down", fromTop > 300);
        });
    }

    const submenus = document.querySelectorAll(".submenu");
    submenus.forEach(submenu => {
        submenu.insertAdjacentHTML('beforebegin', '<i class="icon-arrow-down switch"></i>');
    });

    document.querySelectorAll(".vertical-menu li i.switch").forEach(btn => {
        btn.addEventListener('click', function () {
            const submenu = this.nextElementSibling;
            if (submenu.style.display === "block") {
                submenu.style.display = "none";
            } else {
                submenu.style.display = "block";
            }
            this.parentElement.classList.toggle("openmenu");
        });
    });

    const burgerBtns = document.querySelectorAll("button.burger-menu");
    const canvasMenu = document.querySelector(".canvas-menu");
    const mainOverlay = document.querySelector(".main-overlay");

    burgerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            canvasMenu.classList.toggle("open");
            mainOverlay.classList.toggle("active");
        });
    });

    document.querySelectorAll(".canvas-menu .btn-close, .main-overlay").forEach(btn => {
        btn.addEventListener('click', () => {
            canvasMenu.classList.remove("open");
            mainOverlay.classList.remove("active");
        });
    });

    document.querySelectorAll(".canvas-menu a[href^='#']").forEach(anchor => {
        anchor.addEventListener('click', () => {
            canvasMenu.classList.remove("open");
            mainOverlay.classList.remove("active");
        });
    });

    document.querySelectorAll("button.search").forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector(".search-popup").classList.add("visible");
        });
    });

    document.querySelectorAll(".search-popup .btn-close").forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector(".search-popup").classList.remove("visible");
        });
    });

    document.addEventListener("keyup", function (e) {
        if (e.key === "Escape") {
            const popup = document.querySelector(".search-popup");
            if (popup) popup.classList.remove("visible");
        }
    });

    document.querySelectorAll('button[data-bs-toggle="tab"]').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll(".tab-pane, .lds-dual-ring").forEach(el => el.classList.add("loading"));
            setTimeout(() => {
                document.querySelectorAll(".tab-pane, .lds-dual-ring").forEach(el => el.classList.remove("loading"));
            }, 500);
        });
    });

    document.querySelectorAll(".post button.toggle-button").forEach(btn => {
        btn.addEventListener('click', function () {
            this.nextElementSibling.classList.toggle("visible");
            this.classList.toggle("icon-close");
            this.classList.toggle("icon-share");
        });
    });

    var listSpacer = document.getElementsByClassName('spacer');
    for (var i = 0; i < listSpacer.length; i++) {
        var size = listSpacer[i].getAttribute('data-height');
        listSpacer[i].style.height = "" + size + "px";
    }

    var listBg = document.getElementsByClassName('data-bg-image');
    for (var j = 0; j < listBg.length; j++) {
        var bgimg = listBg[j].getAttribute('data-bg-image');
        listBg[j].style.backgroundImage = "url('" + bgimg + "')";
    }

 
    function initVanillaCarousel(selector, prevBtn, nextBtn) {
        const container = document.querySelector(selector);
        if (!container) return;
        
        let slideTimer;
        
        const scrollNext = () => {
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
                container.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
            }
        };

        const scrollPrev = () => {
            container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
        };

        const next = document.querySelector(nextBtn);
        const prev = document.querySelector(prevBtn);
        
        if (next) next.addEventListener('click', scrollNext);
        if (prev) prev.addEventListener('click', scrollPrev);

        slideTimer = setInterval(scrollNext, 3000);
        container.addEventListener('mouseenter', () => clearInterval(slideTimer));
        container.addEventListener('mouseleave', () => slideTimer = setInterval(scrollNext, 3000));
    }

    initVanillaCarousel(".post-carousel-twoCol", ".carousel-topNav-prev", ".carousel-topNav-next");
    initVanillaCarousel(".post-carousel-widget", ".carousel-botNav-prev", ".carousel-botNav-next");

    let postsLoaded = 0;
    const loadMoreBtn = document.querySelector('.btn-simple');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function (e) {
            e.preventDefault();
            fetch('data.json')
                .then(res => res.json())
                .then(data => {
                    const nextPosts = data.slice(postsLoaded, postsLoaded + 3);
                    nextPosts.forEach(post => {
                        const postHTML = `
                        <div class="col-md-12 col-sm-6">
                            <div class="post post-list clearfix">
                                <div class="thumb rounded">
                                    <a href="detail-view.html?id=${post.id}">
                                        <div class="inner">
                                           <img src="${post.image}" alt="${post.title}" width="265" height="200" style="object-fit: cover;">
                                        </div>
                                    </a>
                                </div>
                                <div class="details">
                                    <ul class="meta list-inline mb-3">
                                        <li class="list-inline-item"><a href="#">${post.author}</a></li>
                                        <li class="list-inline-item"><a href="#">${post.category}</a></li>
                                        <li class="list-inline-item">${post.date}</li>
                                    </ul>
                                    <h5 class="post-tile">
                                        <a href="detail-view.html?id=${post.id}">${post.title}</a>
                                    </h5>
                                    <p class="excerpt mb-0">${post.description}</p>
                                </div>
                            </div>
                        </div>`;
                        this.parentElement.insertAdjacentHTML('beforebegin', postHTML);
                    });
                    postsLoaded += 3;
                    if (postsLoaded >= data.length) {
                        this.style.display = 'none'; 
                    }
                })
                .catch(err => console.error("Error loading posts:", err));
        });
    }

    const searchInput = document.getElementById('search-input');
    const searchForm = document.getElementById('search-form');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        searchForm.addEventListener('submit', e => e.preventDefault());
        
        searchInput.addEventListener('input', function () {
            const query = this.value.toLowerCase();
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }
            
            fetch('data.json')
                .then(res => res.json())
                .then(data => {
                    const filtered = data.filter(item => 
                        item.title.toLowerCase().includes(query) || 
                        item.description.toLowerCase().includes(query) || 
                        item.category.toLowerCase().includes(query)
                    );
                    
                    if(filtered.length === 0) {
                        searchResults.innerHTML = '<div class="p-3">Nothing found</div>';
                        return;
                    }

                    searchResults.innerHTML = filtered.map(post => `
                        <div class="search-result-item">
                            <a href="detail-view.html?id=${post.id}" class="text-dark d-block">
                                <h6 class="mb-1">${post.title}</h6>
                                <small class="text-muted">${post.category} | ${post.date}</small>
                            </a>
                        </div>
                    `).join('');
                });
        });
    }
});

document.querySelectorAll('.vertical-menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            document.querySelectorAll('.vertical-menu li').forEach(li => {
                li.classList.remove('active');
            });

            this.parentElement.classList.add('active');
            
            const parentSubmenu = this.closest('.submenu');
            if (parentSubmenu) {
                parentSubmenu.parentElement.classList.add('active');
            }
        }
    });
});

document.querySelectorAll('.navbar-nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        if (href.startsWith('#')) {
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });

            const parentNavItem = this.closest('.nav-item');
            if (parentNavItem) {
                parentNavItem.classList.add('active');
            }

         
        }
    });
});

$('.navbar-collapse').collapse('hide');
bootstrap.Collapse.getInstance(document.querySelector('.navbar-collapse')).hide();