document.addEventListener("DOMContentLoaded", () => {
    const wheelCanvas = document.getElementById("rouletteWheel");
    const ctx = wheelCanvas.getContext("2d");
    const ball = document.getElementById("ball");
    const spinButton = document.getElementById("spinButton");
    const message = document.getElementById("message");
    const coinsDisplay = document.getElementById("coins");
    const betTable = document.getElementById("betTable");
    const chips = document.querySelectorAll(".chip");

    let coins = 1000;
    let currentChipValue = 0;
    const bets = {};

    // Dynamisch nummers voor inzet
    for (let i = 0; i <= 36; i++) {
        const betCell = document.createElement("div");
        betCell.classList.add("bet");
        betCell.textContent = i;

        // Voeg bet-value toe
        const betValue = document.createElement("div");
        betValue.classList.add("bet-value");
        betValue.textContent = "0";
        betCell.appendChild(betValue);

        betCell.addEventListener("click", () => {
            if (currentChipValue > 0 && coins >= currentChipValue) {
                bets[i] = (bets[i] || 0) + currentChipValue;
                coins -= currentChipValue;
                coinsDisplay.textContent = coins;
                betValue.textContent = bets[i];
            } else {
                message.textContent = "Not enough coins or no chip selected!";
            }
        });

        betTable.appendChild(betCell);
    }

    // Voeg rood en zwart inzet toe
    const redBlackContainer = document.createElement("div");
    redBlackContainer.classList.add("red-black-container");

    const redBlackBets = ["Red", "Black"];
    redBlackBets.forEach(color => {
        const betCell = document.createElement("div");
        betCell.classList.add("bet", color.toLowerCase());
        betCell.textContent = color;

        const betValue = document.createElement("div");
        betValue.classList.add("bet-value");
        betValue.textContent = "0";
        betCell.appendChild(betValue);

        betCell.addEventListener("click", () => {
            if (currentChipValue > 0 && coins > 0) {
                const betAmount = Math.min(currentChipValue, coins);
                bets[color] = (bets[color] || 0) + betAmount;
                coins -= betAmount;
                coinsDisplay.textContent = coins;
                betValue.textContent = bets[color];
            } else {
                message.textContent = "No chip selected!";
            }
        });

        redBlackContainer.appendChild(betCell);
    });

    betTable.parentElement.insertBefore(redBlackContainer, betTable);

    // Fiches selecteren
    chips.forEach(chip => {
        chip.addEventListener("click", () => {
            currentChipValue = parseInt(chip.dataset.value);
        });
    });

    // Tekenen van het wiel
    const colors = ["#e74c3c", "#2ecc71"];
    const numbers = [...Array(37).keys()];
    let angle = 0;

    function drawWheel() {
        const sliceAngle = (2 * Math.PI) / numbers.length;
        numbers.forEach((num, i) => {
            ctx.beginPath();
            if (i === 0) {
                ctx.fillStyle = "green"; // Nummer 0 groen
            } else {
                ctx.fillStyle = i % 2 === 0 ? "red" : "black"; // Buitenste rood en zwart
            }
            ctx.moveTo(300, 300);
            ctx.arc(300, 300, 300, angle, angle + sliceAngle);
            ctx.lineTo(300, 300);
            ctx.fill();
            ctx.save();
            ctx.translate(300, 300);
            ctx.rotate(angle + sliceAngle / 2);
            ctx.fillStyle = "#fff";
            ctx.font = "20px Arial";
            ctx.fillText(num, 250, 10);
            ctx.restore();
            angle += sliceAngle;
        });

        // Gouden rand tussen rood en zwart en doorlopend tot de vakjes van de nummers
        ctx.strokeStyle = "gold";
        ctx.lineWidth = 5;
        numbers.forEach((num, i) => {
            ctx.beginPath();
            ctx.moveTo(300, 300);
            ctx.arc(300, 300, 300, i * sliceAngle, (i + 1) * sliceAngle);
            ctx.lineTo(300, 300);
            ctx.stroke();
        });

        // Binnenste cirkel met groene vakjes
        numbers.forEach((num, i) => {
            ctx.beginPath();
            ctx.fillStyle = "green";
            ctx.moveTo(300, 300);
            ctx.arc(300, 300, 150, i * sliceAngle, (i + 1) * sliceAngle);
            ctx.lineTo(300, 300);
            ctx.fill();
        });

        // Gouden rand tussen de groene vakjes
        ctx.strokeStyle = "gold";
        ctx.lineWidth = 3;
        numbers.forEach((num, i) => {
            ctx.beginPath();
            ctx.moveTo(300, 300);
            ctx.arc(300, 300, 150, i * sliceAngle, (i + 1) * sliceAngle);
            ctx.lineTo(300, 300);
            ctx.stroke();
        });
    }

    drawWheel();

    // Het balletje laten draaien
    function spinWheel() {
        if (Object.keys(bets).length === 0) {
            message.textContent = "Place your bets first!";
            return;
        }

        let rotation = 0;
        let ballAngle = 0;
        let speed = 1; // Langzamer starten
        const winningNumber = Math.floor(Math.random() * 37);
        const sliceAngle = (2 * Math.PI) / numbers.length;
        const targetAngle = winningNumber * sliceAngle + sliceAngle / 2;

        ball.style.display = "block";

        // Animatie
        const interval = setInterval(() => {
            rotation += 10;
            ballAngle += speed;
            speed *= 0.97; // Langzamer afremmen
            const x = 300 + Math.cos(ballAngle) * 250;
            const y = 300 + Math.sin(ballAngle) * 250;
            ball.style.left = `${x}px`;
            ball.style.top = `${y}px`;

            if (speed <= 0.5) {
                clearInterval(interval);

                // Zorg dat het balletje stopt op de juiste plek
                ball.style.left = `${300 + Math.cos(targetAngle) * 250}px`;
                ball.style.top = `${300 + Math.sin(targetAngle) * 250}px`;

                // Controleer winst/verlies
                let winnings = 0;
                if (bets[winningNumber]) {
                    winnings = bets[winningNumber] * 35;
                    coins += winnings;
                    message.textContent = `Winning Number: ${winningNumber}. You won ${winnings} coins!`;
                } else if ((winningNumber % 2 === 0 && bets["Red"]) || (winningNumber % 2 !== 0 && bets["Black"])) {
                    winnings = (bets["Red"] || bets["Black"]) * 2;
                    coins += winnings;
                    message.textContent = `Winning Number: ${winningNumber}. You won ${winnings} coins!`;
                } else {
                    message.textContent = `Winning Number: ${winningNumber}. You lost!`;
                }

                coinsDisplay.textContent = coins;

                // Reset bets
                Object.keys(bets).forEach(num => {
                    bets[num] = 0;
                });
                document.querySelectorAll('.bet-value').forEach(betValue => {
                    betValue.textContent = "0";
                });
            }
        }, 50);
    }

    spinButton.addEventListener("click", spinWheel);
});
