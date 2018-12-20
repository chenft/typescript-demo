# TypeScript

TypeScript 只会进行静态检查，如果发现有错误，编译的时候就会报错。

## 语法特性

- 类 Classes
- 接口
- 模块
- 类型注解
- 编译时类型检查
- Arrow 函数

### 可选参数

```js
function buildName(firstName: string, lastName?: string): string {
  if (lastName) return firstName + ' ' + lastName;
  else return firstName;
}

let result1 = buildName('Bob'); // works correctly now
let result3 = buildName('Bob', 'Adams'); // ah, just right
console.log(result1);
console.log(result3);
```

在构造函数里访问 this 的属性之前，一定要先调用 super()

### private

当成员被标记成 private 时，它就不能在声明它的类的外部访问

### protected

protected 修饰符与 private 修饰符的行为很相似，但有一点不同， protected 成员在派生类中仍然可以访问

### static

属性存在于类本身上面而不是类的实例上

```js
class Grid {
  static origin = {x: 0, y: 0};
  calculateDistanceFromOrigin(point: {x: number; y: number;}) {
    let xDist = (point.x - Grid.origin.x);
    let yDist = (point.y - Grid.origin.y);
    return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
  }
  constructor (public scale: number) { }
}
```

##

T 帮助我们捕获用户传入的类型（比如：number）

```js
function identity<T>(arg: T): T {
  return arg;
}
```

### 类型推论

变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型

```js
let something;
something = 'seven';
something = 7;
something.setName('Tom');
```

如果没有明确的指定类型，那么 TypeScript 会依照类型推论（Type Inference）的规则推断出一个类型。

```js
let myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

### 联合类型

联合类型使用 | 分隔每个类型

```js
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
myFavoriteNumber = true;
// index.ts(2,1): error TS2322: Type 'boolean' is not assignable to type 'string | number'.
//   Type 'boolean' is not assignable to type 'number'.
```

这里的 let myFavoriteNumber: string | number 的含义是，允许 myFavoriteNumber 的类型是 string 或者 number，但是不能是其他类型。

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型里共有的属性或方法：

```js
function getLength(something: string | number): number {
  return something.length;
}
// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```

联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型：

```js
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
console.log(myFavoriteNumber.length); // 编译时报错
// index.ts(5,30): error TS2339: Property 'length' does not exist on type 'number'.
```

### 接口

#### 任意属性

一旦定义了任意属性，那么确定属性和可选属性都必须是它的子属性

```js
interface Person {
  name: string;
  age?: number;
  [propName: string]: any;
}

let tom: Person = {
  name: 'Tom',
  gender: 'male'
};
```

### 只读属性

对象中的一些字段只能在创建的时候被赋值，那么可以用 readonly 定义只读属性。
只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候

```js
interface Person {
  readonly id: number;
  name: string;
  age?: number;
  [propName: string]: any;
}

let tom: Person = {
  name: 'Tom',
  gender: 'male'
};

tom.id = 89757;

// index.ts(8,5): error TS2322: Type '{ name: string; gender: string; }' is not assignable to type 'Person'.
//   Property 'id' is missing in type '{ name: string; gender: string; }'.
// index.ts(13,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

### 函数重载

TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

```js
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  }
}
```

### 类型断言

手动指定一个值的类型，在需要断言的变量前加上 <Type> 即可

```
<type>value

value as type
```

```js
function getLength(something: string | number): number {
  if ((<string>something).length) {
    return (<string>something).length;
  } else {
    return something.toString().length;
  }
}
```

类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的

```js
function toBoolean(something: string | number): boolean {
  return <boolean>something;
}
// index.ts(2,10): error TS2352: Type 'string | number' cannot be converted to type 'boolean'.
//   Type 'number' is not comparable to type 'boolean'.
```

### 声明文件

当使用第三方库时，我们需要引用它的声明文件

#### 声明语句

```js
declare var jQuery: (selector: string) => any;
jQuery('#foo');
```

#### 声明文件

通常我们会把类型声明放到一个单独的文件中，这就是声明文件。

```js
// jQuery.d.ts
declare var jQuery: string => any;
```

我们约定声明文件以 .d.ts 为后缀，然后在使用到的文件的开头，用「三斜线指令」表示引用了声明文件：

```js
/// <reference path="./jQuery.d.ts" />
jQuery('#foo');
```

#### 第三方声明文件

推荐使用 @types 来管理, eg: @types/lodash

### 类型别名

类型别名用来给一个类型起个新名字。类型别名常用于联合类型。类型别名与字符串字面量类型都是使用 type 进行定义。

```js
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === 'string') {
    return n;
  } else {
    return n();
  }
}
```

### 字符串字面量类型

字符串字面量类型用来约束取值只能是某几个字符串中的一个。类型别名与字符串字面量类型都是使用 type 进行定义。

```js
type EventNames = 'click' | 'scroll' | 'mousemove';
function handleEvent(ele: Element, event: EventNames) {
  // do something
}
handleEvent(document.getElementById('hello'), 'scroll'); // 没问题
handleEvent(document.getElementById('world'), 'dbclick'); // 报错，event 不能为 'dbclick'
```

### 元组

数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象

```js
let xcatliu: [string, number];
xcatliu = ['Xcat Liu', 25];
```

```js
let xcatliu: [string, number];
xcatliu[0] = 'Xcat Liu';
xcatliu[1] = 25;
```

当直接对元组类型的变量进行初始化或者赋值的时候，需要提供所有元组类型中指定的项

```js
let xcatliu: [string, number] = ['Xcat Liu'];
// index.ts(1,5): error TS2322: Type '[string]' is not assignable to type '[string, number]'.
//   Property '1' is missing in type '[string]'.
```

#### 当添加越界的元素时，它的类型会被限制为元组中每个类型的联合类型

```js
let xcatliu: [string, number];
xcatliu = ['Xcat Liu', 25];
xcatliu.push('http://xcatliu.com/');
xcatliu.push(true);

// index.ts(4,14): error TS2345: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
//   Type 'boolean' is not assignable to type 'number'.
```

### 混合类型

可以使用接口的方式来定义一个函数需要符合的形状

```js
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  return source.search(subString) !== -1;
};
```

有时候，一个函数还可以有自己的属性和方法

```js
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}
let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

### 范型

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性。
我们在函数名后添加了 <T>，其中 T 用来指代任意输入的类型，在后面的输入 value: T 和输出 Array<T> 中即可使用了。在调用的时候，可以指定它具体的类型为 string

```js
function createArray<T>(length: number, value: T): Array<T> {
  let result: T[] = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}

createArray < string > (3, 'x'); // ['x', 'x', 'x']
```

#### 多个类型参数

```js
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

#### 范型约束

对泛型进行约束，只允许这个函数传入那些包含 某些属性的变量

```js
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```

### 声明合并

#### 函数的合并

重载

#### 接口的合并

合并的属性的类型必须是一致的

```js
interface Alarm {
  price: number;
}
interface Alarm {
  weight: number;
}

interface Alarm {
  price: number;
  weight: number;
}
```
