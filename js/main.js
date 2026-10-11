(() => {
 const $ = s => document.querySelector(s);
 const escapeHTML = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const icons = {"افغانستان":"🏔️","جهان":"🌍","فناوری":"💻","اقتصاد":"📈","ورزش":"⚽","آموزش":"📚","دانستنی‌ها":"💡"};
 const posts = () => {
   let local=[]; try { local=JSON.parse(localStorage.getItem("kapisaDraftPosts")||"[]"); } catch {}
   return [...local,...(window.KAPISA_ARTICLES||[])];
 };
 const params = new URLSearchParams(location.search);
 const categoryPage = location.pathname.endsWith("category.html");
 const articlePage = location.pathname.endsWith("article.html");
 const searchPage = location.pathname.endsWith("search.html");
 const chosenCategory = params.get("name") || "";
 const chosenId = params.get("id") || "";
 function card(p) {
   const img = p.image ? `<img class="article-image" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}" loading="lazy">` : `<div class="image-placeholder" role="img" aria-label="تصویر نمونه">${icons[p.category]||"📰"}</div>`;
   return `<article class="article-card">${img}<div class="article-card-body"><span class="tag">${escapeHTML(p.category)}</span><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.excerpt)}</p><div class="article-meta">${escapeHTML(p.date||"")}</div><a class="read-more" href="${articlePage?"article.html":"pages/article.html"}?id=${encodeURIComponent(p.id)}">خواندن مقاله ←</a></div></article>`;
 }
 function renderList() {
   const grid=$("#articleGrid") || $("#categoryArticles") || $("#searchResults");
   if(!grid) return;
   let list=posts();
   if(categoryPage && chosenCategory) list=list.filter(p=>p.category===chosenCategory);
   if(searchPage) {const q=(params.get("q")||"").trim().toLowerCase();list=list.filter(p=>(p.title+" "+p.excerpt+" "+p.category).toLowerCase().includes(q));}
   if($("#resultsTitle")) $("#resultsTitle").textContent=categoryPage?`مطالب دسته ${chosenCategory}`:searchPage?"نتیجه جست‌وجو":"آخرین مطالب";
   if($("#resultCount")) $("#resultCount").textContent=`${list.length} مطلب`;
   grid.innerHTML=list.length?list.map(card).join(""):'<div class="empty-state">مطلبی پیدا نشد. دسته‌بندی یا عبارت جست‌وجو را تغییر بده.</div>';
 }
 function renderArticle() {
   const target=$("#articleContent"); if(!target)return;
   const p=posts().find(x=>x.id===chosenId);
   if(!p){target.innerHTML='<div class="notice">این مقاله پیدا نشد. ممکن است نمونه یا داده مرورگر در دسترس نباشد.</div>';return;}
   target.innerHTML=`<span class="tag">${escapeHTML(p.category)}</span><h1>${escapeHTML(p.title)}</h1><div class="article-meta">${escapeHTML(p.date||"")} · کاپیسا بلاگ</div>${p.image?`<img class="content-hero" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.title)}">`:''}<p class="article-body">${escapeHTML(p.body)}</p><p class="muted">یادآوری: پیش از انتشار عمومی خبر، منبع و تاریخ را بررسی کنید.</p>`;
 }
 const form=$("#searchForm");
 if(form) form.addEventListener("submit",e=>{e.preventDefault();const q=$("#searchInput").value.trim();location.href=`pages/search.html?q=${encodeURIComponent(q)}`;});
 const toggle=$("#menuToggle"); if(toggle) toggle.addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
 if($("#year")) $("#year").textContent=new Date().getFullYear();
 renderList();renderArticle();
})();