/* --- script.js (借金追加機能付き) --- */

// 1. 初期設定とDOM要素の取得
const debtAmountElement = document.getElementById('debt-amount');
const paymentInput = document.getElementById('payment-input');
const recordButton = document.getElementById('record-payment');
const statusMessage = document.getElementById('status-message');
const lastDateElement = document.getElementById('last-date');

// ★★★ 追加要素のDOMを取得 ★★★
// index.html に追加することを前提とします。
// 以下の要素を index.html の input-group の下などに追加してください。
// <input type="number" id="borrow-input" placeholder="例: 50000" min="1" required>
// <button id="record-borrow">借金を追加する</button>
const borrowInput = document.getElementById('borrow-input');
const borrowButton = document.getElementById('record-borrow');


// 定数設定
const annualRate = 0.15; // 年利 15%
const dailyRate = annualRate / 365; // 日歩
const INITIAL_DEBT = 100000; // 初期残高 100,000円

// 変数設定 (LocalStorageから読み込むか、初期値を使用)
let totalDebt;
let lastInterestDate; // 利子計算の基準日として使用
// let lastPaymentDate; は使用せず、lastInterestDateで統一


// 2. LocalStorageからデータを読み込む関数
function loadData() {
    // 借金残高の読み込み
    const savedDebt = localStorage.getItem('debtAmount');
    if (savedDebt !== null && !isNaN(parseFloat(savedDebt))) {
        totalDebt = parseFloat(savedDebt);
    } else {
        totalDebt = INITIAL_DEBT; 
    }

    // 利子計算の基準日の読み込み
    const savedDate = localStorage.getItem('lastInterestDate');
    if (savedDate !== null && !isNaN(parseInt(savedDate, 10))) {
        lastInterestDate = new Date(parseInt(savedDate, 10));
    } else {
        // 保存がなければ現在の日付
        lastInterestDate = new Date(); 
    }
}

// 3. LocalStorageにデータを保存する関数
function saveData() {
    // totalDebtを保存
    localStorage.setItem('debtAmount', totalDebt);
    // lastInterestDateをミリ秒 (数値) にして保存
    localStorage.setItem('lastInterestDate', lastInterestDate.getTime());
}


// 4. 表示更新関数 (変更なし)
function updateDisplay() {
    debtAmountElement.textContent = Math.round(totalDebt).toLocaleString();
    lastDateElement.textContent = lastInterestDate.toLocaleDateString('ja-JP');

    if (totalDebt <= 0) {
        debtAmountElement.style.color = '#5cb85c';
        statusMessage.textContent = '🎊 借金完済おめでとうございます！ 🎊';
        recordButton.disabled = true;
        if (borrowButton) borrowButton.disabled = true; // 追加
    } else {
        debtAmountElement.style.color = '#d9534f';
        statusMessage.textContent = '目標まであと少し！頑張りましょう！';
        recordButton.disabled = false;
        if (borrowButton) borrowButton.disabled = false; // 追加
    }
}


// 5. アニメーション関数 (変更なし)
function animateCounter(startValue, endValue, duration = 800) {
    let startTime = null;
    const range = endValue - startValue; 
    
    if (window.currentAnimation) {
        cancelAnimationFrame(window.currentAnimation);
    }

    function frame(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percentage = Math.min(progress / duration, 1);
        
        const currentValue = Math.round(startValue + (range * percentage));

        debtAmountElement.textContent = currentValue.toLocaleString();
        
        if (percentage < 1) {
            window.currentAnimation = requestAnimationFrame(frame);
        } else {
            updateDisplay();
        }
    }
    
    window.currentAnimation = requestAnimationFrame(frame);
}


// 6. 利子計算と返済処理 (利子基準日の変数名を変更)
function recordPayment() {
    const payment = parseInt(paymentInput.value, 10);
    const today = new Date();

    if (isNaN(payment) || payment <= 0) {
        alert('有効な返済額を入力してください。');
        return;
    }
    if (totalDebt <= 0) return;

    // --- 利子計算 ---
    const diffTime = today.getTime() - lastInterestDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    let interestAdded = 0;
    if (diffDays > 0) {
        interestAdded = totalDebt * dailyRate * diffDays;
        totalDebt += interestAdded;
        alert(`${diffDays}日経過したため、利子として ${Math.round(interestAdded).toLocaleString()} 円が加算されました。`);
    }
    
    // --- 返済処理 ---
    const startDebt = totalDebt;
    const newDebt = Math.max(0, totalDebt - payment);

    // 総残高を更新
    totalDebt = newDebt;
    // 利子計算の基準日を今日に更新（返済したため）
    lastInterestDate = today;

    saveData();
    animateCounter(startDebt, newDebt, 800);
    paymentInput.value = '';
}


// 7. ★★★ 借金追加処理（新しい関数） ★★★
function recordBorrow() {
    const borrowAmount = parseInt(borrowInput.value, 10);
    const today = new Date();

    if (isNaN(borrowAmount) || borrowAmount <= 0) {
        alert('有効な借入額を入力してください。');
        return;
    }
    
    // --- 利子計算（追加時も利子を確定させる） ---
    // 利子を計算し、元本に加算します
    const diffTime = today.getTime() - lastInterestDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    
    let interestAdded = 0;
    if (diffDays > 0) {
        interestAdded = totalDebt * dailyRate * diffDays;
        totalDebt += interestAdded;
        alert(`${diffDays}日経過したため、利子として ${Math.round(interestAdded).toLocaleString()} 円が加算されました。`);
    }

    // --- 借入額の追加 ---
    const startDebt = totalDebt;
    const newDebt = totalDebt + borrowAmount;

    // 総残高を更新
    totalDebt = newDebt;
    // 利子計算の基準日を今日に更新（借入によって残高が変わったため）
    lastInterestDate = today; 

    alert(`${borrowAmount.toLocaleString()} 円の借金が追加されました！`);

    saveData();
    animateCounter(startDebt, newDebt, 800); // カウンターは増えるアニメーション
    borrowInput.value = '';
}


// 8. 初期化処理
function initialize() {
    loadData();
    updateDisplay();
    recordButton.addEventListener('click', recordPayment);
    
    // ★★★ 借金追加ボタンのイベントリスナーを設定 ★★★
    if (borrowButton) {
        borrowButton.addEventListener('click', recordBorrow);
    }
}

// スクリプトの実行開始
initialize();
