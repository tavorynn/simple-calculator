// Mengambil referensi elemen-elemen yang diperlukan dari DOM
const display = document.querySelector("#display");
const buttons = document.querySelectorAll("button");
const historyList = document.querySelector("#history-list");
const themeToggleBtn = document.querySelector(".theme-toggler");
const calculator = document.querySelector(".calculator");
const particles = document.querySelector(".particles");
const toggleIcon = document.querySelector(".toggler-icon");

// Fungsi untuk menghitung faktorial
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

// Fungsi untuk menambahkan item ke riwayat
function addHistoryItem(expression, result) {
  // Ekspresi RegExp untuk memisahkan token dalam ekspresi matematika
  const tokens = expression.match(/[\w.]+|\*\*|[^\w\s.]/g); 
  // Menambahkan spasi antara setiap token untuk keterbacaan
  const spacedExpression = tokens.join(" ");
  result = parseFloat(result.toFixed(12)); // Membulatkan hasil hingga 12 desimal

  // Membuat elemen list baru untuk menampilkan riwayat
  const historyItem = document.createElement("li");
  historyItem.textContent = `${spacedExpression} = ${result}`;
  historyList.appendChild(historyItem);
}

// Fungsi yang menangani klik tombol pada kalkulator
function handleButtonClick(event) {
  const buttonId = event.target.id || event.target.getAttribute("data-key");
  const currentValue = display.innerText;

  switch (buttonId) {
    case "clear":
      display.innerText = "";
      break;
    case "backspace":
      display.innerText = currentValue.slice(0, -1);
      break;
    case "equal":
      try {
        let currentValue = display.innerText;

        // Mengubah ekspresi faktorial ke format evaluasi
        currentValue = currentValue.replace(/(\d+)!/g, (_, number) => `factorial(${number})`);

        // Mengubah persen menjadi pembagian
        currentValue = currentValue.replace(/(\d+)%/g, (_, number) => `(${number}/100)/*percent*/`);

        // Mengonversi fungsi trigonometri dari derajat ke radian
        currentValue = currentValue.replace(/Math\.sin\(/g, "Math.sin(Math.PI/180*");
        currentValue = currentValue.replace(/Math\.cos\(/g, "Math.cos(Math.PI/180*");
        currentValue = currentValue.replace(/Math\.tan\(/g, "Math.tan(Math.PI/180*");

        // Menyimpan ekspresi asli untuk pengembalian nanti
        let originalValue = currentValue;

        // Evaluasi ekspresi
        let result = eval(currentValue);
        result = parseFloat(result.toFixed(12));

        // Mengembalikan simbol faktorial
        currentValue = currentValue.replace(/factorial\((\d+)\)/g, (_, number) => `${number}!`);

        // Mengembalikan persen ke simbol asli
        currentValue = currentValue.replace(/\((\d+)\/100\)\/\*percent\*\//g, (_, number) => `${number}%`);

        // Mengembalikan fungsi trigonometri ke bentuk asli
        currentValue = currentValue.replace(/Math\.sin\(Math\.PI\/180\*/g, "Math.sin(");
        currentValue = currentValue.replace(/Math\.cos\(Math\.PI\/180\*/g, "Math.cos(");
        currentValue = currentValue.replace(/Math\.tan\(Math\.PI\/180\*/g, "Math.tan(");

        // Menampilkan hasil dan menambahkannya ke riwayat
        display.innerText = result;
        addHistoryItem(currentValue, result);

        alert(`Result of ${currentValue} is: ${result}`);
      } catch (error) {
        display.innerText = "Error!";
        setTimeout(() => (display.innerText = ""), 2000);
      }
      break;
    case "%":
      display.innerText += "%";
      break;
    case "sin":
      display.innerText += "Math.sin(";
      break;
    case "cos":
      display.innerText += "Math.cos(";
      break;
    case "tan":
      display.innerText += "Math.tan(";
      break;
    case "power":
      display.innerText += "**";
      break;
    case "pi":
      display.innerText += "Math.PI";
      break;
    case "log":
      display.innerText += "Math.log(";
      break;
    case "sqrt":
      display.innerText += "Math.sqrt(";
      break;
    case "factorial":
      display.innerText += "!";
      break;
    default:
      display.innerText += buttonId;
      break;
  }
}

// Menambahkan event listener untuk setiap tombol
buttons.forEach((button) => {
  button.addEventListener("click", handleButtonClick);
});

// Event listener untuk tombol pada keyboard
document.addEventListener("keydown", (event) => {
  const key = event.key;
  const button = document.querySelector(`button[data-key="${key}"]`);
  if (button) {
    button.click();
  }
});

// Event listener untuk elemen riwayat
historyList.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    let historyExpression = event.target.textContent.split("=")[0].trim();
    historyExpression = historyExpression.replace(/\s+/g, ""); // Menghapus spasi
    display.innerText = historyExpression;
  }
});

// Event listener untuk beralih tema
themeToggleBtn.onclick = () => {
  calculator.classList.toggle("dark");
  particles.classList.toggle("dark");
  themeToggleBtn.classList.toggle("active");
};
