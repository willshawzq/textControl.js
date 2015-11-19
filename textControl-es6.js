let getTextWidth = (()=>{
    let oSpan = document.createElement("span");
    oSpan.id = 'span-for-getTextWidth';
    oSpan.style.cssText = `
        position: absolute;
        top: -200vw;
        height: -200vh;
        height: auto;
        width: auto;
        visibility: hidden;
        white-space:nowrap;
    `;
    document.body.appendChild(oSpan);
    return function(text, fontSize) {
        oSpan.style.fontSize = fontSize;
        oSpan.innerHTML = text;
        return oSpan.clientWidth;
    };
})();
String.prototype.textWidth = function(font = "12px Microsoft Yahei") {
    let canvas = document.createElement("canvas"),
        context = canvas.getContext("2d");
    context.font = font;
    let metrics = context.measureText(this);
    return metrics.width;
};
String.prototype.ellipsis = function(length, font = "12px Microsoft Yahei", ellipsis = "...") {
    let temp = trimmed = this;
    
    if(temp.textWidth(font) <= length)  return temp;

    do {
        temp = temp.substring(0, temp.length - 1);
        trimmed = temp + ellipsis;
    } while(trimmed.textWidth(font) > length);

    return trimmed;
};
String.prototype.multiEllipsis = function(width, rows, font = "12px Microsoft Yahei", ellipsis = "...") {
    let temp = trimmed = this,
        length = rows * width;
     do {
        temp = temp.substring(0, temp.length - 1);
        trimmed = temp + ellipsis;
    } while(trimmed.textWidth(font) > length);
    return trimmed;
};
String.prototype.ellipsisInMiddle = function(length, pattern = 1, font = "12px Microsoft Yahei", ellipsis = "...") {
    if(this.textWidth(font) <= length ) return this;

    let isNum = typeof pattern === "num",
        suffix = isNum ? this.substr(-1, pattern) : this.split(pattern).pop();
    let suffixNum = suffix.length;
    let temp = trimmed = this.substring(0, this.length - suffixNum);
    suffix = ellipsis + suffix;

    do {
        temp = temp.substring(0, temp.length - 1);
        trimmed = temp + suffix;
    } while(trimmed.textWidth(font) > length);

    return trimmed;
};
console.log("12px Microsoft Yahei".textWidth());
console.log("12px Microsoft Yahei".ellipsis(100));
console.log("12px Microsoft Yahei12px Microsoft Yahei12px Microsoft Yahei12px Microsoft Yahei".ellipsisInMiddle(200, " "));