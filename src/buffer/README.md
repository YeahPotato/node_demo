#### 实现buffer的split方法
```javascript
Buffer.prototype.split=Buffer.prototype.split||function (b){
  let arr=[];

  let cur=0;
  let n=0;
  while((n=this.indexOf(b, cur))!=-1){
    arr.push(this.slice(cur, n));
    cur=n+b.length;
  }

  arr.push(this.slice(cur));

  return arr;
};

```



#### 文件数据解析过程

------WebKitFormBoundaryDqs4grRjEIPy5ZmY
Content-Disposition: form-data; name="user"

blue
------WebKitFormBoundaryDqs4grRjEIPy5ZmY
Content-Disposition: form-data; name="pass"

asdfasdf
------WebKitFormBoundaryDqs4grRjEIPy5ZmY
Content-Disposition: form-data; name="f1"; filename="a.txt"
Content-Type: text/plain

aaa
bbb
ccccccc
------WebKitFormBoundaryDqs4grRjEIPy5ZmY--

<hr>

<分隔符>
Content-Disposition: form-data; name="user"

blue
<分隔符>
Content-Disposition: form-data; name="pass"

asdfasdf
<分隔符>
Content-Disposition: form-data; name="f1"; filename="a.txt"
Content-Type: text/plain

aaa
bbb
ccccccc
<分隔符>--

<hr>

<分隔符>\r\n
Content-Disposition: form-data; name="user"\r\n
\r\n
blue\r\n
<分隔符>\r\n
Content-Disposition: form-data; name="pass"\r\n
\r\n
asdfasdf\r\n
<分隔符>\r\n
Content-Disposition: form-data; name="f1"; filename="a.txt"\r\n
Content-Type: text/plain\r\n
\r\n
<文件内容>\r\n
<分隔符>--

<hr>

<分隔符>\r\n数据描述\r\n\r\n数据值\r\n
<分隔符>\r\n数据描述\r\n\r\n数据值\r\n
<分隔符>\r\n数据描述1\r\n数据描述2\r\n\r\n<文件内容>\r\n
<分隔符>--

<hr>

解析数据：

- 用"<分隔符>"切开数据
[
  空,
  \r\n数据描述\r\n\r\n数据值\r\n,
  \r\n数据描述\r\n\r\n数据值\r\n,
  \r\n数据描述1\r\n数据描述2\r\n\r\n<文件内容>\r\n,
  --\r\n
]
- 丢弃头尾元素
[
  \r\n数据描述\r\n\r\n数据值\r\n,
  \r\n数据描述\r\n\r\n数据值\r\n,
  \r\n数据描述1\r\n数据描述2\r\n\r\n<文件内容>\r\n,
]
- 丢弃每一项的头尾\r\n
[
  数据描述\r\n\r\n数据值,
  数据描述\r\n\r\n数据值,
  数据描述1\r\n数据描述2\r\n\r\n<文件内容>,
]
- 用第一次出现的"\r\n\r\n"切分
  普通数据：[数据描述, 数据值]
  或
  文件数据：[数据描述1\r\n数据描述2, <文件内容>]
- 判断描述的里面有没有"\r\n"
  有——文件数据：[数据描述1\r\n数据描述2, <文件内容>]
  没有——普通数据：[数据描述, 数据值]
- 分析"数据描述"