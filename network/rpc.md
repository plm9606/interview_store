# RPC

RPC(Remote Procedure call)이란, 별도의 원격 제어를 위한 코딩 없이 다른 주소 공간에서 리모트의 함수나 프로시저를 실행 할 수 있게 해주는 프로세스간 통신이다.
즉, 네트워크 디테일에 대해서 몰라도, 마치 local 함수를 호출하는 수준 정도로
다른 컴퓨터에 존재하는 프로그램 내의 함수, 혹은 프로시저를 호출할 수 있도록 하는 프로세스 간 통신 기술이라고 한다. (와우)

RPC는 IPC 방법의 한 종류로 원격지의 프로세스에 접근하여 프로시저 또는 함수를 호출하여 사용하는 방법을 말한다.

## rpc는 어쩌다 생겨난 것일까

RPC 모델은 분산컴퓨팅 환경에서 많이 사용되어왔으며, 현재에는 MSA(Micro Software Archtecture)에서 마이크로 서비스간에도 많이 사용되는 방식이다.서로 다른 언어나 프레임워크를 가진 마이크로서비스간의 프로시저 호출을 가능하게 해줌에 따라 언어에 구애받지 않고 환경에 대한 확장이 가능하며, 좀 더 비지니스 로직에 집중하여 생산성을 증가시킬 수 있다.

이것이 가능힌 이유는, 서비스로 IDL을 명시하고 그 IDL을 기반으로 자동 생성된 코드로 서로 통신이 이루어지기 때문이다.

그리고 HTTP를 이용한 REST API에서 몇몇 고질적인 문제가 있어서 (너무 느리다거나,, 오류가 많다거나,,) 이를 보완하기 위해 Google에서 HTTP2를 붙여, RPC형태로 릴리즈한 것이 바로 gRPC다.

### 소켓과 차이점

말하자면 소켓은 아파트의 주소와 같은 유니크한 값을 가지고 있고,
RPC는 이런 종류의 택배를 배달해주세요 ~ 와 같이 상황에 대한 정의라고 할 수 있다.
소켓이 특정한 주소를 가지고 있기 때문에, RPC가 택배를 배송할 때 소켓 연결을 이용할 수 있다.

나는 이전에 소켓 통신을 이용해 마이크로서비스간 통신 프로토콜을 구현한 적이 있다. 이때 수작업으로 포메팅을 해주어야 하고, 직접 네트워크 주소를 입력하고 보내야 하는 단점이 있었다.

RPC는

클라이언트 - 서버간의 커뮤니케이션에 필요한 상세한 정보는 최대한 감추고
클라이언트는 일반 메소드를 호출하는 것처럼 호출하면 된다.
서버도 마찬가지로 일반 메소드를 다루는 것처럼!

## 동작 원리

![](https://nesoy.github.io/assets/posts/img/2019-07-09-13-54-41.png)
![](https://blogfiles.pstatic.net/MjAyMDA1MTJfNzAg/MDAxNTg5MjcyMDgwNTM0.Wx9t_9U2cn41-8uuM20XPob5aWSVzlnhzfL1RJ1tILYg.Zh787-7l2Y7nYVYvrZrJ0LAIPST4AJn1tpdMadr1AKgg.PNG.islove8587/99D26A4E5BFF80270D.png?type=w2)

1. IDL(Interface Definition Language) 을 사용하여 서버의 호출 규약을 정의한다

   - 함수명, 인자, 반환값에 대한 데이터형이 정의된 IDL 파일을 rpcgen 컴파일러를 이용하여 stub 코드를 자동으로 생성한다.

2. stub는 원시소스코드(C코드 등) 형태로 만들어지므로 클라이언트, 서버 프로그램에 포함하여 빌드한다.

3. 클라이언트는 리모트의 프로시저를 사용하기 위해 설계된 stub의 프로시저를 호출하고, 필요한 인자와 비즈니스 로직에 필요한 메소드를 호출한다.

4. stub 코드는 데이터형을 서버가 이해할 수 있는 형식으로 변환하여 RPC 호출을 실행한다.
   - XDR 변환 이유는 기본 데이터 타입(정수형, 부동소수점 등)에 대한 메모리 저장방식(리틀엔디안, 빅엔디안)이 CPU 아키텍쳐별로 다르며, 네트워크 전송과정에서 바이트 전송 순서를 보장하기 위함이다.
5. 서버는 수신된 함수/프로시저 호출에 대한 처리 완료 후, 결과값을 변환하여 반환한다.
6. 최종적으로 클라이언트 프로그램은 서버의 결과값을 반환받는다.

### IDL(Interface Definition Language)

- 인터페이스에 대한 정의를 진행하는 언어. 각각의 시스템을 연결하는 고리가 된다.
- 클라이언트와 서버 간에 다른 언어를 사용할 수 있기 때문에 서로의 요청에 대해 이해하기 위해서 인터페이스를 통해 규칙을 명세해두고 각자의 시스템이 이해할 수 있는 형태로 변형한다.

### Caller / Callee

- 사용자(Client / Server)가 필요한 비즈니스 로직을 작성하는 Layer
- IDL(interface definition language)로 작성

### Stub

- Stub Compiler가 IDL 파일을 읽어 원하는 Language로 생성.
- Parameter Object를 Message로 marshalling/unmarshalling하는 Layer

### RPC RunTime

- Server와 Client를 Binding하는 Layer
- 커뮤니케이션 중 발생한 에러 처리도 진행

---

**참고**

- https://nesoy.github.io/articles/2019-07/RPC
- https://real-dongsoo7.tistory.com/131
- https://corgipan.tistory.com/6
- https://blog.naver.com/PostView.nhn?blogId=islove8587&logNo=221959018268
- https://grpc.io/docs/languages/node/quickstart/
