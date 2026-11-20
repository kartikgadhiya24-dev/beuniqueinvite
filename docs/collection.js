const designs = [
  {
    "title": "The Royal Scroll",
    "plan": "Premium",
    "url": "create.html?t=scroll",
    "art": "royal-scroll.webp",
    "description": "An illustrated couple unrolls your crimson silk invitation."
  },
  {
    "title": "Shaadi Ka Ghar",
    "plan": "Premium",
    "url": "https://invitemaker.in/template/im275-animated-story-wedding-invitation",
    "art": "haveli-art/gate.webp",
    "description": "Open the original IM275 video and personalise the couple’s names on InviteMaker."
  },
  {
    "title": "The Rickshaw Wedding",
    "plan": "Premium",
    "url": "rickshaw.html",
    "art": "rickshaw.webp",
    "description": "Scroll with the painted rickshaw to unfold the invitation and discover each celebration."
  },
  {
    "title": "The Palace Baraat",
    "plan": "Premium",
    "url": "baraat.html",
    "art": "baraat.webp",
    "description": "Follow a flower-decked carriage into the palace courtyard and an evening mandap."
  },
  {
    "title": "The Olive Note",
    "plan": "Classic",
    "url": "create.html?edit=1&t=classic",
    "art": "",
    "description": "A botanical stationery card."
  }
];
const grid = document.querySelector('#grid');
const filters = document.querySelectorAll('[data-filter]');
function display(filter) {
  grid.replaceChildren();
  for (const design of designs) {
    if (filter !== 'all' && design.plan !== filter) continue;
    const link = document.createElement('a');
    link.className = 'tile';
    link.href = design.url;
    link.innerHTML = '<div class="art"></div><small></small><h3></h3><p></p>';
    const art = link.querySelector('.art');
    if (design.art) {
      art.style.backgroundImage = 'url(' + design.art + ')';
      art.innerHTML = '<b class="play" aria-hidden="true">▶</b>';
    } else {
      art.classList.add('classicart');
      art.innerHTML = '<span>Olive<br>Note</span>';
    }
    link.querySelector('small').textContent = design.plan + ' edition';
    link.querySelector('h3').textContent = design.title;
    link.querySelector('p').textContent = design.description;
    grid.append(link);
  }
  for (const button of filters) button.setAttribute('aria-pressed', button.dataset.filter === filter);
}
for (const button of filters) button.onclick = () => display(button.dataset.filter);
display('all');
