<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interactive Roulette</title>
    <link rel="stylesheet" href="roulette_style.css">
</head>
<body>
    <div class="roulette-container">
        <header>
            <h1>Interactive Roulette</h1>
            <p>Your Coins: <span id="coins" class="coins-display">1000</span></p>
        </header>
        <div class="game-area">
            <!-- Het roulette wiel -->
            <div class="wheel">
                <canvas id="rouletteWheel" width="600" height="600"></canvas>
                <div id="ball"></div>
            </div>

            <!-- Inzet en melding -->
            <div class="betting-area">
                <h2>Place Your Bets</h2>
                <div class="chips">
                    <button class="chip" data-value="1">1</button>
                    <button class="chip" data-value="5">5</button>
                    <button class="chip" data-value="10">10</button>
                    <button class="chip" data-value="50">50</button>
                    <button class="chip" data-value="100">100</button>
                </div>
                <div class="bet-numbers">
                    <!-- Dynamisch nummers genereren -->
                    <div id="betTable"></div>
                </div>
                <button id="spinButton">Spin</button>
                <div id="message"></div>
            </div>
        </div>
    </div>

    <script src="roulette_script.js"></script>
</body>
</html>
