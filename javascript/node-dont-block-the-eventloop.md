> node.js 공식문서 [Don't block th event loop](https://nodejs.org/en/docs/guides/dont-block-the-event-loop/)를 번역한 글입니다.

# the Worker Pool

Node.js는 이벤트 루프에서 js코드를 실행하고 파일 io와 같은 값비싼 작업을 처리하는 Worker Pool을 제공한다. Node.js는 확장이 용이하고(scales well), 때로는 아파치와 같은 무거운 접근 방식보다 좋습니다. Node.js의 확장성의 비결은 많은 클라이언트를 처리하는데 적은 수의 스레드를 사용한다는 것에 있습니다. 만약 노드가 더 적은 스레드로 작업을 수행할 수 있다면 스레드에 대한 공간/시간 오버헤드를 감수하는 대신 클라이언트에서 작업하는데 더 많은 시간과 메모리를 사용할 수 있다. 하지만 노드는 적은 스레드를 가지고 있기 때문에 개발자는 이것들을 현명하게 사용할 수 있어야 한다.

노드 서버 속도를 유지하기 위한 좋은 법칙이 있다.

"노드는 각각의 클라이언트에 관련된 작업이 작을수록 빠르다 "

이것은 이벤트루프의 콜백과 worker pool의 task에 적용되는 법칙이다.

## 왜 이벤트 루프와 worker pool이 블록킹 되는 것을 피해야 하는가?

노드는 많은 클라이언트를 처리하는데 적은 개수의 스레드를 사용한다. 노드에는 두가지 종류의 스레드가 있다. 이벤트루프와 worker pool에 있는 worker이다.

만약 스레드가 콜백(이벤트루프) 또는 태스크(worker pool)를 실행하기 위해 오랜 시간이 걸린다면, 우리는 이것을 "blocked"됐다고 한다. 스레드가 한 클라이언트를 위한 작업을 하느라 blocked되는 동안 다른 클라이언트의 요청을 처리할 수 없다. 이는 이벤트 루프난 worker pool이 블록킹하지 않는 두가지 동기를 제공한다.

1. 퍼포먼스: 만약 무거운 작업을 정기적으로 수행하게 된다면 서버의 처리량이 저하된다.
2. 보안: 만약 특정 인풋으로 스레드가 블록되는 경우 악의적으로 클라이언트가 블록될 수 있는 인풋을 보내 스레드를 차단하고 다른 클라이언트에서 작동하지 못하게 할 수 있다.

### Event Loop에서 어떤 코드가 동작하는가?

서버가 시작하면, 가장 먼저 모듈을 요청하고 이벤트에 대한 콜백을 등록하는 초기화 단계를 거친다. 그리고 나서 노드 어플리케이션은 적절한 콜백을 실행하여 클라이언트 요청에 응답하기 위해 이벤트루프에 들어간다. 이 콜백은 동기적으로 실행되고, 완료 후에 후처리를 위해 비동기 요청을 등록할 수 있다. 이 비동기 요청을 위한 콜백들 또한 이벤트 루프에서 실행된다.

이벤트루프는 콜백에 의한 논블로킹 비동기 요청도 만족시킨다. e.g network IO

⇒ 이벤트루프는 이벤트에 등록된 자바스크립트 콜백을 실행하고 네트워크 IO와 같은 논블록킹 비동기 요청을 수행한다는 말이다.

### Worker Pool에서는 어떤 코드가 동작하는가?

노드에서 worker pool은 libuv 내부에서 구현된다. 노드는 "expensive"한 테스크를 처리하기 위해 워커 풀을 사용한다. 이 비싼 작업은 운영체제가 논블로킹 버전을 지원하지 않는 IO작업이나 CPU intensive한(CPU자원을 많이 소모하는?) 작업이 해당된다.

아래는 워커 풀을 사용하는 노드의 api이다.

1. I/O-intensive
   1. [DNS](https://nodejs.org/api/dns.html): `dns.lookup()`, `dns.lookupService()`.
   2. [File System](https://nodejs.org/api/fs.html#fs_threadpool_usage): All file system APIs except `fs.FSWatcher()` and those that are explicitly synchronous use libuv's threadpool.
2. CPU-intensive
   1. [Crypto](https://nodejs.org/api/crypto.html): `crypto.pbkdf2()`, `crypto.scrypt()`, `crypto.randomBytes()`, `crypto.randomFill()`, `crypto.generateKeyPair()`.
   2. [Zlib](https://nodejs.org/api/zlib.html#zlib_threadpool_usage): All zlib APIs except those that are explicitly synchronous use libuv's threadpool.

많은 노드 어플리케이션에서 이 api들은 워커풀을 위한 유일한 테스크 소스이다. [C++add-on](https://nodejs.org/api/addons.html#addons_c_addons)을 사용한 어플리케이션이나 모듈도 워커풀로 테스크를 보낼 수 있다.

완전성을 위해 이벤트루프 콜백에서 이러한 api를 호출하게 되면 완전성을 위해 이벤트루프는 해당 api를 c++로 바인딩할 때 약간의 setup cost를 지불하고 워커 풀로 테스크를 보낸다. 이 비용은 작업 전체 비용을 따져보면 무시해도 되는 정도의 비용이기 때문에 이벤트 루프가 오프로딩하는 것이다.

워커풀로 테스크를 전송할 때, 노드는 Node.js C++바인딩에서 c++함수에 대한 포인터를 제공한다.

### 어떻게 노드는 다음으로 실행할 코드를 결정하는가?

추상적으로, 이벤트루프와 워커 풀은 보류중인(pending) 이벤트와 테스크를 위해서 큐를 각자 가지고 있다.

구체적으로는 이벤트 루프는 실제로 큐를 유지(maintain)하지 않는다. 대신 운영체제에게 모니터링을 요청하는 file descriptor 모음이 있다. 이 파일 디스크립터는 네트워크 소캣, 감시중인 파일 등에 해당한다. 운영체제가 어떤 파일 디스크립터가 준비가 됐다고 말하면, 이벤트 루프는 이것을 적절한 이벤트로 해석하고 해당 이벤트와 연관된 콜백을 실행하게 된다.

반대로, 워커 풀은 실행 되어야 하는 테스크를 가진 실제 큐를 사용한다. 워커는 큐에서 테스크를 꺼내서 작업을 하고, 작업이 완료되면 작업 완료 이벤트를 이벤트 루프에 대해서 발생시킨다.

### What does this mean for application design?

아파치와 같이 클라이언트 당 1개의 스레드를 할당하는 경우, 각각의 대기중인 클라이언트는 자체 스레드에 할당된다. 운영체제는 인터럽트를 통해 다른 클라이언트에게 차례를 넘겨준다.

노드가 적은 스레드로 많은 클라이언트를 처리하기 때문에 만약 한 스레드가 블로킹한다면 대기중인 클라이언트 요청들은 그 스레드 작업이 끝날 때 까지 작업 기회를 받지 못할 수 있다. 요청을 공정하게 처리하는 것은 어플리케이션의 책임이다. 즉, 단일 콜백또는 테스크에서 너무 많은 작업을 수행해서는 안된다. (그럼 한 스레드의 작업시간이 길어지고(블로킹) 다른 요청 처리가 느려짐)

이것이 노드가 확장이 잘 될 수 있는 이유이기도 하지만 공정한 스케줄링을 보장할 책임이 있음을 의미하기도 한다. 다음 섹션에서는 어떻게 공덩한 스케줄링을 보장할 수 있는지에 대해 알아본다.

## Fair Schduling - How?

### 이벤트 루프를 block하지 마라.

이벤트 루프는 각가의 새로운 클라이언트 커넥션을 인식하고 응답 생성을 조정(orchestrates)한다.

모든 요청과 응답은 이벤트 루프를 지나간다. 이 말은 만약 이벤트 루프가 어떤 포인트에서 많은 시간을 사용한다면 새로운 요청은 차례를 얻지 못하게 된다.

절대 이벤트 루프를 블록해서는 안된다. 즉, 모든 콜백들은 빠르게 완료되어야 한다. 물론 await, promise에도 적용이 된다.

이를 보장하기 위한 좋은 방법은 콜백의 computational complexity를 추론하는 것이다.

노드는 v8엔진을 사용하는데, 대부분의 작업에서 매우 빠르지만 정규표현식, json 작업등에서는 예외이다.

### Avoiding vulnerable regular expressions

대부분의 정규표현식은 인풋 스트링을 한번만 검사하면 통과한다. O(n)하지만 가끔가다 O(2^n)의 시간 복잡도가 필요한 경우가 있다. 이러한 연산을 하게 되는 경우 이벤트 루프를 블로킹하게 된다.

### Json

JSON.parse와 JSON.stringify는 비용이 많이 드는 명령이다. json의 길이가 매우 커지면 그만큼 시간이 오래 걸리게 된다.

만약 서버가 json 객체를 조작하는 경우 이벤트 루프에서 작업하는 객체(문자열)의 크기에 주의해야 한다. npm에 json api를 비동기로 제공하는 모듈을 사용하는 게 좋다.

- [JSONStream](https://www.npmjs.com/package/JSONStream), which has stream APIs.
- [Big-Friendly JSON](https://www.npmjs.com/package/bfj), which has stream APIs as well as asynchronous versions of the standard JSON APIs using the partitioning-on-the-Event-Loop paradigm outlined below.

### Node.js core module

아래 모듈은 동기식으로 비용이 많이 드는 api를 가지고 있다. 암호화, 압축과 같은 중요한 계산을 하거나, file IO처럼 IO작업을 하기 때문에 비용이 많이 든다.

- [Encryption](https://nodejs.org/api/crypto.html)
  - `crypto.randomBytes` (synchronous version)
  - `crypto.randomFillSync`
  - `crypto.pbkdf2Sync`
  - You should also be careful about providing large input to the encryption and decryption routines.
- [Compression](https://nodejs.org/api/zlib.html)
  - `zlib.inflateSync`
  - `zlib.deflateSync`
- [File system](https://nodejs.org/api/fs.html)
  - Do not use the synchronous file system APIs. For example, if the file you access is in a distributed file system like NFS, access times can vary widely.
- [Child process](https://nodejs.org/api/child_process.html)
  - `child_process.spawnSync`
  - `child_process.execSync`
  - `child_process.execFileSync`

### 이벤트 루프를 블로킹하지 않고 복잡한 계산 하기

1. 파티셔닝

   갯수가 늘어나면서 오래걸리는 작업의 경우, 중간중간 다른 작업이 진행 될 수 있도록 허용한다!

   이는, Blocking을 막기 위해, 루프를 돌면서 **setImmediate 를 통해 우선순위를 뒤로 미루는 방식**으로 작동한다.

   계산을 분할해서 분할된 작업들이 각각 이벤트 루프에서 실행되게 할 수 있다. **클로저**를 이용해서 진행중인 작업의 상태를 쉽게 저장할 수 있다.

   1부터 n까지 수의 평균을 구한다고 가정해보자.

   ```jsx
   for (let i = 0; i < n; i++) sum += i;
   let avg = sum / n;
   console.log("avg: " + avg);
   ```

   파티셔닝하지 않은 채 수행하게 된다면 `O(n)` 의 시간복잡도를 가지게 된다.

   ```jsx
   function asyncAvg(n, avgCB) {
     // Save ongoing sum in JS closure.
     var sum = 0;
     function help(i, cb) {
       sum += i;
       if (i == n) {
         cb(sum);
         return;
       }

       // "Asynchronous recursion".
       // Schedule next operation asynchronously.
       setImmediate(help.bind(null, i + 1, cb));
     }

     // Start the helper, with CB to call avgCB.
     help(1, function (sum) {
       var avg = sum / n;
       avgCB(avg);
     });
   }

   asyncAvg(n, function (avg) {
     console.log("avg of 1-n: " + avg);
   });
   ```

   파티셔닝은 이벤트루프만을 사용하기 때문에 멀티코어의 장점을 사용할 수 없어 별로 좋은 옵션은 아니다. 이벤트루프는 클라이언트 요청을 조정(orchestrate)해야하며, 자체적으로 수행(fulfill)하지 않아야 한다. 복잡한 작업의 경우, 이벤트 루프의 작업을 워커 풀로 이동시키는 것이 좋다.

2. 오프로딩

   작업을 오프로드 할 수 있는 두가지 워커 풀이 있다.

   Node.js 10 버전에서 실험 기능으로 도입되었던 worker_threads 가 Node.js 12 버전부터는 stable 한 상태로 변경되어, 사용을 고려해 볼 수 있습니다.

   1. 내장 Node.js 워커 풀을 사용한다.
   2. IO에 맞춰진(themed) 워커 풀이 아닌 계산(computation) 전용 워커 풀을 만들어서 사용한다.

   그렇다고 모든 클라이언트에 대해 자식 프로세스를 생성해서는 안된다. 자식을 생성하는 시간보다 더 빠른 속도로 요청을 받을 수 있기 때문이다.

   ```java
   const {
     Worker, isMainThread, parentPort, workerData
   } = require('worker_threads')

   let eventLoopCount = 0
   setInterval(() => {
     eventLoopCount++
   }, 10)

   if (isMainThread) {
     const calcAvg = function calcAvg (script) {
       return new Promise((resolve, reject) => {
         const worker = new Worker(__filename, {
           workerData: script
         })
         worker.on('message', resolve)
         worker.on('error', reject)
         worker.on('exit', (code) => {
           if (code !== 0) { reject(new Error(`Worker stopped with exit code ${code}`)) }
         })
       })
     }
     module.exports = calcAvg
     const n = 10000000
     console.time('calc')

     calcAvg(n).then(avg => {
       console.timeEnd('calc')
       console.log('avg: ' + avg, 'eventLoopCount', eventLoopCount)
     })
   } else {
     const n = workerData
     let sum = 0
     for (let i = 0; i < n; i++) { sum += i }
     const avg = sum / (n - 1)

     parentPort.postMessage(avg)
   }
   ```

   Node.js 10 버전에서 사용해보기 위해, —experimental-worker flag를 이용해봅니다.

   ```jsx
    node --experimental-worker sniffets/workerLoop.js
   calc: 80.591ms
   avg: 5000000 eventLoopCount 7
   ```

   꽤 놀라운 결과입니다.

   계산 시간은 그렇게 많이 (그래도 4배 수준이지만..) 늘어나지 않았고,

   이벤트 루프도 정상적으로 실행되었습니다.

   숫자가 더 커지면 어떻게 될까요?

   ```
   node sniffets/normalLoop.js
   calc: 130.112ms
   avg: 50000000 eventLoopCount 0
   ```

   ```
   node --experimental-worker sniffets/workerLoop.js
   calc: 189.253ms
   avg: 50000000 eventLoopCount 15
   ```

   훌륭합니다.

   **단점**

   오프로딩의 단점은 통신 비용의 형태로 오버헤드가 발생한다는 것이다. 이벤트루프만이 어플리케이션의 namespace(js 상태)를 볼 수 있다. 워커는 이벤트 루프의 네임스페이스에 있는 js객체를 조작할 수 없다. 대신 공유하려는 객체를 직렬화/역직렬화 해야한다. 그러면 워커는 이 객체의 복사본에서 작업하고 수덩된 객체를 이벤트 루프에 리턴한다.

CPU-intensive한 작업과 IO-intensive한 작업은 특징이 다르다.

CPU-intensive한 작업은 워커가 스케줄된 경우에만 진행되며 워커는 머신의 논리적 코어 중 하나에 예약되어야 한다. 만약 4개의 논리 코어를 사용하고 있고, 워커가 5개라면 워커들 중 한개는 작업을 진행할 수 없다. 결과적으로 이 워커에 대한 오버헤드(메모리 할당, 스케줄링 비용)를 냈음에도 작업을 처리할 수 없게 되는 것이다.

IO-intensive한 작업은 외부 서비스 공급자(DNS, 파일 시스템 등)을 쿼리하고 응답을 기다리는 것이 포함된다. IO-intensive한 테스크를 할당받은 워커가 외부로부터의 응답을 기다리는동안 다른 일을 할 수 없으며 운영체제가 작업을 취소하고 다른 워커가 그 응답을 제출하도록 할 수 있다. 따라서 IO-intensive한 작업은 관련된 스레드가 실행하지 않는 동안에도 작업이 진행된다. db난 파일 시스템같은 외부 서비스 공급자는 여러 pending request를 한번에 처리하도록 최적화가 되어있다.

cpu작업과 IO작업은 서로 다른 특성을 지니고 잇기 때문에 만약 하나의 워커 풀을 사용하는 경우 프로그램의 성능을 저하시킬 수 있다. 따라서 별도의 Computation 워커 풀을 가지고 있는 것이 좋다.

오프로딩은 여러개의 코어를 사용하는 대신 통신 비용이 든다. (이벤트루프와 워커 풀 사이에 직렬화 된 객체를 전송하는 비용)

서버가 복잡한 계산에 크게 의존한다면 노드가 정말 적합한지 생각해봐야 한다. 노드는 IO작업에 탁월하지만 비용이 많이 드는 계산에는 최선의 선택이 아닐 수 있다.

## Don't block the Worker Pool

위에서 설명한 것 처럼 각 워커는 워커풀의 큐에 다음 작업으로 진행하기 전에 현재 작업을 완료한다.

이때 어떤 작업은 빨리 끝나고, 어떤 작업은 매우 오래 걸리는 작업일 것이다. 우리의 목표는 작업시간의 variation을 최소화 하는 것이며, 이를 위해 작업을 파티셔닝해야 한다.

### Minimizing the variation in Task times

만약 현재 워커에서 실행하는 작업이 다른 테스크보다 더 비싸다면 다른 보류중인 작업을 할 수 없다. 그래서 상대적으로 오래걸리는 작업은 작업이 끝날 때 까지 워커 풀의 크기를 줄인다.

워커 풀에 워커가 많을 수록 워커풀의 처리량이 커지고 서버의 처리량도 커지게 된다. 하지만 비용이 많이 드는 작업은 워커 풀의 크기를 줄이기 때문에 서버의 처리량 또한 줄어들게 되어 좋지 못하다.

이러한 현상을 피하기 위해서 워커 풀에 들어오는 테스크의 크기 차이를 최소화해야 할 필요가 있다. (너무 큰 길이의 작업이 들어오게 하는 것을 지양) 따라서 DB, FS와 같은 IO작업 요청에 대한 비용을 알고 있어야 하고 오레 걸릴 것 같은 요청은 제출하지 않도록 해야한다.

예를들어 서버가 요청을 처리하기 위해 `fs.readFile()` 을 이용해 파일을 읽어와야 한다고 가정해보자. 하지만 readFile() 메소드는 파티셔닝되어있지 않다. 파일 전체에 대해 하나의 fs.read()테스크를 제출한다. 만약 어떤 유저의 파일은 짧고, 어떤 유저의 파일은 무척 크다면 테스크 길이 에 상당한 변화를 가져와 워커 풀의 처리량을 저하시킬 수 있다.

## Task Partitioning

시간 비용이 가변적인 테스크는 테스크 풀의 처리량을 저하시킬 수 있다. 작업 시간의 변동을 최소화하기 위해서 가능하면 각각의 작업을 비슷한 크기로 분할해야 한다. 각각의 하위 테스크가 완료되면 다음 서브 테스크를 제출해야 하고, 최종적으로 작업이 완료되면 제출자에게 알려야 한다.

위의 fs.readFile()의 경우 ReadStream을 이용해 자동적으로 파티셔닝되도록 할 수 있다.

테스크를 서브 테스크로 나누면 긴 테스크는 짧은 테스크 보다 더 많은 서브 테스크로 나뉘게 될 것이다. 하지만 서브테스크의 크기가 작기 때문에 짧은 테스크를 완료한 워커에서 긴 테스크의 서브 테스크를 처리할 수 있기 때문에 워커 풀의 처리량이 향상될 수 있다.

Node.js 작업자 풀만 사용하든 별도의 작업자 풀을 유지하든 관계없이 테스크 파티셔닝을 통해 풀의 작업 처리량을 최적화해야 한다.

# npm 모듈의 리스크

Node.js 자체에서도 다양한 모듈을 제공하지만, 더 많은 것이 필요할 때가 있다. Node.js 개발자는 npm 생태계를 통해서 다양한 모듈을 사용할 수 있다.

하지만 이런 모듈 api가 이벤트 루프나 워커를 블록킹 하는지 체크해볼 필요가 있다.

간단한 api라면 측정을 해볼 수 있겠지만 대부분의 경우 aPI 비용이 어느정도인지 측정하기가 어렵다.

API가 비동기여도 워커나 이벤트 루프에서 얼마나 많은 시간을 소비할지 알 수 없다.

# 결론

0node.js는 이벤트 루프, 워커 두 종류의 스레드를 가지고 있다. 이벤트 루프는 js콜백 및 논블로킹 IO를 담당하고 워커는 블로킹IO및 CPU-intensive한 작업과 같은 작업을 실행한다.

어떠한 콜백이나 테스크가 실행 시간이 오래 걸린다면 스레드는 블로킹되고, 처리량이 저하되거나 최악의 경우 서비스가 거부될 수 있다.
