document.addEventListener('DOMContentLoaded', function() {
	// Autocomplete for search boxes
	function setupAutocomplete(inputId) {
		const input = by(inputId);
		if(!input || typeof PRODUCTS === 'undefined') return;
		// Create dropdown
		let dropdown = document.createElement('div');
		dropdown.className = 'autocomplete-dropdown';
		dropdown.style.position = 'absolute';
		dropdown.style.background = '#fff';
		dropdown.style.border = '1px solid #eee';
		dropdown.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
		dropdown.style.zIndex = '1000';
		dropdown.style.display = 'none';
		dropdown.style.maxHeight = '220px';
		dropdown.style.overflowY = 'auto';
		input.parentNode.appendChild(dropdown);

		input.addEventListener('input', function() {
			const val = input.value.trim().toLowerCase();
			if(!val) { dropdown.style.display = 'none'; dropdown.innerHTML = ''; return; }
			const matches = PRODUCTS.filter(p => p.title.toLowerCase().includes(val) || p.category.toLowerCase().includes(val));
			if(matches.length === 0) { dropdown.style.display = 'none'; dropdown.innerHTML = ''; return; }
			dropdown.innerHTML = '';
			matches.forEach(p => {
				const item = document.createElement('div');
				item.className = 'autocomplete-item';
				item.textContent = p.title + (p.size ? ' • ' + p.size : '');
				item.style.padding = '8px 12px';
				item.style.cursor = 'pointer';
				item.addEventListener('mousedown', function(e) {
					input.value = p.title;
					dropdown.style.display = 'none';
					location.href = 'shop.html?search=' + encodeURIComponent(p.title);
				});
				dropdown.appendChild(item);
			});
			// Position dropdown
			const rect = input.getBoundingClientRect();
			dropdown.style.left = rect.left + 'px';
			dropdown.style.top = (rect.bottom + window.scrollY) + 'px';
			dropdown.style.width = rect.width + 'px';
			dropdown.style.display = 'block';
		});
		// Hide dropdown on blur
		input.addEventListener('blur', function() {
			setTimeout(() => { dropdown.style.display = 'none'; }, 120);
		});
	}

	setupAutocomplete('globalSearch');
	setupAutocomplete('searchAbout');
	setupAutocomplete('searchContact');

	// ...existing code...
	// All other JS (cart, featured products, etc.)
	(function(){
		// ...existing code...
	})();
});
// main site JavaScript (shared across pages)
(function(){
	// Cart state persisted in localStorage
	const CART_KEY = 'archies_cart_v2';
	const state = { cart: JSON.parse(localStorage.getItem(CART_KEY) || '{}') };
	function save(){ localStorage.setItem(CART_KEY, JSON.stringify(state.cart)); }
	function formatMoney(n){ return 'Ksh ' + n.toFixed(2); }

	// shared DOM hooks (some pages might not have all elements)
	function by(id){ return document.getElementById(id); }

	// Update header cart badges on all pages
	function updateBadges(){ const count = Object.values(state.cart).reduce((s,i)=>s+i.qty,0); ['badgeTop','badgeShop','badgeProd','badgeAbout','badgeContact','badgeRoot'].forEach(id=>{ const el = by(id); if(el) el.textContent = count; }); ['badgeTop','badgeShop','badgeProd','badgeAbout','badgeContact'].forEach(id=>{ const e=by(id); if(e) e.textContent=count; }); const top = by('badgeTop'); if(top) top.textContent = count; const top2 = by('count'); if(top2) top2.textContent = count; }

	// Generic add to cart
	window.addToCart = function(id, qty=1){ if(!state.cart[id]) state.cart[id] = {id,qty:0}; state.cart[id].qty += qty; save(); updateBadges(); animateCartButton(); renderCartAreas(); }

	// expose remove/change functions for cart areas
	window.removeFromCart = function(id){ delete state.cart[id]; save(); updateBadges(); renderCartAreas(); }
	window.changeQty = function(id, delta){ if(!state.cart[id]) return; state.cart[id].qty = Math.max(1, state.cart[id].qty + delta); save(); updateBadges(); renderCartAreas(); }

	function animateCartButton(){ const b = document.getElementById('cartBtnTop') || document.querySelector('.cart-btn'); if(b) b.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:220}); }

	// Render featured products in index.html
	const featuredRoot = document.getElementById('featuredGrid'); if(featuredRoot){ PRODUCTS.slice(0,4).forEach(p=>{ const card = document.createElement('article'); card.className='card fade-in-up'; card.innerHTML = `<div class="image"><img src="${p.img}" alt="${p.title}"/></div><div class="meta"><div><div class="title-card">${p.title}</div><div class="muted">${p.category} • ${p.size}</div></div><div class="price">${formatMoney(p.price)}</div></div><div class="actions"><button class="btn btn-primary" onclick="addToCart('${p.id}')">Add to cart</button><a class="btn btn-ghost" href="product.html?id=${p.id}">View</a></div>`; featuredRoot.appendChild(card); }); }

	// ...existing code...

	const gridAll = document.getElementById('productsGridAll');
	if(gridAll){
		// Category filter chips
		const cats = Array.from(new Set(PRODUCTS.map(p=>p.category)));
		const filterCats = document.getElementById('filterCats');
		cats.forEach(c=>{
			const b = document.createElement('button');
			b.className = 'chip';
			b.textContent = c;
			b.dataset.cat = c;
			b.addEventListener('click', ()=>{
				b.classList.toggle('active');
				applyShopFilters();
			});
			filterCats.appendChild(b);
		});

		// Sort By filter (dropdown)
		const sortSelect = document.getElementById('sortBy');
		if(sortSelect) sortSelect.addEventListener('change', applyShopFilters);

		function renderList(list){
			gridAll.innerHTML = '';
			if(!list.length){
				gridAll.innerHTML = '<div style="grid-column:1/-1;padding:24px;text-align:center;color:var(--muted)">No products found.</div>';
				by('countShop').textContent = 0;
				return;
			}
			list.forEach(p => {
				const c = document.createElement('article');
				c.className = 'card';
				c.innerHTML = `<div class="image"><img src="${p.img}" alt="${p.title}"/></div><div class="meta"><div><div class="title-card">${p.title}</div><div class="muted">${p.category} • ${p.size}</div></div><div class="price">${formatMoney(p.price)}</div></div><div class="actions"><button class="btn btn-primary" onclick="addToCart('${p.id}')">Add to cart</button><a class="btn btn-ghost" href="product.html?id=${p.id}">Details</a></div>`;
				gridAll.appendChild(c);
			});
			by('countShop').textContent = list.length;
		}

		// filters
		function applyShopFilters(){
			let list = PRODUCTS.slice();
			// Category chips
			const active = Array.from(document.querySelectorAll('#filterCats .chip.active')).map(n=>n.dataset.cat);
			if(active.length) list = list.filter(p=> active.includes(p.category));
			// Price filter
			const max = Number(by('priceRange').value);
			list = list.filter(p=> p.price <= max);
			// Search
			const q = (by('searchShop') && by('searchShop').value || '').trim().toLowerCase();
			if(q) list = list.filter(p=> (p.title + ' ' + p.category).toLowerCase().includes(q));
		// Sort By filter
		const sort = (by('sortBy') && by('sortBy').value) || 'default';
		if(sort === 'priceLow') list.sort((a,b)=>a.price-b.price);
		if(sort === 'priceHigh') list.sort((a,b)=>b.price-a.price);
		if(sort === 'alpha') list.sort((a,b)=>a.title.localeCompare(b.title));
		if(sort === 'newest') list.sort((a,b)=>b.id.localeCompare(a.id));
			renderList(list);
		}

		// attach filters listeners
		if(by('priceRange')){
			by('priceRange').addEventListener('input', ()=>{
				by('priceValue').textContent = by('priceRange').value;
				applyShopFilters();
			});
		}
		if(by('filterType')) by('filterType').addEventListener('change', applyShopFilters);
		if(by('searchShop')) by('searchShop').addEventListener('input', debounce(applyShopFilters,200));
		renderList(PRODUCTS);
	}

	// Product page render
	const productRoot = document.getElementById('productRoot'); if(productRoot){ const params = new URLSearchParams(location.search); const id = params.get('id'); const p = getProductById(id); if(!p){ productRoot.innerHTML = '<div class="muted">Product not found</div>'; } else { productRoot.innerHTML = `<div class="image"><img src="${p.img}" alt="${p.title}"/></div><div><h1>${p.title}</h1><div class="muted">${p.category} • ${p.size}</div><h2 class="price">${formatMoney(p.price)}</h2><p>${p.description}</p><div style="margin-top:12px"><button class="btn btn-primary" onclick="addToCart('${p.id}')">Add to cart</button><a class="btn btn-ghost" href="shop.html">Back to shop</a></div></div>`; } }

	// Cart rendering for different areas
	function renderCartAreas(){ ['Root','Shop','Prod','About','Contact'].forEach(suffix=>{ const itemsRoot = by('cartItems' + (suffix==='Root'?'Root':suffix)); if(!itemsRoot) return; itemsRoot.innerHTML=''; const ids = Object.keys(state.cart); if(!ids.length){ itemsRoot.innerHTML = '<div style="padding:18px;color:var(--muted)">Your cart is empty.</div>'; const totalEl = by('cartTotal' + (suffix==='Root'?'Root':suffix)); if(totalEl) totalEl.textContent = formatMoney(0); return } let total=0; ids.forEach(id=>{ const item = state.cart[id]; const p = getProductById(id); const div = document.createElement('div'); div.className='cart-item'; div.innerHTML = `<div style="width:64px;height:64px;border-radius:8px;overflow:hidden"><img src="${p.img}" style="width:100%;height:100%;object-fit:cover"></div><div style="flex:1"><div style="font-weight:700">${p.title}</div><div class="muted">${p.size} • ${formatMoney(p.price)}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end"><div style="display:flex;gap:6px;align-items:center"><button class="btn btn-ghost" onclick="changeQty('${id}',-1)">-</button><div>${item.qty}</div><button class="btn btn-ghost" onclick="changeQty('${id}',1)">+</button></div><button class="btn" style="background:#f8d7da;color:#842029;margin-top:8px" onclick="removeFromCart('${id}')">Remove</button></div>`; itemsRoot.appendChild(div); total += p.price * item.qty; }); const totalEl = by('cartTotal' + (suffix==='Root'?'Root':suffix)); if(totalEl) totalEl.textContent = formatMoney(total); }); }

	// connect cart buttons
	document.addEventListener('click',(e)=>{
		if(e.target.matches('#cartBtnTop') || e.target.matches('#cartBtnShop') || e.target.matches('#cartBtnProd') || e.target.matches('#cartBtnAbout') || e.target.matches('#cartBtnContact')){
			const slide = document.getElementById('cartSlide') || document.getElementById('cartSlideShop') || document.getElementById('cartSlideProd'); if(slide) { slide.classList.toggle('open'); renderCartAreas(); }
		}
	});

	// Checkout handlers
	['Root','Shop','Prod'].forEach(suffix=>{ const checkout = by('checkout' + (suffix==='Root'?'Root':suffix)); if(checkout) checkout.addEventListener('click', ()=>{ const ids = Object.keys(state.cart); if(!ids.length){ alert('Cart is empty'); return } let total=0; let lines=''; ids.forEach(id=>{ const p = getProductById(id); const qty = state.cart[id].qty; lines += `${p.title} x${qty} (${formatMoney(p.price)})\n`; total += p.price * qty; }); alert(`Order Summary:\n\n${lines}\nTotal: ${formatMoney(total)}\n\nWe will contact you to confirm delivery and payment.`); state.cart = {}; save(); renderCartAreas(); updateBadges(); }); const clearBtn = by('clearCart' + (suffix==='Root'?'Root':suffix)); if(clearBtn) clearBtn.addEventListener('click', ()=>{ if(confirm('Clear cart?')){ state.cart = {}; save(); renderCartAreas(); updateBadges(); } }); });

	// Contact form (simple client-side)
	const contactForm = by('contactForm'); if(contactForm){ contactForm.addEventListener('submit',(e)=>{ e.preventDefault(); alert('Message sent (mock). We will contact you.'); contactForm.reset(); }); }


	// Global search redirect (Home)
	const globalSearch = by('globalSearch');
	if(globalSearch){
		globalSearch.addEventListener('keydown', (e) => {
			if(e.key === 'Enter'){
				const q = globalSearch.value.trim();
				if(q) location.href = 'shop.html?search=' + encodeURIComponent(q);
			}
		});
	}

	// About page search
	const aboutSearch = by('searchAbout');
	if(aboutSearch){
		aboutSearch.addEventListener('keydown', (e) => {
			if(e.key === 'Enter'){
				const q = aboutSearch.value.trim();
				if(q) location.href = 'shop.html?search=' + encodeURIComponent(q);
			}
		});
	}

	// Contact page search
	const contactSearch = by('searchContact');
	if(contactSearch){
		contactSearch.addEventListener('keydown', (e) => {
			if(e.key === 'Enter'){
				const q = contactSearch.value.trim();
				if(q) location.href = 'shop.html?search=' + encodeURIComponent(q);
			}
		});
	}

	// Preset search param handling on shop page
	if(location.pathname.endsWith('shop.html')){
		const params = new URLSearchParams(location.search); const q = params.get('search'); if(q && by('searchShop')){ by('searchShop').value = q; const ev = new Event('input'); by('searchShop').dispatchEvent(ev); }
	}

	// small utilities
	function debounce(fn,ms){ let t; return (...a)=>{ clearTimeout(t);t=setTimeout(()=>fn(...a), ms); }; }

	// init
	document.getElementById('year1') && (document.getElementById('year1').textContent = (new Date()).getFullYear()); ['year2','year3','year4','year5'].forEach(id=>{ if(by(id)) by(id).textContent = (new Date()).getFullYear(); }); updateBadges(); renderCartAreas();
})();
