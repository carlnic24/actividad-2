// Función 1: Traducir contenido entre español e inglés
let idiomaActual = 'es'; // Idioma por defecto: español

function traducir() {
  if (idiomaActual === 'es') {
    // Traducir a inglés
    document.querySelector('h1').textContent = '🐾 Cat Café ☕';
    document.querySelectorAll('h2')[0].textContent = 'What is a Cat Café?';
    document.querySelectorAll('p')[0].textContent = 'A cat café is a magical place where you can enjoy your favorite drink while sharing space with adorable felines. It is an experience that combines the warmth of a café with the relaxing company of cats.';
    document.querySelectorAll('p')[1].textContent = 'To function, a cat café needs friendly cats that like people, comfortable space for the kitties, and trained staff to take care of their well-being.';
    
    document.querySelectorAll('h2')[1].textContent = 'Types of Feline Residents';
    document.querySelectorAll('h3')[0].textContent = 'Social Cats';
    document.querySelectorAll('p')[2].textContent = 'They are the ones who seek attention and purr on your lap while you enjoy your cappuccino.';
    
    document.querySelectorAll('h3')[1].textContent = 'Observer Cats';
    document.querySelectorAll('p')[3].textContent = 'They prefer to watch from above, observing visitors with calm curiosity.';
    
    document.querySelectorAll('h3')[2].textContent = 'Playful Cats';
    document.querySelectorAll('p')[4].textContent = 'Always ready for a play session with feathers or toy mice.';
    
    document.querySelectorAll('h3')[3].textContent = 'Dreamer Cats';
    document.querySelectorAll('p')[5].textContent = 'Experts in naps, they teach you the art of relaxation while sleeping in their favorite beds.';
    
    document.querySelectorAll('h2')[2].textContent = 'What are they for?';
    document.querySelectorAll('p')[6].textContent = 'Cat cafés offer multiple benefits: they reduce stress, combat loneliness, promote responsible adoption, and create a community space for cat lovers. Many visitors find peace and joy in feline company.';
    
    document.querySelectorAll('h2')[3].textContent = 'Brief History';
    document.querySelectorAll('p')[7].textContent = 'The first cat café opens in Taiwan, starting a worldwide trend.';
    document.querySelectorAll('p')[8].textContent = 'Japan adopts the concept with "Neko Cafe" (猫カフェ), becoming immensely popular in Tokyo.';
    document.querySelectorAll('p')[9].textContent = 'Cat cafés arrive in Europe and America, expanding rapidly.';
    document.querySelectorAll('p')[10].textContent = 'There are hundreds of cat cafés around the world, many focused on adoption and rescue.';
    
    document.querySelectorAll('h4')[2].textContent = 'Come visit us and meet our feline friends!';
    
    idiomaActual = 'en';
  } else {
    // Traducir a español
    document.querySelector('h1').textContent = '🐾 Café de Gatos ☕';
    document.querySelectorAll('h2')[0].textContent = '¿Qué es un Café de Gatos?';
    document.querySelectorAll('p')[0].textContent = 'Un café de gatos es un lugar mágico donde puedes disfrutar de tu bebida favorita mientras compartes espacio con adorables felinos. Es una experiencia que combina la calidez de un café con la compañía relajante de los gatos.';
    document.querySelectorAll('p')[1].textContent = 'Para funcionar, un café de gatos necesita gatos amigables que les guste la gente, espacio cómodo para los mininos, y personal capacitado que cuide su bienestar.';
    
    document.querySelectorAll('h2')[1].textContent = 'Tipos de Residentes Felinos';
    document.querySelectorAll('h3')[0].textContent = 'Gatos Sociables';
    document.querySelectorAll('p')[2].textContent = 'Son los que buscan atención y ronronean en tu regazo mientras disfrutas tu cappuccino.';
    
    document.querySelectorAll('h3')[1].textContent = 'Gatos Observadores';
    document.querySelectorAll('p')[3].textContent = 'Prefieren vigilar desde las alturas, observando a los visitantes con curiosidad tranquila.';
    
    document.querySelectorAll('h3')[2].textContent = 'Gatos Juguetones';
    document.querySelectorAll('p')[4].textContent = 'Siempre listos para una sesión de juego con plumas o ratoncitos de juguete.';
    
    document.querySelectorAll('h3')[3].textContent = 'Gatos Soñadores';
    document.querySelectorAll('p')[5].textContent = 'Expertos en siestas, te enseñan el arte de la relajación mientras duermen en sus camas favoritas.';
    
    document.querySelectorAll('h2')[2].textContent = '¿Para qué sirven?';
    document.querySelectorAll('p')[6].textContent = 'Los cafés de gatos ofrecen múltiples beneficios: reducen el estrés, combaten la soledad, promueven la adopción responsable, y crean un espacio de comunidad para amantes de los gatos. Muchos visitantes encuentran paz y alegría en la compañía felina.';
    
    document.querySelectorAll('h2')[3].textContent = 'Historia Breve';
    document.querySelectorAll('p')[7].textContent = 'Se abre el primer café de gatos en Taiwán, comenzando una tendencia mundial.';
    document.querySelectorAll('p')[8].textContent = 'Japón adopta el concepto con "Neko Cafe" (猫カフェ), volviéndose inmensamente populares en Tokio.';
    document.querySelectorAll('p')[9].textContent = 'Los cafés de gatos llegan a Europa y América, expandiéndose rápidamente.';
    document.querySelectorAll('p')[10].textContent = 'Existen cientos de cafés de gatos en todo el mundo, muchos enfocados en adopción y rescate.';
    
    document.querySelectorAll('h4')[2].textContent = '¡Ven a visitarnos y conoce a nuestros amigos felinos!';
    
    idiomaActual = 'es';
  }
}

// Función 2: Cambiar colores del tema
let temaActual = 'claro'; // Tema por defecto

function cambiarColor() {
  if (temaActual === 'claro') {
    // Cambiar a tema oscuro
    document.body.style.backgroundColor = '#2c1810';
    document.body.style.color = '#f5e6d3';
    
    document.querySelectorAll('h1, h2, h3, h4').forEach(elemento => {
      elemento.style.color = '#d4a574';
    });
    
    temaActual = 'oscuro';
  } else {
    // Volver a tema claro
    document.body.style.backgroundColor = '#f5e6d3';
    document.body.style.color = '#5d4037';
    
    document.querySelector('h1').style.color = '#8d6e63';
    document.querySelectorAll('h2').forEach(elemento => {
      elemento.style.color = '#6d4c41';
    });
    document.querySelectorAll('h3').forEach(elemento => {
      elemento.style.color = '#795548';
    });
    document.querySelectorAll('h4').forEach(elemento => {
      elemento.style.color = '#8d6e63';
    });
    
    temaActual = 'claro';
  }
}