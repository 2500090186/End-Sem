const videos = [
  {id:1,title:"Good Vibes",mood:"happy",emoji:"🎵",duration:"08:42",desc:"Feel-good music and positive vibes.",category:"Music"},
  {id:2,title:"Weekend Fun",mood:"happy",emoji:"🎉",duration:"12:18",desc:"Light entertainment for a happy mood.",category:"Entertainment"},
  {id:3,title:"Basketball Highlights",mood:"energetic",emoji:"🏀",duration:"10:25",desc:"Fast-paced sports highlights and action.",category:"Sports"},
  {id:4,title:"Mountain Adventure",mood:"energetic",emoji:"🏔️",duration:"14:36",desc:"An exciting journey through the mountains.",category:"Adventure"},
  {id:5,title:"Ocean Sounds",mood:"relaxed",emoji:"🌊",duration:"20:10",desc:"Calm ocean scenes for relaxation.",category:"Nature"},
  {id:6,title:"Peaceful Forest",mood:"relaxed",emoji:"🌿",duration:"16:05",desc:"Relax with peaceful forest visuals.",category:"Nature"},
  {id:7,title:"Romantic Evening",mood:"romantic",emoji:"🌹",duration:"11:44",desc:"A warm and romantic evening story.",category:"Romance"},
  {id:8,title:"Love & Coffee",mood:"romantic",emoji:"☕",duration:"09:32",desc:"A short feel-good romantic story.",category:"Romance"},
  {id:9,title:"Mystery Night",mood:"thriller",emoji:"🕵️",duration:"13:50",desc:"A mysterious story full of surprises.",category:"Thriller"},
  {id:10,title:"Dark Escape",mood:"thriller",emoji:"🌙",duration:"15:22",desc:"An intense escape adventure.",category:"Thriller"}
];

let currentMood = "all";
let favorites = JSON.parse(localStorage.getItem("streamifyFavorites") || "[]");

function renderVideos(list = videos) {
  const grid = document.getElementById("videoGrid");
  const empty = document.getElementById("emptyState");
  grid.innerHTML = "";
  empty.classList.toggle("hidden", list.length !== 0);

  list.forEach(v => {
    const saved = favorites.includes(v.id);
    grid.innerHTML += `
      <article class="card">
        <div class="thumb">${v.emoji}<span class="duration">${v.duration}</span></div>
        <div class="card-body">
          <h3>${v.title}</h3>
          <p class="meta">${v.category} • ${capitalize(v.mood)}</p>
          <div class="actions">
            <button class="watch" onclick="openPlayer(${v.id})">▶ Watch Now</button>
            <button class="like ${saved ? "saved":""}" onclick="toggleFavorite(${v.id})">${saved ? "❤️":"♡"}</button>
          </div>
        </div>
      </article>`;
  });
  document.getElementById("favCount").textContent = favorites.length;
}

function filterMood(mood) {
  currentMood = mood;
  document.querySelectorAll(".mood").forEach(b => b.classList.toggle("active", b.dataset.mood === mood));
  const search = document.getElementById("searchInput").value.toLowerCase();
  applyFilters(search);
  document.getElementById("sectionTitle").textContent = mood === "all" ? "Trending for you" : `${capitalize(mood)} picks`;
}

function searchVideos() {
  applyFilters(document.getElementById("searchInput").value.toLowerCase());
}

function applyFilters(search) {
  let result = videos.filter(v => currentMood === "all" || v.mood === currentMood);
  if (search) result = result.filter(v => `${v.title} ${v.category} ${v.mood}`.toLowerCase().includes(search));
  renderVideos(result);
  document.getElementById("resultText").textContent = `${result.length} video${result.length === 1 ? "" : "s"} found`;
}

function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites, id];
  localStorage.setItem("streamifyFavorites", JSON.stringify(favorites));
  applyFilters(document.getElementById("searchInput").value.toLowerCase());
}

function showFavorites() {
  currentMood = "all";
  document.querySelectorAll(".mood").forEach(b => b.classList.toggle("active", b.dataset.mood === "all"));
  const list = videos.filter(v => favorites.includes(v.id));
  document.getElementById("sectionTitle").textContent = "❤️ Your Favorites";
  document.getElementById("resultText").textContent = `${list.length} saved video${list.length === 1 ? "" : "s"}`;
  renderVideos(list);
  document.getElementById("videos").scrollIntoView({behavior:"smooth"});
}

function openPlayer(id) {
  const v = videos.find(x => x.id === id);
  document.getElementById("playerTitle").textContent = v.title;
  document.getElementById("playerDescription").textContent = v.desc;
  document.getElementById("playerArea").innerHTML = `<div class="fake-player">${v.emoji}<span style="font-size:20px;margin-left:15px">▶ Playing demo</span></div>`;
  document.getElementById("playerModal").classList.remove("hidden");
}

function closePlayer() {
  document.getElementById("playerModal").classList.add("hidden");
}

document.getElementById("playerModal").addEventListener("click", e => {
  if (e.target.id === "playerModal") closePlayer();
});

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

renderVideos();
