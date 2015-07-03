pwlib.tools.arrow = function(app) {
	var _self = this, 
		clearInterval = app.win.clearInterval, 
		config = app.config, 
		context = app.buffer.context, 
		gui = app.gui, 
		image = app.image, 
		mouse = app.mouse, 
		setInterval = app.win.setInterval;
	
	var timer = null;
	var needsRedraw = false;
	var x0 = 0;
	var y0 = 0;
	
	this.activate = function() {
		for (var i = 0; i < 360; i = i + 45) {
			var func = this.setDegree(i); 
			app.commandRegister("arrow" + i, func);
		}
	};
	
	//closure 不太會用，只 try 出這種寫法  (艸
	this.setDegree = function(degree) {
		return function() {
			gui.inputs.arrowDegree.value = degree;	
		};
	};
	
	this.deactivate = function() {
		if (timer) {
			clearInterval(timer);
			timer = null;
		}

		if (mouse.buttonDown) {
			context.clearRect(0, 0, image.width, image.height);
		}

		needsRedraw = false;
	};

	this.mousedown = function(ev) {
		x0 = mouse.x;
		y0 = mouse.y;
		
		if (!timer) {
			timer = setInterval(_self.draw, config.toolDrawDelay);
		}
		
		needsRedraw = false;

		return true;
	};

	this.mousemove = function(ev) {
		needsRedraw = true;
	};

	this.draw = function() {
		if (!needsRedraw) {
			return;
		}
				
		//箭頭參數區
		var degree = gui.inputs.arrowDegree.value,
			rx1 = 1,
			rx2 = gui.inputs.arrowBodyLength.value * 1,	//要先 * 1 不然後面運算會不正確
			ry1 = 1,
			ry2 = gui.inputs.arrowHeadWidth.value * 1;

		var startX = Math.min(mouse.x, x0),
			startY = Math.min(mouse.y, y0),
			endX = Math.max(mouse.x, x0), 
			endY = Math.max(mouse.y, y0), 
			w = endX - startX, 
			h = endY - startY,
			tx = (endX + startX) / 2,
			ty = (endY + startY) / 2,
			points = [];
		
		if (!w || !h) {
			needsRedraw = false;
			return;
		}

		/*
		 * 當箭頭朝下（degree = 90）或是朝上（degree = 270），若使用箭頭朝右的座標做旋轉，
		 * 會導致增加移動向量的 x 分量，實質上是造成箭頭體積於 y 分量的增加。
		 * 這不符合人類預期的操作，所以當 degree 在 (45, 135) 跟 (225, 315) 區間時，
		 * 使用另外一個箭頭的座標組。
		 */
		if ((degree > 45 && degree < 135) || (degree > 225 && degree < 315)) {
			var x2 = h * rx2 / (rx1 + rx2),
				y2 = w * ry2 / (ry1 + ry2) / 2;
			points.push([(endX + startX) / 2, endY]);	//A
			points.push([endX, startY + x2]);	//B1
			points.push([endX - y2, startY + x2]);	//B2
			points.push([endX - y2, startY]);	//C1
			points.push([startX + y2, startY]);	//C2
			points.push([startX + y2, startY + x2]);	//B3
			points.push([startX, startY + x2]);	//B4
			degree = degree - 90;	//修正 rotate 的角度
		} else {			
			var x2 = w * rx2 / (rx1 + rx2),
				y2 = h * ry2 / (ry1 + ry2) / 2;
			points.push([endX, (endY + startY) / 2]);	//A
			points.push([startX + x2, startY]);	//B1
			points.push([startX + x2, startY + y2]);	//B2
			points.push([startX, startY + y2]);	//C1
			points.push([startX, endY - y2]);	//C2
			points.push([startX + x2, endY - y2]);	//B3
			points.push([startX + x2, endY]);	//B4
		}

		//把 degree 轉換成弳度
		degree = degree * Math.PI / 180;
		
		//先把三角函數算好
		var sinD = Math.sin(degree),
			cosD = Math.cos(degree);

		// ==== 繪圖開始 ==== //
		context.clearRect(0, 0, image.width, image.height);
		
		//因為有 degree 要做旋轉、然後又得以人類的感覺方式旋轉，所以只能自己給 transform matrix
		context.transform(
			cosD, sinD, 
			-sinD, cosD, 
			tx * (1 - cosD)+ ty * sinD, ty * (1 - cosD) - tx * sinD
		);

		context.beginPath();
		context.moveTo(points[0][0], points[0][1]);
		
		for (var i = 0; i < points.length; i++) {
			context.lineTo(points[i][0], points[i][1]);
		}
		
		if (config.shapeType != 'stroke') {
			context.fill();
		}
		
		if (config.shapeType != 'fill') {
			context.stroke();
		}
		
		context.closePath();
		
		//把 transform matrix 設回正常的樣子以免妨礙其他 tool
		context.setTransform(1, 0, 0, 1, 0, 0);
		
		needsRedraw = false;
	};
	
	this.mouseup = function(ev) {
		// Allow click+mousemove, not only mousedown+move+up
		if (mouse.x == x0 && mouse.y == y0) {
			mouse.buttonDown = true;
			return true;
		}

		if (timer) {
			clearInterval(timer);
			timer = null;
		}

		_self.draw();
		app.layerUpdate();
		
		gui.statusShow('arrowActive');

		return true;
	};

	this.keydown = function(ev) {
		if (!mouse.buttonDown || ev.kid_ != 'Escape') {
			return false;
		}

		if (timer) {
			clearInterval(timer);
			timer = null;
		}

		context.clearRect(0, 0, image.width, image.height);
		mouse.buttonDown = false;
		needsRedraw = false;

		gui.statusShow('arrowActive');

		return true;
	};
};
