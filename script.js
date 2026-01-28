window.addEventListener('DOMContentLoaded', function () {

const BASE_URL = "https://open.er-api.com/v6/latest/";

const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const resultDiv = document.getElementById("result");
const fromFlag = document.querySelector(".from img");
const toFlag = document.querySelector(".to img");
const swapBtn = document.querySelector(".dropdown i");


for (let currCode in countryList) {
    let option1 = document.createElement("option");
    option1.value = currCode;
    option1.textContent = currCode;
    if (currCode === "INR") option1.selected = true;  // default
    fromCurrency.appendChild(option1);

    let option2 = document.createElement("option");
    option2.value = currCode;
    option2.textContent = currCode;
    if (currCode === "USD") option2.selected = true;  // default
    toCurrency.appendChild(option2);
}

function updateFlag(selectElement, imgElement) {
    let currCode = selectElement.value;
    let countryCode = countryList[currCode];
    imgElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}


function clearResult() {
    resultDiv.innerHTML = "";
}

fromCurrency.addEventListener("change", () => {
    updateFlag(fromCurrency, fromFlag);
    clearResult();
});
toCurrency.addEventListener("change", () => {
    updateFlag(toCurrency, toFlag);
    clearResult();
});

if (swapBtn) {
    swapBtn.addEventListener("click", () => {
        swapBtn.style.transition = "transform 0.35s ease";
        swapBtn.style.transform = "rotate(180deg)";
        setTimeout(() => (swapBtn.style.transform = ""), 350);

        const tmp = fromCurrency.value;
        fromCurrency.value = toCurrency.value;
        toCurrency.value = tmp;

        // update flags after swap
        updateFlag(fromCurrency, fromFlag);
        updateFlag(toCurrency, toFlag);

        clearResult();
    });
}

// Convert currency
async function convertCurrency() {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        resultDiv.innerHTML = `<p style="color: #ff9ecb;">⚠️ Please enter a valid amount!</p>`;
        return;
    }

    const from = fromCurrency.value;
    const to = toCurrency.value;

    // if user chose same currency, just echo the same amount
    if (from === to) {
        resultDiv.innerHTML = `
            <p style="margin-top:15px; font-size:1.2rem; font-weight:600; color:#7ee8fa;">
                💱 ${amount} ${from} = <strong style="color:#ff9ecb;">${amount.toFixed(2)} ${to}</strong>
            </p>
        `;
        return;
    }

    // show a quick loading state
    resultDiv.innerHTML = `<p style="color:#7ee8fa;">⏳ Fetching exchange rate...</p>`;

    try {
        const response = await fetch(`${BASE_URL}${from}`);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        if (!data || !data.rates || typeof data.rates[to] === "undefined") {
            resultDiv.innerHTML = `<p style="color: red;">❌ Failed to fetch exchange rate for ${to}.</p>`;
            return;
        }

        const rate = data.rates[to];
        const convertedAmount = (amount * rate).toFixed(2);

        resultDiv.innerHTML = `
            <p style="
                margin-top:15px;
                font-size:1.2rem;
                font-weight:600;
                color:#7ee8fa;
            ">
                💱 ${amount} ${from} = <strong style="color:#ff9ecb;">${convertedAmount} ${to}</strong>
            </p>
        `;
    } catch (error) {
        console.error("Conversion error:", error);
        resultDiv.innerHTML = `<p style="color: red;">⚠️ Error fetching exchange rates. Try again.</p>`;
    }
}

convertBtn.addEventListener("click", convertCurrency);

updateFlag(fromCurrency, fromFlag);
updateFlag(toCurrency, toFlag);

});