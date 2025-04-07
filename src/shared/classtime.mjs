import { DB, TABLE_STORE_NAME } from "./db.mjs";

export async function time() {
  const PERIOD_TIMES = {
    1: "8:50",
    2: "10:30",
    3: "12:40",
    4: "14:20",
    5: "16:00",
  };

  const now = new Date();
  const nowInMinutes = now.getHours() * 60 + now.getMinutes(); // 現在時刻を分に変換

  // 現在の曜日を取得（0: 日曜, 1: 月曜, ..., 6: 土曜）
  const dayOfWeek = now.getDay() - 1; // 月曜を0、火曜を1とする
  const days = ["月", "火", "水", "木", "金"];
  const today = days[dayOfWeek];

  // 平日のみ処理を実行
  if (!today) {
    return "明日";
  }

  // IndexedDB から時間割データを取得
  const timetableEntries = await DB.getAll(TABLE_STORE_NAME);

  // 現在の曜日に該当するデータをフィルタリング
  const todayClasses = timetableEntries.filter((entry) => entry.dayperiod.startsWith(today));

  // 現在時刻より後の科目をフィルタリング
  const upcomingClasses = todayClasses
    .map((entry) => {
      const [day, period] = entry.dayperiod.split("-"); // 曜日と時限を分離
      const startTime = PERIOD_TIMES[period]; // 時限に対応する開始時刻を取得
      const [hours, minutes] = startTime.split(":").map(Number);
      const startMinutes = hours * 60 + minutes;

      return { ...entry, startMinutes }; // 開始時刻を分単位で追加
    })
    .filter((entry) => entry.startMinutes > nowInMinutes) // 現在時刻より後の科目をフィルタリング
    .sort((a, b) => a.startMinutes - b.startMinutes); // 開始時刻でソート

  // 次の科目を取得
  if (upcomingClasses.length > 0) {
    const nextClass = upcomingClasses[0];
    const nextTime = nextClass.startMinutes;
    return `${Math.floor(nextTime / 60)}:${(nextTime % 60).toString().padStart(2, "0")}`;
  } else {
    return "また明日";
  }
}
