// Reveal ao rolar
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Avião subindo no fundo do hero (setInterval: o rAF não roda no headless do mockup)
const hero = document.querySelector('.hero');
const curve = document.getElementById('curve');
const area = document.getElementById('area');
const plane = document.getElementById('plane');
const multEl = document.getElementById('mult');
const W = 1440, H = 760;

function flight() {
  let t = 0;
  plane.style.opacity = 1;
  const id = setInterval(() => {
    t += 0.008;
    const p = Math.min(1, t);
    const x = p * W * 0.92;
    const y = H - 40 - Math.pow(p, 1.7) * (H - 140);
    const cx = x * 0.55;
    curve.setAttribute('d', `M0 ${H - 40} Q${cx} ${H - 40} ${x} ${y}`);
    area.setAttribute('d', `M0 ${H - 40} Q${cx} ${H - 40} ${x} ${y} Z`);
    const r = hero.getBoundingClientRect();
    plane.style.transform = `translate(${(x / W) * r.width - 20}px, ${(y / H) * r.height - 30}px) rotate(-${10 + p * 18}deg)`;
    multEl.textContent = (1 + Math.pow(p, 1.6) * 9).toFixed(2) + 'x';
    if (p >= 1) {
      clearInterval(id);
      plane.style.opacity = 0;
      setTimeout(flight, 900);
    }
  }, 40);
}
flight();

// Faixa de temas
const tape = document.getElementById('tape');
const words = ['Gestão de banca', 'Disciplina', 'Análise ao vivo', 'Cabeça fria', 'Comunidade', 'Grupo gratuito'];
[...words, ...words, ...words, ...words].forEach((w) => {
  const s = document.createElement('span');
  s.textContent = w;
  tape.appendChild(s);
});

// Conversa do grupo no celular
const chat = document.getElementById('chat');
const msgs = [
  ['Felp', 'Bom dia, galera! Antes de tudo: qual o limite de hoje? 🎯'],
  ['me', 'Separei R$ 50, nem um real a mais'],
  ['Felp', 'Perfeito. Bateu o limite ou a meta, fecha o app ✋'],
  ['Felp', 'Análise da rodada no ar 👇 lembrando: ninguém prevê o próximo voo'],
  ['me', 'Valeu, Felp! Primeiro grupo que fala a real'],
  ['Felp', 'Aula nova sobre gestão de banca hoje à noite 📚'],
];
let mi = 0;
function addMsg() {
  const [who, text] = msgs[mi % msgs.length];
  const el = document.createElement('div');
  el.className = 'msg' + (who === 'me' ? ' me' : '');
  el.innerHTML = (who === 'me' ? '' : '<small>Felp Rocha</small>') + text;
  chat.appendChild(el);
  if (chat.children.length > 6) chat.firstChild.remove();
  mi++;
}
for (let i = 0; i < 3; i++) addMsg();
setInterval(addMsg, 2200);

// Botão fixo no celular
const sticky = document.querySelector('.sticky');
const heroCta = document.querySelector('.hero .cta');
new IntersectionObserver(([e]) => sticky.classList.toggle('on', !e.isIntersecting)).observe(heroCta);

// Divide os visitantes entre os dois grupos (cada pessoa fica sempre no mesmo)
const GROUPS = [
  'https://chat.whatsapp.com/DSRVK6YR1d1JGJ5Ll5oOuV?s=cl&p=a&mlu=4&ilr=4&iam=2',
  'https://chat.whatsapp.com/HYIpHOcAu11JVT5uU76slZ?s=cl&p=a&mlu=4&ilr=4&iam=2',
];
let gi = null;
try { gi = localStorage.getItem('felpGroup'); } catch (e) {}
if (gi === null || !GROUPS[gi]) {
  gi = Math.floor(Math.random() * GROUPS.length);
  try { localStorage.setItem('felpGroup', gi); } catch (e) {}
}
document.querySelectorAll('.js-group').forEach((a) => { a.href = GROUPS[gi]; });

// Evento Lead do Meta Pixel ao clicar para o grupo
document.querySelectorAll('.js-group').forEach((a) => a.addEventListener('click', () => {
  if (typeof fbq === 'function') fbq('track', 'Lead');
}));
