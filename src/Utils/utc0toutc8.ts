export function utc0toutc8(date:any){
    const utc0Date = new Date(date);
    const utc8Offset = -8 * 60; // UTC-8的偏移量为-480分钟
    const utc8Timestamp = utc0Date.getTime() + (utc8Offset * 60 * 1000);
    const utc8Date = new Date(utc8Timestamp);
    return utc8Date.toUTCString();
}

export function textutc0to8(text:any){
    const regex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/g;

}