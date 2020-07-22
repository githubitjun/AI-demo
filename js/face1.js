$(document).ready(function () {
	let video = document.getElementById('video');
	var canvas = document.getElementById('canvas');
	var canvas1 = document.getElementById('canvas1');
	var overlayDom = document.getElementById('overlay');
	//媒体对象
	var ctrack = new clm.tracker();
	ctrack.init();
	// 是否开启视频
	var trackingStarted = false;
	var faceFlag = 10; //11 眨眼睛 12摇头 13收集重组数据,
	var counter = 0;
	var lastTime = 0;
	var last_dis_eye_norse = 0;
	var last_nose_left = 0;
	var last_nose_top = 0;
	var last_DIF = 0;
	var DIF = 0;
	// 判断pc还是移动端
	if (
		navigator.userAgent.match(
			/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
		)
	) {
		$(document).ready(function () {
			// 移动端
			var video = document.getElementById('video');
			// 点击拍照
			$('#cc').click(function () {
				// var box = document.getElementsByClassName('eject_box')[0]
				// box.style.display = 'block'
				//  $("#aa").css("display", "block")
				//  $('#cc').css("display", "none")
				//  var widths = video.offsetWidth;
				//  var heights = widths*0.66;
				//  alert(widths + 'he ' + heights)
				event.stopPropagation();
			});
			$('.shade_face').click(function () {
				var box = document.getElementsByClassName('shade_face')[0];
				box.style.display = 'none';
			});
			$('.again_face').click(function () {
				var box = document.getElementsByClassName('shade_face')[0];
				box.style.display = 'none';
				// context.clearRect(0,0,c.width,c.height)  清除画布
			});
			$('.up_but').click(function () {
				var box = document.getElementsByClassName('shade_face')[0];
				// 保存并上传图片
				canvas = canvas.toDataURL('image/png');
				if (canvas) {
					// var blob = dataURLtoBlob(canvas);
					// var file = blobToFile(blob, "imgName");
					// console.info(file);
					box.style.display = 'none';
					canvas = canvas.toDataURL('');
				} else {
				}
			});
			//访问用户媒体设备的兼容方法
			function getUserMedia(constrains, success, error) {
				if (navigator.mediaDevices.getUserMedia) {
					//最新标准API
					navigator.mediaDevices
						.getUserMedia(constrains)
						.then(success)
						.catch(error);
				} else if (navigator.webkitGetUserMedia) {
					//webkit内核浏览器
					navigator.webkitGetUserMedia(constrains).then(success).catch(error);
				} else if (navigator.mozGetUserMedia) {
					//Firefox浏览器
					navagator.mozGetUserMedia(constrains).then(success).catch(error);
				} else if (navigator.getUserMedia) {
					//旧版API
					navigator.getUserMedia(constrains).then(success).catch(error);
				}
			}

			// var context = canvas1.getContext("2d");

			//成功的回调函数
			function success(stream) {
				//兼容webkit内核浏览器
				var CompatibleURL = window.URL || window.webkitURL;
				//将视频流设置为video元素的源
				video.src = CompatibleURL.createObjectURL(stream);
				//播放视频
				video.play();
			}

			//异常的回调函数
			function error(error) {
				console.log('访问用户媒体设备失败：', error.name, error.message);
			}
			// if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia){
			//   //调用用户媒体设备，访问摄像头
			//   getUserMedia({
			//       video:{facingMode: "user"}
			//   },success,error);
			// } else {
			//   alert("你的浏览器不支持访问用户媒体设备");
			// }

			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then((MediaStream) => {
					console.info(MediaStream);
					video.srcObject = MediaStream;
					video.play();
				})
				.catch((error) => {
					alert('你的浏览器不支持访问用户媒体设备');
				});
			//注册拍照按钮的单击事件
			document.getElementById('capture').addEventListener('click', function () {
				var video = document.getElementById('video');
				canvas.getContext('2d').drawImage(video, 0, 0, 640, 480);
				var image = new Image();
				image.id = 'pic';
				image.src = canvas.toDataURL();
				document.getElementById('image_for_crop1').appendChild(image);
				var box = document.getElementsByClassName('shade_face')[0];
				box.style.display = 'block';
			}); // 点击拍摄的时候
			//   document.getElementById("capture_paise").addEventListener("click",function(){
			//     $('#aa').css("display", "none")
			//     $('.facepc_box_header ')[0].innerHTML = '请眨眼'
			//     // $('.facepc_box_foot_title')[0].style.color="#fff"
			//     var num=8
			//     name = setInterval(function() {
			//     num--;
			//     if(num==0){
			//       // 走接口
			//       var box = document.getElementsByClassName('shade_face')[0]
			//       box.style.display = 'block'
			//       // 成功的时候跳转失败的时候打开拍照按钮
			//      $('#cc').css("display", "block")
			//     }
			//     if ( num == 4) {
			//       $('.facepc_box_header ')[0].innerHTML = '请摇头'
			//       // $('.facepc_box_foot_title')[0].style.color="#fff"
			//     }
			//     }, 1000);
			// });
			/**
			 * 将图片转为file格式
			 * @param {Object} dataurl 将拿到的base64的数据当做参数传递
			 */
			dataURLtoBlob = function (dataurl) {
				var arr = dataurl.split(','),
					mime = arr[0].match(/:(.*?);/)[1],
					bstr = atob(arr[1]),
					n = bstr.length,
					u8arr = new Uint8Array(n);
				while (n--) {
					u8arr[n] = bstr.charCodeAt(n);
				}
				return new Blob([u8arr], {
					type: mime,
				});
			};
			/**
			 *
			 * @param {Object} theBlob  文件
			 * @param {Object} fileName 文件名字
			 */
			blobToFile = function (theBlob, fileName) {
				theBlob.lastModifiedDate = new Date();
				theBlob.name = fileName;
				return theBlob;
			};
		});
	} else {
		//pc端
		// 点击拍照
		$('#cc').click(function () {
			// var box = document.getElementsByClassName('eject_box')[0]
			// box.style.display = 'block'
			$('#aa').css('display', 'block');
			event.stopPropagation();
		});
		//   重复拍照
		$('.facepc').click(function () {
			var box = document.getElementsByClassName('eject_box')[0];
			box.style.display = 'none';
		});
		//   重复拍照
		$('.again_face').click(function () {
			var box = document.getElementsByClassName('eject_box')[0];
			box.style.display = 'none';
		});
		//   图片上传
		$('.up_but').click(function () {
			var box = document.getElementsByClassName('eject_box')[0];
			box.style.display = 'none';
			// 保存并上传图片
			canvas1 = canvas1.toDataURL('image/png');
			if (canvas1) {
				// 这里把video删了
				// var m = document.getElementById("video");
				// m.parentNode.removeChild(m);
				var blob = dataURLtoBlob(canvas1);
				var file = blobToFile(blob, 'imgName');
				console.info(file);
				console.log('变量file：' + file);
			} else {
			}
		});
		navigator.mediaDevices
			.getUserMedia({
				video: {
					width: 544,
					height: 272,
				},
			})
			.then((MediaStream) => {
				console.info(MediaStream);
				video.srcObject = MediaStream;
				video.play();
				trackingStarted = true;
				ctrack.stop();
				ctrack.reset();
				ctrack.start(canvas1);
				drawLoop();
			})
			.catch((error) => {
				alert('你的浏览器不支持访问用户媒体设备');
				this.flag = false;
			});
		var shu = 4;
		function showTime() {
			var num = 10;
			var timeId;
			shu--;
			timeId = setInterval(function () {
				$('.ff')[0].innerHTML = num;
				num--;
				if (shu == 3) {
					faceFlag = 11;
					$('.facepc_box_header ')[0].innerHTML = '眨眼';
					video.play();
					trackingStarted = true;
					ctrack.stop();
					ctrack.reset();
					video.play();
					ctrack.start(video);
					drawLoop(); // 绘制人脸去判断是否摇头咋眼
					if (num == 0) {
						clearInterval(timeId);
						showTime();
					}
				} else if (shu == 2) {
					faceFlag = 12;
					video.play();
					trackingStarted = true;
					ctrack.stop();
					ctrack.reset();
					video.play();
					ctrack.start(video);
					$('.facepc_box_header ')[0].innerHTML = '请摇头';
					// drawLoop() // 绘制人脸去判断是否摇头咋眼
					if (num == 0) {
						clearInterval(timeId);
						showTime();
					}
				} else if (shu == 1) {
					faceFlag = 11;
					$('.facepc_box_header ')[0].innerHTML = '请眨眼';
					// drawLoop() // 绘制人脸去判断是否摇头咋眼
					if (num == 0) {
						clearInterval(timeId);
					}
				}
			}, 1000);
		}
		//注册拍照按钮的单击事件
		document.getElementById('capture').addEventListener('click', function () {
			canvas1.getContext('2d').drawImage(video, 0, 0, 200, 150);
			var image = new Image();
			image.id = 'pic';
			image.src = canvas1.toDataURL();
			document.getElementById('image_for_crop').appendChild(image);
			$('#cc').css('display', 'none');
			$('#dd').css('display', 'block');
			$('.facepc_box_header ')[0].innerHTML = '请微笑';
			showTime();
		});
		// 绘制人脸
		function drawLoop() {
			requestAnimFrame(drawLoop.bind(this));
			if (trackingStarted) {
				console.log(ctrack.getCurrentPosition());
				overlayDom
					.getContext('2d')
					.clearRect(
						0,
						0,
						canvas1.getContext('2d').width,
						canvas1.getContext('2d').height
					);
				// ctrack.getCurrentPosition()检测不到人脸时返回false，反之返回脸部72个坐标点
				if (ctrack.getCurrentPosition()) {
					// 绘制人脸
					ctrack.draw(canvas1);
					// drawface(ctrack.getCurrentPosition())
					positions = ctrack.getCurrentPosition() || [];
					// overlayoverlayCC.drawImage(video, 0, 0,vid_width, vid_height);
					// 摇头判断
					if (faceFlag == '11') {
						twinkle(ctrack.getCurrentPosition());
					} else if (faceFlag == '12') {
						shakeHead(ctrack.getCurrentPosition());
					} else if (faceFlag == '13') {
						// console.log(ctrack.getConvergence())
						// console.log(ctrack.getCurrentParameters())
						// return
						dataReconstitution(ctrack.getCurrentPosition());
					}
				}
			}
		}
		// 判断眨眼
		function twinkle(positions) {
			if (positions.length == 0) {
				return;
			}
			if (lastTime == 0 || new Date().getTime() - lastTime > 10) {
				var xdiff1 = positions[62][0] - positions[24][0];
				var ydiff1 = positions[62][1] - positions[24][1];
				// 计算出做左眼睛上眼皮中间点距离鼻尖的距离
				var dis_eye_norse1 = Math.pow(xdiff1 * xdiff1 + ydiff1 * ydiff1, 0.5);
				var xdiff2 = positions[62][0] - positions[29][0];
				var ydiff2 = positions[62][1] - positions[29][1];
				// 计算出做左眼睛上眼皮中间点距离鼻尖的距离
				var dis_eye_norse2 = Math.pow(xdiff2 * xdiff2 + ydiff2 * ydiff2, 0.5);
				// 计算出左右两个眼睛距离同一处鼻尖的距离之和
				var dis_eye_norse = dis_eye_norse1 + dis_eye_norse2;
				if (
					last_nose_left > 0 &&
					last_nose_top > 0 &&
					Math.abs(positions[62][0] - last_nose_left) < 0.5 &&
					Math.abs(positions[62][1] - last_nose_top) < 0.5
				) {
					//console.log(dis_eye_norse, last_dis_eye_norse, Math.abs(dis_eye_norse - last_dis_eye_norse), dis_eye_norse * 1 / 60)
					if (
						last_dis_eye_norse > 1 &&
						Math.abs(dis_eye_norse - last_dis_eye_norse) >
							(dis_eye_norse * 1) / 60
					) {
						console.log('眼睛验证通过');
						// getPhoto();
					}
				}
				last_nose_left = positions[62][0];
				last_nose_top = positions[62][1];
				last_dis_eye_norse = dis_eye_norse;
				lastTime = new Date().getTime();
			}
		}
		// 判断摇头
		function shakeHead(positions) {
			if (positions.length == 0) {
				return;
			}
			// 指定时间段内收集参数
			if (
				lastTime == 0 ||
				(new Date().getTime() - lastTime > 500 &&
					new Date().getTime() - lastTime < 10000)
			) {
				// console.log(positions[62][0])
				// 计算鼻尖和左边轮廓线中间点的水平差值
				var l_diff_x = positions[62][0] - positions[2][0];
				// 计算鼻尖和左边轮廓线中间点的垂直差值
				var l_diff_y = positions[62][1] - positions[2][1];
				// 计算鼻尖点与左边轮廓线中间点的距离
				var l_distance = Math.pow(
					l_diff_x * l_diff_x + l_diff_y * l_diff_y,
					0.5
				);
				// 计算鼻尖和右边轮廓线中间点的水平差值
				var r_diff_x = positions[12][0] - positions[62][0];
				// 计算鼻尖点和右边轮廓线中间点的垂直差值
				var r_diff_y = positions[12][1] - positions[62][1];
				// 计算鼻尖与右边轮廓线中间点的距离
				var r_distance = Math.pow(
					r_diff_x * r_diff_x + r_diff_y * r_diff_y,
					0.5
				);
				// 计算出左右轮廓线中间点的水平差值
				var lr_diff_x = positions[12][0] - positions[2][0];
				// 计算出左右轮廓线中间点的垂直差值
				var lr_diff_y = positions[12][1] - positions[2][1];
				// 计算出左右轮廓线两中间点的直线距离
				var lr_distance = Math.pow(
					lr_diff_x * lr_diff_x + lr_diff_y * lr_diff_y,
					0.5
				);
				// 计算出左右两轮廓线中间点距离鼻尖的差值
				var DIF = l_distance - r_distance;
				// if (Math.abs(DIF) > 2) {
				//     counter++
				// }
				if ((last_DIF > 0 && DIF < 0) || (last_DIF < 0 && DIF > 0)) {
					counter++;
				}
				//console.log(last_DIF, Math.abs(DIF), lr_distance / 6);
				// 验证是否摇头
				if (last_DIF > 1 && counter >= 1 && Math.abs(DIF) > lr_distance / 6) {
					console.log('摇头已验证通过');
					// getPhoto();
					counter = 0;
				}
				// 重置时间因素 记录当前数据为上一次的记录
				last_DIF = DIF;
				lastTime = new Date().getTime();
			}
		}
		/**
		 * 将图片转为file格式
		 * @param {Object} dataurl 将拿到的base64的数据当做参数传递
		 */
		dataURLtoBlob = function (dataurl) {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], {
				type: mime,
			});
		};
		/**
		 *
		 * @param {Object} theBlob  文件
		 * @param {Object} fileName 文件名字
		 */
		blobToFile = function (theBlob, fileName) {
			theBlob.lastModifiedDate = new Date();
			theBlob.name = fileName;
			return theBlob;
		};
	}
});
