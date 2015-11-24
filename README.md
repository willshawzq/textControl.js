## 获取字符串的长度 ##
在开发中会遇到从后台难道一个字符串要去获取他字符长度的情况，曾经想过通过获取单个字符的宽度来计算，但发现好像每个字符宽度都不一致（如果有清楚的朋友麻烦告知下）？！
### 有DOM操作 ###
单个字符计算不行，就只能将文字写入DOM的节点中，通过获取节点的clientWidth来获取该段文字的长度。故而
需要往DOM中插入一个span标签来填充字符串：

	String.prototype.textWidth = function(fontSize = 12) {
	    let oSpan = document.createElement("span");
	    oSpan.style.cssText = `
	        position: absolute;
	        top: -200vw;
	        height: auto;
	        width: auto;
	        visibility: hidden;
	        white-space:nowrap;//防止字符串宽度超过body的宽度导致换行
	    `;
	    document.body.appendChild(oSpan);
	    oSpan.style.fontSize = fontSize + "px";
	    oSpan.innerHTML = this;
	    let width = oSpan.clientWidth;
	    oSpan.parentNode.removeChild(oSpan);
	    return width;
	}
### 无DOM操作 ###
以上的写法有一个问题就是计算一次宽度就要对DOM进行两次操作，那能不能不对DOM进行操作便获取到字符串宽度的值呢？

在Canvas中有一个方法：
**[measureText](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText "measureText")**

	ctx.measureText(text);

measureText方法接受一个参数即需要处理的字符串，并返回一个包含文本宽度值得
**[TextMetrics](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics "TextMetrics")**
对象，并且该方法最好的一点就在于
**可以在文本向画布输出之前**便可得到文本宽度，甚至于并不需要Canvas节点插入到DOM节点中，便可完成此项操作：

	String.prototype.textWidth = function(fontSize = 12) {
	    let canvas = document.createElement("canvas"),
	        context = canvas.getContext("2d");
	    context.fontSize = fontSize;
	    let metrics = context.measureText(this);
	    return metrics.width;
	};

## 溢出截断 ##
### 单行溢出截断 ###
在开发时，经常会遇到文本溢出的问题，如果宽度超过了对应的宽度时便对字符串进行截断处理，并加上
**“...”**
这样的后缀，实现对应功能代码如下：

    String.prototype.ellipsis = function(length, font = "12px Microsoft Yahei", ellipsis = "...") {
	    let temp = trimmed = this;
	    
	    if(temp.textWidth(font) <= length)  return temp;
	
	    do {
	        temp = temp.substring(0, temp.length - 1);
	        trimmed = temp + ellipsis;
	    } while(trimmed.textWidth(font) > length);
	
	    return trimmed;
	};

当然这种效果直接用CSS便能实现：

    .cell-ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
### 多行溢出截断 ###
在实现多行溢出截断时，因为需要知道容器的高度，或者行数，所以最好是能够去操作DOM节点容器，去更加准确的截取字符。
**但是**
measureText无法让字符串换行并得到对应的高度，前面好不容易能够避免对DOM进行操作，现在又要用回第一种方法来截取多行，突然觉得好不甘心，所以这里就写了个指定行数的粗糙解法，希望以后能够找到更好的方法：

    String.prototype.multiEllipsis = function(width, rows, font = "12px Microsoft Yahei", ellipsis = "...") {
	    return this.ellipsis(width * rows, font, ellipsis);
	};//T_T

使用CSS完成多行溢出截断，目前只有Chrome下有效：

    .multi-ellipsis {
	    display: -webkit-box;
	    -webkit-line-clamp: 3;//控制行数
	    -webkit-box-orient: vertical;
	    overflow: hidden;
	}

## 中间溢出 ##
有时会遇到这样的问题，需要保留最后面某段字符串，省略中间的内容：

    String.prototype.ellipsisInMiddle = function(length, pattern = 1, font = "12px Microsoft Yahei", ellipsis = "...") {
	    if(this.textWidth(font) <= length ) return this;
	
		//判断是指定字符个数还是分隔符
	    let isNum = typeof pattern === "num",
			//如果是数字则截取末尾指定长度字符，否则便为指定最后一个分隔符后的内容
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

## 获取字符个数 ##
工作中还遇到过需要统计对应字符串中字符个数的情况，大家都知道一个汉字占两个字符，当汉字和英文等字符混杂时，计算起来就没有那么方便了，所以便有一下代码：

    String.prototype.textLength = function() {
		//这里将中文字符全都转换成两个英文字符，继而便可准确算出对应字符个数
	    return this.replace(/[^\x00-\xff]/g,"zx").length;  
	};
同时工作中需要获取指定字符数的情况，如果字符串中中文和英文混杂则获取时便不那么轻松，故而有了以下代码：

    String.prototype.getChars = function(num, index = 0) {
	    var len = this.length,
	        charCode = -1;
	    for (var i = index; i < len && num > 0; i++) {
	        charCode = this.charCodeAt(i);
	        if (charCode >= 0 && charCode <= 128) num -= 1;
	        else num -= 2;
	    }
	    return this.substr(index, i);
	};
## 总结 ##
这里的东西网上已经有很多成熟的插件实现了，比如
[jQuery.dotdotdot](https://github.com/BeSite/jQuery.dotdotdot "dotdot")
这款插件。这里我更多的是对于自己工作遇到问题的一个实验和总结理解，记录以备忘~^_^~。
## 参考 ##
[http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript](http://stackoverflow.com/questions/118241/calculate-text-width-with-javascript)
