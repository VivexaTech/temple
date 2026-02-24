document.addEventListener("DOMContentLoaded", function () {
    
    // 1. Sticky Navbar & Scroll To Top Button
    const navbar = document.getElementById("mainNav");
    const scrollTopBtn = document.getElementById("scrollTop");

    window.addEventListener("scroll", function () {
        // Navbar scrolled state
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }

        // Scroll to top button visibility
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add("active");
        } else {
            scrollTopBtn.classList.remove("active");
        }
    });

    // 2. Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            const navbarToggler = document.querySelector('.navbar-toggler');
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }

            // Scroll to target
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 70; // Offset for fixed navbar
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll(".reveal");

    const revealOptions = {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Slight offset
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add("active");
                // Optional: Stop observing once revealed
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 4. Donation Buttons Interactivity (Visual only for UI)
    const amountButtons = document.querySelectorAll('.amt-btn');
    amountButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            amountButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
    // ... [AAPKA PEHLE WALA SCROLL AUR NAVBAR KA CODE YAHI RAHEGA] ...

    // ==========================================
    // Cloudinary Automatic Gallery Fetch (By Tag)
    // ==========================================
    
    // Aapka Cloudinary cloud name (aapke URL se nikala hua)
    const cloudName = 'dngw5m9p8';
    // Wo tag jo aapne Cloudinary me images ko diya hai
    const tagName = 'mandir_gallery'; 

    const galleryGrid = document.getElementById('galleryGrid');
    const lightboxImage = document.getElementById('lightboxImage');

    async function loadGalleryAutomatically() {
        if (!galleryGrid) return; // Agar gallery page nahi hai toh aage mat badho

        galleryGrid.innerHTML = '<div class="col-12 text-center"><i class="fa-solid fa-spinner fa-spin fa-2x text-saffron"></i><p class="mt-2">Loading Divine Glimpses...</p></div>';

        // Cloudinary se automatic tag ki list mangwana
        const listUrl = `https://res.cloudinary.com/${cloudName}/image/list/${tagName}.json`;

        try {
            const response = await fetch(listUrl);
            
            if (!response.ok) {
                throw new Error("Gallery list fetch failed. Did you enable Resource List in Cloudinary Security settings?");
            }

            const data = await response.json();
            galleryGrid.innerHTML = ''; // Loading spinner hata do

            // Cloudinary har image ka data 'resources' array me bhejta hai
            data.resources.forEach(img => {
                // img.public_id me image ka naam hota hai
                // Hum khud automatic URL banayenge
                
                // Original High-Quality URL (Lightbox ke liye)
                const originalUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v${img.version}/${img.public_id}.${img.format}`;
                
                // Thumbnail URL (w_600, q_auto, f_auto) taaki page fast load ho
                const thumbUrl = `https://res.cloudinary.com/${cloudName}/image/upload/w_600,q_auto,f_auto/v${img.version}/${img.public_id}.${img.format}`;

                const html = `
                    <div class="col-lg-4 col-md-6 gallery-box reveal active">
                        <div class="gallery-item shadow-sm" data-bs-toggle="modal" data-bs-target="#lightboxModal" onclick="openLightbox('${originalUrl}')">
                            <img src="${thumbUrl}" alt="Shri Ram Mandir" class="img-fluid w-100" loading="lazy">
                            <div class="gallery-overlay">
                                <i class="fa-solid fa-magnifying-glass-plus"></i>
                            </div>
                        </div>
                    </div>
                `;
                galleryGrid.insertAdjacentHTML('beforeend', html);
            });

        } catch (error) {
            console.error("Error loading images:", error);
            galleryGrid.innerHTML = '<div class="col-12 text-center text-danger"><p>Failed to load gallery images. Please check console for errors.</p></div>';
        }
    }

    // Lightbox Function
    window.openLightbox = function(imageUrl) {
        if (lightboxImage) {
            lightboxImage.src = imageUrl;
        }
    };

    // Load function call karein
    loadGalleryAutomatically();
});