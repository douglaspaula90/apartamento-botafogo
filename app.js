const data = await fetch("site-data.json").then((response) => response.json());

const message = encodeURIComponent(
  "Olá, vi a placa do apartamento em Botafogo e queria receber mais informações."
);
const whatsappUrl = `https://wa.me/${data.whatsapp}?text=${message}`;

document.title = data.title;
document.getElementById("area").textContent = data.area;
document.getElementById("price").textContent = data.price;
document.getElementById("condo").textContent = data.condo;
document.getElementById("panelPrice").textContent = data.price;
document.getElementById("panelCondo").textContent = data.condo;
document.getElementById("saleMode").textContent = data.saleMode;
document.getElementById("iptu").textContent = data.iptu;
document.getElementById("whatsappHero").href = whatsappUrl;
document.getElementById("whatsappContact").href = whatsappUrl;
document.getElementById("driveLink").href = data.driveUrl;

const heroMedia = document.getElementById("heroMedia");
if (!data.photos.length) {
  heroMedia.classList.add("empty");
} else {
  heroMedia.style.backgroundImage = `linear-gradient(180deg, rgba(11, 24, 28, 0.05), rgba(11, 24, 28, 0.78)), url("${data.heroImage || data.photos[0].src}")`;
}

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

function addPhoto(target, photo, options = {}) {
  const figure = document.createElement("button");
  figure.className = `photo ${options.featured ? "featured" : ""} ${options.project ? "project-photo" : ""} ${options.real ? "real-photo" : ""}`;
  figure.type = "button";
  figure.addEventListener("click", () => {
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt || "Foto do apartamento";
    lightboxCaption.textContent = photo.alt || "";
    lightbox.showModal();
  });

  const img = document.createElement("img");
  img.src = photo.src;
  img.alt = photo.alt || "Foto do apartamento";
  img.loading = "lazy";
  figure.append(img);

  if (options.project || options.real) {
    const badge = document.createElement("span");
    badge.className = "photo-badge";
    badge.textContent = options.project ? "Projeto" : "Foto real";
    figure.append(badge);
  }

  target.append(figure);
}

if (data.photos.length) {
  const projectsByOriginal = new Map(
    data.projectPhotos
      .filter((photo) => photo.original)
      .map((photo) => [photo.original, photo])
  );

  data.photos.forEach((photo, index) => {
    addPhoto(gallery, photo, { featured: index === 0, real: true });
    const project = projectsByOriginal.get(photo.src);
    if (project) {
      addPhoto(gallery, project, { project: true });
    }
  });
} else {
  for (const label of ["Sala e varandão", "Quartos", "Cozinha e área de serviço"]) {
    const placeholder = document.createElement("div");
    placeholder.className = "photo placeholder";
    placeholder.textContent = `${label} · fotos recentes em breve`;
    gallery.append(placeholder);
  }
}

const highlights = document.getElementById("highlights");
for (const item of data.highlights) {
  const li = document.createElement("li");
  li.textContent = item;
  highlights.append(li);
}

const building = document.getElementById("building");
if (building) {
  for (const item of data.building) {
    const li = document.createElement("li");
    li.textContent = item;
    building.append(li);
  }
}

const buildingCards = document.getElementById("buildingCards");
for (const item of data.buildingCards) {
  const article = document.createElement("article");
  article.className = "building-card";
  const title = document.createElement("h3");
  title.textContent = item.title;
  const description = document.createElement("p");
  description.textContent = item.description;
  article.append(title, description);
  buildingCards.append(article);
}

const locationList = document.getElementById("locationList");
for (const item of data.location) {
  const li = document.createElement("li");
  li.textContent = item;
  locationList.append(li);
}

const notes = document.getElementById("notes");
for (const item of data.notes) {
  const p = document.createElement("p");
  p.textContent = item;
  notes.append(p);
}

document.getElementById("visitSummary").textContent = data.visits.summary;
document.getElementById("visitNote").textContent = data.visits.note;
const visitHours = document.getElementById("visitHours");
for (const item of data.visits.hours) {
  const li = document.createElement("li");
  li.textContent = item;
  visitHours.append(li);
}

document.getElementById("lightboxClose").addEventListener("click", () => {
  lightbox.close();
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});
