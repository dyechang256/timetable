export function moji() {
  console.log("fire");
  return 1;
}

export function time() {
  const TIME = [
    ["8:50", "10:20"],
    ["10:30", "12:00"],
    ["14:20", "15:50"],
    ["16:00", "17:30"],
  ];

  //時間割の時刻を分に変換
  const begins = TIME.map((item) => item[0])
    .map((item) => ({ hours: Number(item.split(":")[0]), minutes: Number(item.split(":")[1]) }))
    .map((item) => item.hours * 60 + item.minutes);

  //TIME.map(v => v[0]).map(v => v.split(":").map(v => Number(v))).map(v => v[0]* 60 + v[1])

  //現在時刻を分に変換
  const now = new Date();
  const nowInMinutes = now.getHours() * 60 + now.getMinutes();

  //現在時刻より後の最初の時間を探す
  const nextTime = begins.find((time) => nowInMinutes < time);
  if (nextTime) {
    return `${Math.floor(nextTime / 60)}:${(nextTime % 60).toString().padStart(2, "0")}`;
  } else {
    return "明日";
  }
}
