const annualRate = 0.15; // 年利 15%
const dailyRate = annualRate / 365; // 日歩
let totalDebt = 100000; // 初期残高 100,000円
let lastPaymentDate = new Date(); // 最終返済日を今日の日付で開始
// 返済処理が成功し、totalDebtが更新された後で実行
localStorage.setItem('debtAmount', totalDebt);
localStorage.setItem('lastDate', lastPaymentDate.getTime()); // Dateオブジェクトはミリ秒で保存
// JavaScriptの初期設定部分に追加

// 借金残高の読み込み
const savedDebt = localStorage.getItem('debtAmount');
if (savedDebt !== null) {
    totalDebt = parseFloat(savedDebt); // 保存された残高を読み込む
} else {
    totalDebt = 100000; // 保存がなければ初期値
}

// 最終返済日の読み込み
const savedDate = localStorage.getItem('lastDate');
if (savedDate !== null) {
    lastPaymentDate = new Date(parseInt(savedDate, 10));
} else {
    lastPaymentDate = new Date();
}
