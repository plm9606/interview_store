## timer

타이머 콜백은 지정 시간 후에 가능한 빨리 실행된다. 하지만 운영 체제 예약 또는 다른 콜백 실행으로 인해 지연 될 수 있다.
poll phase에 의해서 타이머 콜백이 실행되는 시기가 결정된다.

예를 들어 100ms 임계값 이후에 실행되는 타임아웃을 걸고, 파일 읽기는 95ms가 걸린다고 해본다.

```js
const fs = require("fs");

function someAsyncOperation(callback) {
  // Assume this takes 95ms to complete
  fs.readFile("/path/to/file", callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);

// do someAsyncOperation which takes 95 ms to complete
someAsyncOperation(() => {
  const startCallback = Date.now();

  // do something that will take 10ms...
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
});
```

이벤트 루프가 poll phase에 진입했을 readFile()이 아직 완료되지 않았기 때문에 때 큐는 비어있다. 그래서 이벤트 루프는 수 ms동안 가장 빠른 타이머의 임계값에 도달할 때 까지 기다린다. 95ms후 readFile()은 파일 읽기를 끝내고 완료하는데 10ms가 걸리는 readFile()의 콜백은 poll 큐에 추가되고 실행된다. 콜백 실행이 끝나면 poll큐에는 더이상 남은 콜백함수가 없기 때문에 이벤트 루프는 가장 빠른 타이머의 임계값에 도달했음을 확인 한 후, timers phase로 돌아가 타이머의 콜백을 실행하게 된다.

여기서 setTimeout의 콜백이 95+10=105ms 이후에 실행된 것을 알 수 있다. 정확히 100ms 이후에 콜백이 실행되는 것이 아니다.

## pending callbacks

이 phase는 TCP에러와 같은 일부 시스템 작업에 대한 콜백을 실행한다. 예를 들어 만약 TCP 소켓이 ECONNREFUSED 를 받으면 몇몇 시스템에게 오류를 리포팅하기 위해 pendign callbacks에 추가된다.

## poll

poll phase는 두가지의 메인 기능이 있다.

1. IO를 위해 block하고 poll해야하는 시간을 계산하고
2. poll 큐에 이벤트를 생성한다.

이벤트 루프가 poll phase에 들어갔는데 스케줄된 timer가 없으면 다음 두가지 중 하나가 발생한다.

- 만약 poll 큐가 차있는 경우
  - 이벤트 루프는 큐를 돌면서 콜백을 동기적으로 실행한다. 큐를 모두 비우거나 실행 제한 횟수까지 돌릴 때 까지.
- poll 큐가 비어있는 경우
  - 스크립트가 `setImmediate()`에 의해 예약되어있는 경우
    - 이벤트 루프는 poll phase를 나와 check phase로 진입해 명령을 실행
  - `setImmediate()` 명령이 없는 경우
    - 이벤트 루프는 poll 큐에 콜백이 추가되기를 기다렸다가 바로 콜백을 실행한다.

일단 poll 큐가 비게 되면 이벤트 루프는 timers phase를 체크해 가장 가까운 시일 내의 타이머가 무엇인지 체크한다. 만약 타이머가 1개 이상 준비가 되었다면, 이벤트 루프는 timers phase로 돌아가서 타이머 콜백을 실행한다.

## check

poll phase가 완료된 후에 콜백을 check phase에 있는 콜백을 즉시 실행한다. 만약 poll phase가 비어있고 스크립트가 `setImmediate()`로 큐에 추가된 경우 이벤트 루프틑 check phase에서 작업을 진행한다.

`setImmediate()`는 이벤트 루프에서 timers가 아닌 별도의 phase에서 실행되는 특별한 타이머이다. poll phase가 완료된 후 실행할 콜백을 예약하는 libuv api를 사용한다.

보통 코드가 실행되면 이벤트 루프는 poll phase에 도달하게 된다. 하지만 콜백이 `setImmediate()`로 예약되어 있고 poll 큐가 비어있으면, poll큐를 기다리는 대신 poll phase는 끝나고 check phase가 진행된다.

### setImmediate() vs setTimeout()

