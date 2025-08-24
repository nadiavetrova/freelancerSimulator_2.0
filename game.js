
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

  document.getElementById('character').src = `img/${selectedCharacter}Main.png`;
}
characterSelectionInit();


function initPlayerHUD() {
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

    document.getElementById("endTime").textContent =
      `${days}д ${hours}ч ${minutes}м ${seconds}с`;
  }

  setInterval(updateCountdown, 1000);

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

  // 👉 Проверяем, проходил ли игрок инструкции раньше
  if (localStorage.getItem('tutorialCompleted') === 'true') {
    // Если да — сразу показываем игру (инструкции даже не вспыхнут)
    document.querySelector('.game').style.display = 'block';
    updateCountdown();
    return;
  }

  // Если ещё не пройдены → показываем кнопки инструкций
  instructionsBTN.style.display = 'inline-block';
  instructionsText.style.display = 'block';

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

      // ✅ Запоминаем, что инструкции уже пройдены
      localStorage.setItem('tutorialCompleted', 'true');

      updateCountdown();
      instructionsBTN.style.display = 'none';
      instructionsText.style.display = 'none';
      document.querySelector('.game').style.display = 'block';
    }
  });
}

initPlayerHUD();











async function gameStart() {
  const taskList = document.getElementById("taskList");
  const dailyLimitMessage = document.getElementById("dailyLimitMessage");

  // HUD элементы
  const expEl = document.getElementById("exp");
  const moneyEl = document.getElementById("money");
  const energyEl = document.getElementById("energy");

  // --- Настройки лимита на день ---
  const DAILY_TASK_LIMIT = 3; // В ДЕНЬ РОВНО 3 ПРЕДЛОЖЕНИЯ
  const ENERGY_RESTORE_TIME = 60 * 60 * 1000; // 1 час в миллисекундах

  // Загружаем/инициализируем игрока из localStorage
  let player = JSON.parse(localStorage.getItem("player")) || {
    exp: 0,
    expToNext: 100,
    money: 0,
    energy: 100,
    maxEnergy: 100,
    offersToday: 0, // сколько предложений задач уже было сегодня (принял ИЛИ отказался)
    lastLogin: Date.now(),
    lastEnergyRestore: Date.now() // 🔹 новое поле
  };

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // Проверяем новый день
  if (now - player.lastLogin >= oneDay) {
    player.lastLogin = now;
    player.offersToday = 0;
    saveProgress();
  }

  // 🔹 Проверяем восстановление энергии
  if (now - player.lastEnergyRestore >= ENERGY_RESTORE_TIME) {
    player.energy = player.maxEnergy;
    player.lastEnergyRestore = now;
    saveProgress();
  }

  function updateHUD() {
    expEl.textContent = player.exp;
    moneyEl.textContent = player.money;
    energyEl.textContent = `${player.energy} / ${player.maxEnergy}`;
  }

  function saveProgress() {
    localStorage.setItem("player", JSON.stringify(player));
  }

  // --- Грузим задачи ---
  const response = await fetch("stage.json");
  const data = await response.json();
  const tasks = Array.isArray(data?.specialTasks) ? data.specialTasks : [];

  if (!tasks.length) {
    taskList.innerHTML = `<li>Задач пока нет. Добавь их в stage.json → specialTasks</li>`;
    return;
  }

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pickRandomTask = () => tasks[randInt(0, tasks.length - 1)];

  function showNextTask() {
    if (player.offersToday >= DAILY_TASK_LIMIT) {
      dailyLimitMessage.style.display = "block";
      return;
    }
    dailyLimitMessage.style.display = "none";

    const task = pickRandomTask();
    const li = document.createElement("li");
    li.classList.add("task");
    li.innerHTML = `
      <h3>${task.name}</h3>
      <p>${task.description}</p>
      <p>💰 Награда: ${task.rewards?.money ?? 0} монет</p>
      <p>⭐ Опыт: ${task.rewards?.exp ?? 0}</p>
      <p>⚡ Энергия: -${task.energyWaste ?? 0}</p>
      <p>⏳ Время: ${task.time ?? 0} мин</p>
      ${task.link ? `<p><a href="${task.link}" target="_blank" rel="noopener">Материал / ссылка</a></p>` : ""}
      <button class="acceptBtn">✅ Взять в работу</button>
      <button class="declineBtn">❌ Отказаться</button>
    `;

    const acceptBtn = li.querySelector(".acceptBtn");
    const declineBtn = li.querySelector(".declineBtn");

    acceptBtn.addEventListener("click", () => acceptTask(task, li));
    declineBtn.addEventListener("click", () => declineTask(li));
    taskList.appendChild(li);
  }

  function acceptTask(task, li) {
    const need = Number(task.energyWaste ?? 0);
    if (player.energy < need) {
      showEnergyModal(task, li);
      return;
    }
    completeTask(task, li);
    consumeDailyOffer();
  }

  function declineTask(li) {
    li.remove();
    consumeDailyOffer();
  }

  function completeTask(task, li) {
    const spendEnergy = Number(task.energyWaste ?? 0);
    const rewardMoney = Number(task.rewards?.money ?? 0);
    const rewardExp = Number(task.rewards?.exp ?? 0);

    player.energy = Math.max(0, player.energy - spendEnergy);
    player.money += rewardMoney;
    player.exp += rewardExp;

    // 🔹 если энергия упала → фиксируем время
    if (player.energy < player.maxEnergy) {
      player.lastEnergyRestore = Date.now();
    }

    updateHUD();
    saveProgress();
    li.remove();
  }

  function consumeDailyOffer() {
    player.offersToday += 1;
    saveProgress();

    if (player.offersToday >= DAILY_TASK_LIMIT) {
      dailyLimitMessage.style.display = "block";
    } else {
      showNextTask();
    }
  }

  function showEnergyModal(task, li) {
    const modal = document.getElementById("energyModal");
    const buyBtn = document.getElementById("buyEnergyBtn");
    const cancelBtn = document.getElementById("cancelEnergyBtn");

    if (!modal || !buyBtn || !cancelBtn) {
      alert("Недостаточно энергии ⚡");
      return;
    }

    modal.style.display = "flex";

    buyBtn.onclick = null;
    cancelBtn.onclick = null;

    buyBtn.onclick = () => {
      const PRICE = 100;
      const RESTORE = 50;

      if (player.money >= PRICE) {
        player.money -= PRICE;
        player.energy = Math.min(player.maxEnergy, player.energy + RESTORE);

        if (player.energy === player.maxEnergy) {
          player.lastEnergyRestore = Date.now(); // сбрасываем таймер восстановления
        }

        updateHUD();
        saveProgress();
        modal.style.display = "none";

        const need = Number(task.energyWaste ?? 0);
        if (player.energy >= need) {
          completeTask(task, li);
          consumeDailyOffer();
        }
      } else {
        alert("Недостаточно монет 💸");
      }
    };

    cancelBtn.onclick = () => {
      modal.style.display = "none";
    };
  }

  // Старт
  updateHUD();

  if (player.offersToday < DAILY_TASK_LIMIT) {
    showNextTask();
  } else {
    dailyLimitMessage.style.display = "block";
  }
}

gameStart();







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
