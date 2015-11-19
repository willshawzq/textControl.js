"use strict";

var getTextWidth = (function () {
    var oSpan = document.createElement("span");
    oSpan.id = 'span-for-getTextWidth';
    oSpan.style.cssText = "\n        position: absolute;\n        top: -200vw;\n        height: -200vh;\n        height: auto;\n        width: auto;\n        visibility: hidden;\n        white-space:nowrap;\n    ";
    document.body.appendChild(oSpan);
    return function (text, fontSize) {
        oSpan.style.fontSize = fontSize;
        oSpan.innerHTML = text;
        return oSpan.clientWidth;
    };
})();
String.prototype.textWidth = function () {
    var font = arguments.length <= 0 || arguments[0] === undefined ? "12px Microsoft Yahei" : arguments[0];

    var canvas = document.createElement("canvas"),
        context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(this);
    return metrics.width;
};
String.prototype.ellipsis = function (length) {
    var font = arguments.length <= 1 || arguments[1] === undefined ? "12px Microsoft Yahei" : arguments[1];
    var ellipsis = arguments.length <= 2 || arguments[2] === undefined ? "..." : arguments[2];

    var temp = trimmed = this;

    if (temp.textWidth(font) <= length) return temp;

    do {
        temp = temp.substring(0, temp.length - 1);
        trimmed = temp + ellipsis;
    } while (trimmed.textWidth(font) > length);

    return trimmed;
};
String.prototype.multiEllipsis = function (width, rows) {
    var font = arguments.length <= 2 || arguments[2] === undefined ? "12px Microsoft Yahei" : arguments[2];
    var ellipsis = arguments.length <= 3 || arguments[3] === undefined ? "..." : arguments[3];

    var temp = trimmed = this,
        length = rows * width;
    do {
        temp = temp.substring(0, temp.length - 1);
        trimmed = temp + ellipsis;
    } while (trimmed.textWidth(font) > length);
    return trimmed;
};
String.prototype.ellipsisInMiddle = function (length) {
    var pattern = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
    var font = arguments.length <= 2 || arguments[2] === undefined ? "12px Microsoft Yahei" : arguments[2];
    var ellipsis = arguments.length <= 3 || arguments[3] === undefined ? "..." : arguments[3];

    if (this.textWidth(font) <= length) return this;

    var isNum = typeof pattern === "num",
        suffix = isNum ? this.substr(-1, pattern) : this.split(pattern).pop();
    var suffixNum = suffix.length;
    var temp = trimmed = this.substring(0, this.length - suffixNum);
    suffix = ellipsis + suffix;

    do {
        temp = temp.substring(0, temp.length - 1);
        trimmed = temp + suffix;
    } while (trimmed.textWidth(font) > length);

    return trimmed;
};
console.log("12px Microsoft Yahei".textWidth());
console.log("12px Microsoft Yahei".ellipsis(100));
console.log("12px Microsoft Yahei12px Microsoft Yahei12px Microsoft Yahei12px Microsoft Yahei".ellipsisInMiddle(200, " "));