`setImmediate()`와 `setTimeout()`는 비슷하지만 호출시기에 따라서 다른 방식으로 작동한다.

- `setImmediate()`: 현재 poll phase가 완료되면 실행된다
- `setTimeout()`: 설정된 시간이 경과한 후에 스크립트가 실행되도록 예약한다.

만약 두 함수 모두 메인 모듀에서 호출되었다면, 타이밍은 프로세스 성능에 의해 결정된다. 예를들어 만약 다음과 같은 스크립트를 실행한다면 두 타이머의 실행 순서는 딱 정해지지 않는다.

```js
// timeout_vs_immediate.js
setTimeout(() => {
  console.log('timeout');
}, 0);

setImmediate(() => {
  console.log('immediate');
});

---

$ node timeout_vs_immediate.js
timeout
immediate

$ node timeout_vs_immediate.js
immediate
timeout
```

하지만 IO처리를 하는 함수가 내부에 있다면 immediate 콜백이 항상 먼저 실행된다.

```js
// timeout_vs_immediate.js
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('timeout');
  }, 0);
  setImmediate(() => {
    console.log('immediate');
  });
});

---

$ node timeout_vs_immediate.js
immediate
timeout

$ node timeout_vs_immediate.js
immediate
timeout
```

## process.nextTick()

process.nextTick()이 비동기 api임에도 다이어그램에 포함되어있지 않다. 그 이유는 process.nextTick()이 이벤트 루프의 일부가 아니기 때문이다. nextTickQueue라는 큐는 이벤트 루프의 phase에 상관 없이 현재 작업이 완료된 후에 처리가 된다. 어떤 phase에서든 process.nextTick()을 호출하게 되면 process.nextTick()에 전달된 모든 콜백이 이벤트 루프가 계속 진행되기 전에 실행된다.

### 왜 이런것이 생겨난걸까

이 nextTick은 딱봐도 잘못 사용했다가는 이벤트 큐 운용에 큰 문제를 줄것 같다. 그런데 왜 이런 기능을 추가하게 되었을까?
API는 필요하지 않은 경우에도 항상 비동기로 작동해야 한다는 철학 때문이다.

```js
function apiCall(arg, callback) {
  if (typeof arg !== "string")
    return process.nextTick(
      callback,
      new TypeError("argument should be string")
    );
}
```

위의 코드는 arg가 string인지 체크하고, string이 아닐 경우 에러를 전달한다.
만약에 nextTick이 아니였다면 이 에러는 다른 함수 실행 후에 실행되어 에러가 난 즉시 실행되지 못할 수 있다.
이때 process.nextTick()을 사용해서 apiCall이 나머지 코드가 실행되기 전에, 이벤트 루프가 진행되기 전에 해당 콜백을 실행시킬 수 있도록 하는 것이다.

하지만 아까 말했듯, 이 철학은 잠재적으로 문제가 될 수 있는 상황을 만들 수 있다.

```js
let bar;

// this has an asynchronous signature, but calls callback synchronously
function someAsyncApiCall(callback) {
  callback();
}

// the callback is called before `someAsyncApiCall` completes.
someAsyncApiCall(() => {
  // since someAsyncApiCall hasn't completed, bar hasn't been assigned any value
  console.log("bar", bar); // undefined
});

bar = 1;
```

someAsyncApiCall()을 비동기적으로 선언했지만, 실제로는 동기적으로 실행되어 console.log의 bar가 undefined로 나온다. 이 함수가 호출되면, someAsyncApiCall()에 주어진 콜백은 이벤트루프의 같은 phase에서 호출이 되기 때문이다.

콜백을 nextTick에 넣게되면 콜백이 호출되기 전에 모든 변수, 함수 등이 초기화 될 수 있다. 이벤트 루프가 계속 진행되기 전에 사용자에게 오류를 받아야 하는 경우에 유용하게 사용할 수 있다.

```js
let bar;

function someAsyncApiCall(callback) {
  process.nextTick(callback);
}

someAsyncApiCall(() => {
  console.log("bar", bar); // 1이 출력된다.
});

bar = 1;
```

https://blog.outsider.ne.kr/739
https://javaexpert.tistory.com/1001
