
function firstSlideInit() {
  const BTN = document.querySelector('.firstSlideBTN');
  const firstSlide = document.querySelector('.firstSlide');
  const secondSlide = document.querySelector('.secondSlide')

  BTN.addEventListener('click', nextSlide);

  function nextSlide(e) {
    const target = e.target;

    const isBtn = target.tagName = 'BUTTON';
    if (isBtn) {
      firstSlide.style.display = 'none';
      secondSlide.style.display = 'flex';
    }
  }
}
firstSlideInit()


function secondSlideInit() {
  const secondSlide = document.querySelector('.secondSlide');
  const secondSlideBTN = document.querySelector('.secondSlideBTN');
  const inputName = document.getElementById('secondSlideInputName');
  const errorMessage = document.querySelector('.secondSlideError');
  const nextSlideCharacter = document.querySelector('.characterSelection_box');
  secondSlideBTN.addEventListener('click', nextSlide);

  function nextSlide() {
    if (inputName.value === '') {
      errorMessage.classList.remove('hide')
      errorMessage.classList.add('active')
    }

    if (inputName.value !== '') {
      secondSlide.style.display = 'none';
      nextSlideCharacter.style.display = 'block';
    }
  }

  inputName.addEventListener('input', function () {
    if (inputName.value !== '') {
      errorMessage.classList.add('hideError');
      errorMessage.classList.remove('activeError');
    }
  });
}
secondSlideInit()


function characterSelectionInit() {
  const userNameInput = document.querySelector('.userName');
  const boy = document.querySelector("#boy");
  const girl = document.querySelector("#girl");
  const nextSlideBtn = document.querySelector('.characterSlideBTN');
  const characterSelection = document.querySelector('.characterSelection_box');
  const instructionsSection = document.querySelector('.instructionsSection_box');
  const characterSlideError = document.querySelector('.characterSlideError');
  const bubble = document.getElementById("playerPhrase");

  let selectedCharacter = localStorage.getItem('selectedCharacter');

  // Показать фразу
  function showPhrase(text) {
    bubble.textContent = text;
    bubble.classList.remove("hidden");
  }

  // Применить визуальное состояние по выбранному персонажу
  function applyCharacter(character) {
    if (character === 'boy') {
      boy.classList.add('characterImgBoy');
      girl.classList.remove('characterImgGirl');
      showPhrase(`${userNameInput.value}, я готов кодить хоть на картошке! Главное — дедлайны не жмут.`);
    } else if (character === 'girl') {
      girl.classList.add('characterImgGirl');
      boy.classList.remove('characterImgBoy');
      showPhrase(`${userNameInput.value}, у меня в голове порядок, в коде — красота. Погнали!`);
    }
  }

  // Сохранить выбор в localStorage и применить визуально
  function selectCharacter(character) {
    selectedCharacter = character;
    localStorage.setItem('selectedCharacter', character);
    applyCharacter(character);
  }

  // Навешиваем события на выбор персонажа
  boy.addEventListener("click", () => selectCharacter('boy'));
  girl.addEventListener("click", () => selectCharacter('girl'));

  // Переход на следующий слайд
  nextSlideBtn.addEventListener('click', () => {
    if (selectedCharacter) {
      characterSelection.style.display = 'none';
      instructionsSection.style.display = 'block';
    } else {
      characterSlideError.classList.remove('hide');
      characterSlideError.classList.add('active');
    }
  });

  // При загрузке страницы применить сохранённый выбор
  if (selectedCharacter) {
    applyCharacter(selectedCharacter);
  }

  console.log("Выбран персонаж:", selectedCharacter);

}
characterSelectionInit();










