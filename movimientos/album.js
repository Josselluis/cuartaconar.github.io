// ===== ALBUM INDEPENDIENTE - SIN CONEXION A FAMILIA.HTML =====
const galeria = document.getElementById('galeriaAlbum');
const inputFotos = document.getElementById('inputFotos');
const btnLimpiar = document.getElementById('btnLimpiar');
const estrellasCont = document.getElementById('estrellasAlbum');

// Estrellas fijas
for(let i=0;i<60;i++){
  let s=document.createElement('span');
  s.style.left=Math.random()*100+'%';
  s.style.top=Math.random()*100+'%';
  s.style.animationDelay=Math.random()*3+'s';
  estrellasCont.appendChild(s);
}

// Cargar fotos guardadas
let fotosGuardadas = JSON.parse(localStorage.getItem('albumFotos') || '[]');
function guardarFotos(){ localStorage.setItem('albumFotos', JSON.stringify(fotosGuardadas)); }

function mostrarFotos(){
  galeria.innerHTML = '';
  if(fotosGuardadas.length===0){
    galeria.innerHTML = '<div class="vacio-album">No hay fotos aún. Dale a AGREGAR IMÁGENES 📸</div>';
    return;
  }
  fotosGuardadas.forEach((src, index)=>{
    const div = document.createElement('div');
    div.className = 'foto-album';
    div.innerHTML = `<img src="${src}"><button class="btn-borrar-foto" data-index="${index}">✕</button>`;
    galeria.appendChild(div);
  });
}
mostrarFotos();

// Agregar fotos
inputFotos.addEventListener('change', function(e){
  const archivos = Array.from(e.target.files);
  if(archivos.length===0) return;
  archivos.forEach(file=>{
    const reader = new FileReader();
    reader.onload = function(ev){
      fotosGuardadas.push(ev.target.result);
      guardarFotos();
      mostrarFotos();
    };
    reader.readAsDataURL(file);
  });
  e.target.value='';
});

// Borrar una foto
galeria.addEventListener('click', function(e){
  if(e.target.classList.contains('btn-borrar-foto')){
    const idx = e.target.dataset.index;
    fotosGuardadas.splice(idx,1);
    guardarFotos();
    mostrarFotos();
  }
});

// Borrar todo
btnLimpiar.addEventListener('click', function(){
  if(confirm('¿Borrar todas las fotos del álbum?')){
    fotosGuardadas=[];
    guardarFotos();
    mostrarFotos();
  }
});

// Modal
const modal = document.getElementById('modalAlbum');
const fotoGrande = document.getElementById('fotoGrandeAlbum');
galeria.addEventListener('click', function(e){
  const foto = e.target.closest('.foto-album');
  if(!foto || e.target.classList.contains('btn-borrar-foto')) return;
  const img = foto.querySelector('img');
  if(img){ fotoGrande.innerHTML=`<img src="${img.src}">`; modal.classList.add('activo'); }
});
modal.querySelector('.modal-cerrar').addEventListener('click', ()=>modal.classList.remove('activo'));
modal.querySelector('.modal-fondo').addEventListener('click', ()=>modal.classList.remove('activo'));

// === INTERACCION ESTRELLITAS (LUZ + ESTRELLITAS MOUSE) ===
const luz = document.createElement('div'); luz.className='luz-seguidora'; document.body.appendChild(luz);
const contEstrellas = document.createElement('div'); contEstrellas.className='contenedor-estrellitas'; document.body.appendChild(contEstrellas);
let mouseX=window.innerWidth/2, mouseY=window.innerHeight/2, luzX=mouseX, luzY=mouseY;
function crearEstrellita(x,y){
  const el=document.createElement('div'); el.className='estrellita-mouse';
  el.style.left=x+'px'; el.style.top=y+'px';
  el.style.setProperty('--tx',(Math.random()-0.5)*160+'px');
  el.style.setProperty('--ty',(Math.random()-0.5)*160+'px');
  contEstrellas.appendChild(el);
  setTimeout(()=>el.remove(),1400);
}
document.addEventListener('mousemove', e=>{ mouseX=e.clientX; mouseY=e.clientY; crearEstrellita(mouseX,mouseY); });
(function anim(){ luzX+=(mouseX-luzX)*0.1; luzY+=(mouseY-luzY)*0.1; luz.style.left=luzX+'px'; luz.style.top=luzY+'px'; requestAnimationFrame(anim); })();
