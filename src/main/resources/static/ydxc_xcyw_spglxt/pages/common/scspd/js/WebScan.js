(function (window,undefined) {
	$.support.cors=true;
	var Result=function(code,msg,data){
		this.code=code;
		this.msg=msg;
		this.data=data;
	}
	function WebScan(options) {
		if(options.url=='' || options.url ==null ||options.url==undefined){
			WebScan.prototype.url="http://localhost:18989/WebScan/";
		}else{
			WebScan.prototype.url=options.url;
		}
		if(options.wsUrl==''||options.wsUrl==null||options.wsUrl==undefined){
			WebScan.prototype.wsUrl="http://localhost:28989";
		}else{
			WebScan.prototype.wsUrl=options.wsUrl;
		}
		WebScan.prototype.licence=options.licence;
		return WebScan.prototype;
	}
	WebScan.prototype = {
		constructor:WebScan,
		clientId:'',
		isInit:false,
		isInUse:false,
		callback:null,
		compressCallBack:null,
		/**
		 * 初始化
		 * @param {Object} pid 批次号
		 * @param {Object} callback 回调函数
		 */
		initSef:function(pid,callback){
			var that=this;
			jQuery.ajax({
				type:'post',
				url:this.url+"/getVersionInfo",
				dataType:'json',
				cache:false,
				data:{
					"licence":this.licence,
					"pid":pid
				},
				success:function(data){
					if(data.code==200){
						that.initSocketIo(data.data);
						that.clientId=data.data;
						that.isInit=true;
					}
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 获取设备
		 * @param {Object} callback 回调函数
		 */
		getDevices:function(callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/getDevices",
				cache:false,
				data:{
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 设置参数
		 * @param {Object} params 参数字符串
		 * @param {Object} callback 回调函数
		 */
		setParams:function(params,callback){
			jQuery.ajax({
				type:"post",
				url:this.url+"/setParams",
				cache:false,
				data:{
					"pid":this.clientId,
					"params":JSON.stringify(params)
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 追加授权
		 * @param {Object} licence 授权码
		 * @param {Object} callback 回调函数
		 */
		saveLicence:function(licence,callback){
			jQuery.ajax({
				type:"post",
				url:this.url+"/saveLicence",
				cache:false,
				data:{
					"pid":this.clientId,
					"licence":licence
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},

		/**
		 * 获取系统设置参数
		 * @param {Object} callback 回调函数
		 */
		getParams:function(callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/getParams",
				cache:false,
				data:{
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 获取序列号
		 * @param {Object} device 设备
		 * @param {Object} callback 回调函数
		 */
		getSerialNumber:function(device,callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/getSerialNumber",
				cache:false,
				data:{
					"device":device
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 获取系统路径
		 * @param {Object} parentPath 上级目录
		 * @param {Object} isDirectory 是否只显示文件夹
		 * @param {Object} callback 回调函数
		 */
		getFileExplore:function(parentPath,isDirectory,callback){
			jQuery.ajax({
				type:"get",
				url:this.url+"/getFilePath",
				data:{
					"parentPath":parentPath,
					"isDirectory":isDirectory
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 根据图像名称获取图像
		 * @param {Object} name 图像名称
		 * @param {Object} callback
		 */
		getImageByName:function(name,callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/image/getImageByName",
				cache:false,
				data:{
					"pid":this.clientId,
					"imageName":name
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 合成OFD
		 * @param {Object} isAuto 是否自动图像大小
		 * @param {Object} isDouble 是否双层
		 * @param {Object} callback 回调函数
		 * @param {Object} compressCallback 双层合车较慢，支持进度回调，回调函数
		 */
		majorOFD:function(isAuto,isDouble,callback,compressCallback){
			var formData={
				"isAuto":isAuto,
				"isDouble":isDouble,
				"pid":this.clientId
			};
			var that = this;
			jQuery.ajax({
				type:'post',
				url:this.url+"/majorOfd",
				cache:false,
				data:{
					"formDataString":JSON.stringify(formData)
				},
				success:function(data){
					callback(data);
					that.compressCallBack=compressCallback;
				},
				error:function(){
					var result = new Result(500,"网络错误",null)
					callback(result);
				}
			})
		},
		/**
		 * 合成PDF
		 * @param {Object} isDouble 是否双层
		 * @param {Object} callback 回调函数
		 */
		majorPDF:function(isDouble,callback){
			var formData={
				"pid":this.clientId,
				"isDouble":isDouble
			}
			jQuery.ajax({
				type:'post',
				url:this.url+"/majorPdf",
				cache:false,
				data:{
					"formDataString":JSON.stringify(formData)
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 合成docx
		 * @param {Object} isDouble 是否双层
		 * @param {Object} callback 回调函数
		 */
		majorDocx:function(callback,compressCallBack){
			var that = this;
			that.compressCallBack=compressCallBack;
			jQuery.ajax({
				type:'post',
				url:this.url+"/majorDocx",
				cache:false,
				data:{
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 上传图像
		 * @param {Object} uploadParam 上传参数对象
		 * @param {Object} callback 回调函数
		 */
		uploadImage:function(uploadParam,callback){
			uploadParam.pid=this.clientId;
			jQuery.ajax({
				type:'post',
				url:this.url+"/uploadImage",
				cache:false,
				data:{
					"formDataString":JSON.stringify(uploadParam)
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 根据索引获取图像
		 * @param {Object} startIndex 开始索引
		 * @param {Object} endIndex 结束索引
		 * @param {Object} callback 回调函数
		 */
		getBatchImage:function(startIndex,endIndex,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/image/getBatchImage",
				cache:false,
				data:{
					"pid":this.clientId,
					"startIndex":startIndex,
					"endIndex":endIndex
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 保存图像
		 * @param {Object} imageName 图像名称
		 * @param {Object} base64 图像的base64
		 * @param {Object} callback
		 */
		saveImage:function(imageName,base64,callback){
			jQuery.ajax({
				type:"post",
				url:this.url+'/image/saveImage',
				cache:false,
				data:{
					"pid":this.clientId,
					"imageName":imageName,
					"image":base64
				},success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 获取所有图像
		 * @param {Object} callback 回调函数
		 */
		getAllImages:function(callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/image/getImageByPid",
				cache:false,
				data:{
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 删除图像
		 * @param {Object} imageName 图像名称
		 * @param {Object} callback 回调函数
		 */
		deleteImage:function(imageName,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/image/deleteImage",
				cache:false,
				data:{
					"pid":this.clientId,
					"imageName":imageName
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 根据索引删除图像
		 * @param {Object} indexs 索引数组
		 * @param {Object} callback 回调函数
		 */
		deleteByIndexes:function(indexs,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/image/deleteByIndexes",
				cache:false,
				data:{
					"pid":this.clientId,
					"indexs":indexs
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 删除所有的图像
		 * @param {Object} callback
		 */
		deleteAllImage:function(callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/image/deleteAllImage",
				cache:false,
				data:{
					"pid":this.clientId,
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 拆分图像
		 * @param {Object} imageName 图像名称
		 * @param {Object} isHorizontal 水平|垂直
		 * @param {Object} x1 坐标起始点X轴
		 * @param {Object} y1 坐标起始点Y轴
		 * @param {Object} x2 坐标终止点X轴
		 * @param {Object} y2 坐标终止点Y轴
		 * @param {Object} callback 回调函数
		 */
		split:function(imageName,isHorizontal,x1,y1,x2,y2,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/image/split",
				cache:false,
				data:{
					"pid":this.clientId,
					"imageName":imageName,
					"isHorizontal":isHorizontal,
					"x1":parseInt(x1),
					"y1":parseInt(y1),
					"x2":parseInt(x2),
					"y2":parseInt(y2)
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 合并图像
		 * @param {Object} isHorizontal 水平|垂直
		 * @param {Object} indexs 图像索引
		 * @param {Object} callback 回调函数
		 */
		merge:function(isHorizontal,indexs,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/image/mergeHorizontal",
				cache:false,
				data:{
					"pid":this.clientId,
					"isHorizontal":isHorizontal,
					"indexs":indexs
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 获取最后一个批次
		 * @param {Object} callback 回调函数
		 */
		getLastBatch:function(callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/getLastBatch",
				cache:false,
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 开始扫描
		 * @param {Object} callback 回调函数
		 * @param {Object} scanData 扫描参数
		 */
		startScan:function(callback,scanData){
			if(this.isInUse==true){
				return new Result(500,"设备使用中",null)
			}
			if(this.SocketClient!=null && this.SocketClient!=undefined){
				this.SocketClient.emit('scan',JSON.stringify(scanData));
				this.callback=callback;
				this.isInUse=true;
				return new Result(200,"开启成功",null);
			}else{
				return new Result(500,"连接失败",null)
			}
		},
		/**
		 * 初始化socketIO
		 * @param {Object} id 批次ID
		 */
		initSocketIo:function(id){
			var transports=[];
			if(typeof(WebSocket)!=="undefined"){
				transports=['websocket'];
			}else{
				transports=['polling'];
			}
			this.SocketClient=io.connect(this.wsUrl+"?id="+id,{
				transports:transports,
				rejectUnauthorized: false
			});
			var that=this;
			if(this.SocketClient!=null && this.SocketClient!=undefined){
				this.SocketClient.on("error",function(data){
					if(that.callback!=null && that.callback !=undefined){
						var result={"code":500,"msg":data};
						that.callback(result);
					}
					that.isInUse=false;
				});
				this.SocketClient.on("success",function(data){
					if(that.callback!=null && that.callback !=undefined){
						var result={"code":200,"msg":data};
						that.callback(result);
					}
					that.isInUse=false;
				});
				this.SocketClient.on("image",function(data){
					if(that.callback!=null && that.callback !=undefined){
						that.callback(data);
					}
				});
				this.SocketClient.on("result",function(data){
					if(that.callback!=null && that.callback !=undefined){
						that.callback(data);
					}
					that.isInUse=false;
				});
				this.SocketClient.on("connect_error",function(){
					return new Result(500,"初始化连接服务失败");
				});
				this.SocketClient.on('compress_process',function(data){
					if(that.compressCallBack!=null && that.compressCallBack !=undefined){
						that.compressCallBack(data);
					}
				})
			}
		},
		/**
		 * 获取批次ID
		 */
		getClientId:function(){
			return this.clientId;
		},
		/**
		 * 设置批次ID,重新连接socketIO
		 * @param {Object} pid
		 */
		setClientId:function(pid){
			if(this.clientId!=pid){
				this.SocketClient.disconnect()
				this.clientId=pid;
				this.initSocketIo(pid);
			}
		},
		/**
		 * 更改图像位置
		 * @param {Object} oldIndex 原索引
		 * @param {Object} newIndex 新索引
		 * @param {Object} callback 回调函数
		 */
		changeIndex:function(oldIndex,newIndex,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/image/changeIndex",
				cache:false,
				data:{
					"pid":this.clientId,
					"oldIndex":oldIndex,
					"newIndex":newIndex
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 骑订排序
		 * @param {Object} mode 模式
		 * @param {Object} callback 回调函数
		 */
		sortImage:function(mode,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/image/sortImage",
				cache:false,
				data:{
					"pid":this.clientId,
					"mode":mode
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 获取所有已授权限
		 * @param callback 回调函数
		 */
		getPermission:function(callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/custom/getPermission",
				cache:false,
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 合成ZIP
		 * @param {Object} callback
		 */
		majorZip:function(callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/downLoadZip",
				cache:false,
				data:{
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 生成多页tiff
		 * @param callback 回调函数，返回tiff文件的base64
		 */
		majorTiff:function(callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/majorTiff",
				cache:false,
				data:{
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 多个图像合成文档
		 * @param images 图片名称
		 * @param type 文档类型,0:pdf,1:ofd,2:tiff
		 * @param callback 回调函数,返回tiff文件的base64
		 */
		majorMuiltyDoc:function(images,type,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/createMuityDoc",
				cache:false,
				data:{
					"imageNames":images,
					"type":type,
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 下一张图像
		 * @param {Object} imageName 当前图像名称
		 * @param {Object} callback
		 */
		next:function(imageName,callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/image/nextImage",
				cache:false,
				data:{
					"imageName":imageName,
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 前一张图像
		 * @param {Object} imageName 当前图像名称
		 * @param {Object} callback
		 */
		pre:function(imageName,callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/image/preImage",
				cache:false,
				data:{
					"imageName":imageName,
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 通过http上传单张图像
		 * @param {Object} imageName 图像名称
		 * @param {Object} url 图像地址
		 * @param {Object} fileName 接受文件参数名称
		 * @param {Object} httpMethod HTTP方法
		 * @param {Object} header 头
		 * @param {Object} params 额外参数
		 * @param {Object} type 文件格式，1:PDF或0:OFD 
		 * @param {Object} callback
		 */
		uploadOneImageByHttp:function(imageName,url,fileName,httpMethod,header,params,type,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/image/uploadOneByHttp",
				cache:false,
				data:{
					"pid":this.clientId,
					"imageName":imageName,
					"url":url,
					"fileName":fileName,
					"httpMethod":httpMethod,
					"header":header,
					"params":params,
					"type":type
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 通过Zxing获取图像的二维码信息(不保证质量)
		 * @param {Object} imageName 图像名称
		 * @param {Object} callback
		 */
		getQrCode:function(imageName,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/ocr/getQrCode",
				cache:false,
				data:{
					"pid":this.clientId,
					"imageName":imageName
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					var result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 根据文件名称识别图像返回json
		 * @param {Object} callback
		 * @param {Object} imageName 图像名称
		 */
		recognize:function(imageName,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/ocr/recognizeForJson",
				cache:false,
				data:{
					"imageName":imageName,
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 根据文件名称识别图像返回string
		 * @param {Object} imageName 文件名称
		 * @param {Object} callback
		 */
		recognizeImage:function(imageName,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/ocr/recognizeImage",
				cache:false,
				data:{
					"imageName":imageName,
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 区域识别
		 * @param {Object} imageName 文件名称
		 * @param {Object} left 左上角X轴坐标
		 * @param {Object} top 左上角Y轴坐标
		 * @param {Object} right 右上角X轴坐标
		 * @param {Object} bottom 右上角Y轴坐标
		 * @param {Object} callback
		 */
		recognizeRegion:function(imageName,left,top,right,bottom,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/ocr/recognizeRegion",
				cache:false,
				data:{
					"imageName":imageName,
					"left":left,
					"top" : top,
					"right" : right,
					"bottom" : bottom,
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 区域识别
		 * @param {Object} imageName 文件名称
		 * @param {Object} left 左上角X轴坐标
		 * @param {Object} top 左上角Y轴坐标
		 * @param {Object} right 右上角X轴坐标
		 * @param {Object} bottom 右上角Y轴坐标
		 * @param {Object} callback
		 */
		recognizeRegionText:function(imageName,left,top,right,bottom,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/ocr/recognizeRegionText",
				cache:false,
				data:{
					"imageName":imageName,
					"left":left,
					"top" : top,
					"right" : right,
					"bottom" : bottom,
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 公文关键字段提取
		 * @param {Object} imageName 图像名称
		 * @param {Object} callback
		 */
		extractText:function(imageName,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/ocr/extractTextByImageName",
				cache:false,
				data:{
					"imageName":imageName,
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 清空授权
		 * @param {Object} callback
		 */
		clearLicence:function(callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/clearLicence",
				cache:false,
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 设置日志级别
		 * @param {Object} level DEBUG、INFO、WARN、ERROR
		 * @param {Object} callback
		 */
		setLogLevel:function(level,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/log/setLevel",
				cache:false,
				data:{
					"level":level
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 获取系统当前日志级别
		 * @param {Object} callback
		 */
		getLogLevel:function(callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/log/getLevel",
				cache:false,
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 旋转图像
		 * @param {Object} imageName 图像名称
		 * @param {Object} angle 角度
		 * @param {Object} callback
		 */
		rotate:function(imageName,angle,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/image/rotate",
				cache:false,
				data:{
					"imageName":imageName,
					"angle":angle,
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		downloadLogs:function(){
			window.location.href=this.url+"/log/downloadLogs";
		},
		extractByImageName:function(imageName,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/ocr/extractTextByImageName",
				cache:false,
				data:{
					"imageName":imageName,
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 加载模板
		 * @param {Object} callback 回调函数
		 */
		loadModels:function(callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/model/modelList",
				cache:false,
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		/**
		 * 加载模板
		 * @param id 模板ID
		 * @param {Object} callback 回调函数
		 */
		loadModelById:function(id,callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/model/modelById",
				cache:false,
				data:{
					"id":id
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		addModel:function(name,value,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/model/addModel",
				cache:false,
				data:{
					"name":name,
					"value":value
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		deleteModel:function(id,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/model/deleteModel",
				cache:false,
				data:{
					"id":id
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		editModel:function(id,name,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/model/editModel",
				cache:false,
				data:{
					"id":id,
					"name":name
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		extractImageByPid:function(callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/ocr/extractImageByPid",
				cache:false,
				data:{
					"pid":this.clientId,
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		getSystemValue:function(code,callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/custom/getSystemValue",
				cache:false,
				data:{
					"code":code
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		setSystemValue:function(code,value,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/custom/saveSystemValue",
				cache:false,
				data:{
					"code":code,
					"value":value
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		writeOfd:function(name,callback,saveOfdCallback){
			var that = this;
			jQuery.ajax({
				type:'post',
				url:this.url+"/custom/writeOfd",
				cache:false,
				data:{
					"name":name,
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
					that.compressCallBack=saveOfdCallback;
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		getTodayOfd:function(callback){
			jQuery.ajax({
				type:'get',
				url:this.url+"/custom/getTodayOfd",
				cache:false,
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		getTableLocation:function(imageName,callback){
			jQuery.ajax({
				type:'post',
				url:this.url+"/ocr/getTableLocationByPid",
				cache:false,
				data:{
					"imageName":imageName,
					"pid":this.clientId
				},
				success:function(data){
					callback(data);
				},
				error:function(){
					result = new Result(500,"网络错误",null);
					callback(result);
				}
			})
		},
		
	};
	window.WebScan = WebScan;
})(window);