function initPlayerHUD() {
  let gameData;
  let player;

  fetch('stage.json')
    .then(response => response.json())
    .then(data => {
      gameData = data;

      const savedCharacter = localStorage.getItem('selectedCharacter');
      const savedName = localStorage.getItem('playerName');

      // Берём дефолтные данные игрока
      player = { ...data.player };

      // Подставляем сохранённые значения
      if (savedCharacter) {
        player.character = savedCharacter;
      }
      if (savedName) {
        player.name = savedName;
      }

      // Сохраняем обновлённого игрока в localStorage
      localStorage.setItem('player', JSON.stringify(player));

      updateHUD();
    })
    .catch(error => console.error('Ошибка загрузки JSON:', error));

  function updateHUD() {
    document.getElementById("goal").textContent = gameData.gameTarget.easy.money + "$";
    document.getElementById("requiredTasks").textContent = gameData.gameTarget.easy.requiredTasks;
    document.getElementById("name").textContent = player.name;
    document.getElementById("character").src = `img/${player.character}Main.png`;
    document.getElementById("level").textContent = player.level;
    document.getElementById("exp").textContent = `${player.exp} / ${player.expToNext}`;
    document.getElementById("money").textContent = player.money;
    document.getElementById("energy").textContent = `${player.energy} / ${player.maxEnergy}`;

    updateCountdown();
  }

  function updateCountdown() {
    const startTime = localStorage.getItem('gameStartTime');
    if (!startTime) {
      document.getElementById("endTime").textContent = "—";
      return;
    }

    const now = new Date();
    const endTime = new Date(parseInt(startTime, 10) + 14 * 24 * 60 * 60 * 1000); // 14 дней
    const diff = endTime - now;

    if (diff <= 0) {
      document.getElementById("endTime").textContent = "Время вышло!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("endTime").textContent = `${days}д ${hours}ч ${minutes}м ${seconds}с`;
  }

  // Таймер обновляется каждую секунду
  setInterval(updateCountdown, 1000);

  const hudCloseOpenBtn = document.querySelector('.hudCloseOpen');
  const hud = document.querySelector('.hud');

  hudCloseOpenBtn.addEventListener('click', openCloseHudList);

  function openCloseHudList() {
    hud.classList.toggle('closeHudList');
    hudCloseOpenBtn.textContent = hud.classList.contains('closeHudList') ? 'Открыть' : 'Закрыть';
  }

  // Инструкции
  const instructionsBTN = document.querySelector('.instructionsBTN');
  const instructionsText = document.querySelector('.instructionsText');

  const texts = [
    `<span>⏳ Ограничения по дням!</span> <br>
Выходные (суббота и воскресенье) — нельзя выполнять заказы. <br>
Можно только учиться или отдыхать. <br>
Если нарушишь правило — получишь штраф по энергии и опыту. <br>
Игру можно начать в любой день недели (в том числе с субботы).`,

    `<span>На экране появляются задания:</span> <br>
📄 Описание — что нужно сделать или изучить. <br>
💰 Цена — сколько заплатят. <br>
⏱ Время — сколько займёт выполнение. <br>
Действия: <br>
🔘 Принять — начинаешь выполнение. <br>
✖ Пропустить — переходишь к следующему заказу.`,

    `<span>Характеристики игрока</span> <br>
В панели слева всегда видно: <br>
💰 Деньги — твой баланс. <br>
⚡ Энергия — тратится на работу и учёбу. Если закончится — придётся отдыхать. <br>
📈 Опыт — получаешь за заказы и обучение. При достижении нужного количества переходишь на новый уровень. <br>
📅 День — показывает, сколько дней прошло с начала игры. <br>
🎯 Цель — твой план (деньги + обязательные задания).`,

    `<span>Готов начать?</span>`
  ];

  let current = 0;
  instructionsBTN.addEventListener('click', function () {
    if (current < texts.length) {
      instructionsText.innerHTML = texts[current];
      current++;

      if (current === texts.length) {
        this.textContent = 'Начать!';
      }
    } else {
      // При нажатии "Начать!" фиксируем старт времени
      if (!localStorage.getItem('gameStartTime')) {
        localStorage.setItem('gameStartTime', Date.now());
      }
      updateCountdown(); // Запускаем сразу
    }
  });
}

initPlayerHUD();




//   const orders = [
//     { text: "Выберите заказ", money: 0, energy: 0, xp: 0 },
//     { text: "Сделать лендинг — 100$", money: 100, energy: -30, xp: 5 },
//     { text: "Правки на сайте — 50$", money: 50, energy: -25, xp: 3 },
//     { text: "Добавить форму обратной связи — 30$", money: 30, energy: -10, xp: 2 }
//   ];

//   let currentIndex = 0;
//   let money = 0;
//   let energy = 100;
//   let xp = 0;

//   const orderText = document.getElementById('currentOrder');
//   const acceptBtn = document.getElementById('acceptBtn');
//   const skipBtn = document.getElementById('skipBtn');
//   const progressBar = document.getElementById('progressBar');
//   const progress = document.querySelector('.progress');
//   const moneyDisplay = document.getElementById('money');
//   const energyDisplay = document.getElementById('energy');
//   const xpDisplay = document.getElementById('xp');
//   const video = document.getElementById('video');

//   function loadOrder() {
//     if (currentIndex < orders.length) {
//       orderText.textContent = orders[currentIndex].text;
//     } else {
//       orderText.textContent = "Дедлайны не ждут, а батарейка садится. Пора бы выпить кофе...";
//       acceptBtn.textContent = "До завтра!";
//       skipBtn.classList.add('hideBtn');

//       acceptBtn.addEventListener('click', lastMessage);
//       function lastMessage() {

//       }
//     }
//   }

//   acceptBtn.addEventListener('click', () => {
//     if (currentIndex === 0) {
//       progressBar.classList.remove('hidden');
//       progress.style.width = '0%';

//       setTimeout(() => {
//         progress.style.width = '100%';
//       }, 5000);
//     }
//     else {
//       orderText.style.display = 'none';
//       acceptBtn.style.display = 'none';
//       skipBtn.style.display = 'none';
//       video.style.display = 'block';
//       video.play();

//       video.addEventListener('ended', () => {
//         video.style.display = 'none';
//         orderText.style.display = 'block';
//         acceptBtn.style.display = 'inline-block';
//         skipBtn.style.display = 'inline-block';
//       });
//     }

//     setTimeout(() => {
//       const order = orders[currentIndex];
//       money += order.money;
//       energy += order.energy;
//       xp += order.xp;

//       moneyDisplay.textContent = money;
//       energyDisplay.textContent = energy + '%';
//       xpDisplay.textContent = xp + '%';

//       currentIndex++;
//       progressBar.classList.add('hidden');
//       loadOrder();

//       if (energy < 40) {
//         if (localStorage.getItem('selectedCharacter') === 'boy') {
//           character.src = 'img/tiredBoy.png'
//           console.log(character);
//         }
//         else {
//           character.src = 'img/tiredGirl.png'
//         }
//         // document.querySelector('.instructionsText_box').textContent = 'Дедлайны не ждут, а батарейка садится. Пора бы выпить кофе...';
//       }
//     }, 5000);
//   });

//   skipBtn.addEventListener('click', () => {
//     currentIndex++;
//     loadOrder();
//   });

//   loadOrder();
