> # PaintWeb #

* 官網：https://code.google.com/p/paintweb/
* Demo：http://mihai.sucan.ro/paintweb/trunk/demos/demo1.html


優缺點
======

Pros
----

* 理論上擴充性的部份設計的不錯
	* 可以改 layout
	* 有考慮多國語系
* 有提供 `.xhrLoad()` 把資料寫回 server 的 method


Cons
----

* 過了四五年都沒實質更新
* 小畫家等級的功能，連 layer 都沒有
* 操作方式有點... 詭異，尤其是「文字」的功能 ＝＝"


Trace & Rebuild
===============

`/build` 的版本簡稱 build 版，`/src` 的版本簡稱 source 版。
以結果回推（不要叫我去 trace `Makefile` 我會翻臉... :u7981:），
build 版是對 source 版做下列的動作：

* 把 `/includes/lib.js`、`/tools/*.js` 都塞進 `paintweb.js` 變成 build 版的 `paintweb.src.js`
* `/interfaces/default/script.js` 應該也有進 `paintweb.src.js`
* `/interfaces/default/layout.xhtml` 好像是壓成一個字串塞進某個用到的 js 檔當中做 catch
* 最後會把 `paintweb.src.js` 精簡化之後壓成一行字變成 build 版的 `paintweb.js`

build 版的好處是檔案較小、對 web server 負擔較小，但是如果要 trace 或是改 code 就... 呵呵... 呵呵呵呵... [死]；
layout 也找不到好方法（根本不想找... [逃]）動態改。
source 版就剛好相反，檔案又多又長，但是比較能 trace，直接對 `layout.xhtml` 動手就可以看到結果。


使用 source 版的方式
---------------------
參考 d12de2e4fe2fe2d26d66d95719bb52a8f3bb89dd，這裡只提幾個重點

* host page 除了 `paintweb.js` 之外也要掛 `/includes/lib.js`。
* 不必要的東西：
	* /extensions/moodel.js
	* /includes/debug.js 
	* /includes/json2.js（這年頭還有瀏覽器不能處理 json 也蠻嚇人的）
	* /interfaces/default/icons
	* /interfaces/default/images
	
當然這邊也點出了另一個問題，為什麼連 source 版都不需要圖檔？
只能說那些圖檔應該已經變成 base64 塞在某個 js 裡頭了...... [遠目]


貼士跟貼土（？）
================
